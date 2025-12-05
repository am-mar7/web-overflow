"use server";

import mongoose, { ClientSession } from "mongoose";
import {
  ActionResponse,
  createVoteParams,
  ErrorResponse,
  hasVotedParams,
  HasVotedResponse,
  updateVoteParams,
} from "@/Types/global";
import actionHandler from "../handlers/action";
import handleError from "../handlers/error";
import {
  createVoteSchema,
  hasVotedSchema,
  updateVoteSchema,
} from "../validation";
import { UnauthorizedError } from "../http-errors";
import { Answer, Question, Vote } from "@/models";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";
import { after } from "next/server";
import { createInteraction } from "./interaction.action";
import { IQuestionDoc } from "@/models/question.model";
import { IAnswerDoc } from "@/models/answer.model";

// only called in try block
async function updateVoteCount(
  params: updateVoteParams,
  session: ClientSession
) {
  const validated = await actionHandler({
    params,
    schema: updateVoteSchema,
  });
  // throwing error beacuse this Fn is called in try block
  if (validated instanceof Error) throw validated;

  const { targetId, targetType, voteType, change } = validated.params!;
  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  const result = await Model.findByIdAndUpdate(
    targetId,
    { $inc: { [voteField]: change } },
    { new: true, session }
  );
  if (!result) throw new Error("Failed to update vote count");
}

export async function createVote(
  params: createVoteParams
): Promise<ActionResponse> {
  const validated = await actionHandler({
    params,
    schema: createVoteSchema,
    authorizetionProccess: true,
  });
  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  const { targetId, targetType, voteType } = validated.params!;
  const userId = validated.session?.user?.id;
  try {
    if (!userId) throw new UnauthorizedError();

    const existingVote = await Vote.findOne({
      author: userId,
      targetId,
      targetType,
    }).session(session);
    if (existingVote) {
      if (voteType === existingVote.voteType) {
        // user is trying to unvote
        await Vote.findByIdAndDelete(existingVote._id).session(session);
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType,
            change: -1,
          },
          session
        );
      } else {
        // user is trying to change his vote
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session }
        );
        await Promise.all([
          updateVoteCount(
            {
              targetId,
              targetType,
              voteType,
              change: 1,
            },
            session
          ),
          updateVoteCount(
            {
              targetId,
              targetType,
              voteType: existingVote.voteType,
              change: -1,
            },
            session
          ),
        ]);
      }
    } else {
      const [vote] = await Vote.create(
        [
          {
            author: userId,
            targetId,
            targetType,
            voteType,
          },
        ],
        { session }
      );
      if (!vote) throw new Error("Failed to create new vote");

      await updateVoteCount(
        {
          targetId,
          targetType,
          voteType,
          change: 1,
        },
        session
      );
    }

    await session.commitTransaction();
    revalidatePath(ROUTES.QUESTION(targetId));

    after(async () => {
      const model = targetType === "question" ? Question : Answer;
      const target = await model.findById(targetId) as IQuestionDoc | IAnswerDoc;

        await createInteraction({
          performerId: userId,
          action: voteType,
          actionId: targetId,
          actionType: targetType,
          authorId: target.author.toString(),
        });
      });
  

    return { success: true } as ActionResponse;
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function hasVoted(
  params: hasVotedParams
): Promise<ActionResponse<HasVotedResponse>> {
  const validated = await actionHandler({
    params,
    schema: hasVotedSchema,
    authorizetionProccess: true,
  });

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const { targetId, targetType } = validated.params!;
  const userId = validated.session?.user?.id;

  try {
    if (!userId) throw new UnauthorizedError();

    const vote = await Vote.findOne({
      author: userId,
      targetId,
      targetType,
    });

    return {
      success: true,
      data: {
        hasUpvoted: vote?.voteType === "upvote",
        hasDownvoted: vote?.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
