"use server";

import {
  ActionResponse,
  createInteractionParams,
  ErrorResponse,
  updateReputationParams,
} from "@/Types/global";
import actionHandler from "../handlers/action";
import { createInteractionSchema } from "../validation";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { Interaction, User } from "@/models";
import { IInteractionDoc } from "@/models/interaction.model";
import mongoose from "mongoose";

export async function createInteraction(
  params: createInteractionParams
): Promise<ActionResponse<IInteractionDoc>> {
  const validate = await actionHandler({
    params,
    schema: createInteractionSchema,
    authorizetionProccess: true,
  });
  if (validate instanceof Error) return handleError(validate) as ErrorResponse;

  const performerId = validate.session?.user?.id;
  const { action, actionId, actionType, authorId } = validate.params!;
  if (!performerId)
    return handleError(new UnauthorizedError()) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interaction]: IInteractionDoc[] = await Interaction.create(
      [
        {
          authorId : performerId,
          action,
          actionType,
          actionId,
        },
      ],
      { session }
    );
    if (!interaction) throw new Error("Failed to create new interaction");

    await updateReputation({
      authorId,
      performerId,
      interaction,
      session,
    });

    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(interaction)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

async function updateReputation(params: updateReputationParams) {
  const { session, authorId, performerId, interaction } = params;

  let performerPoints = 0;
  let authorPoints = 0;
  const { action, actionType } = interaction;

  switch (action) {
    case "view":
      authorPoints = 2;
      break;
    case "upvote":
      performerPoints = 2;
      authorPoints = 10;
      break;
    case "downvote":
      performerPoints = -1;
      authorPoints = -2;
      break;
    case "post":
      authorPoints = actionType === "question" ? 5 : 10;
      break;
    case "delete":
      authorPoints = actionType === "question" ? -5 : -10;
      break;
  }

  if (authorId === performerId) {
    await User.findByIdAndUpdate(authorId, {
      $inc: { reputation: authorPoints },
    }).session(session);
    return;
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: authorId },
          update: { $inc: { reputation: authorPoints } },
        },
      },
      {
        updateOne: {
          filter: { _id: performerId },
          update: { $inc: { reputation: performerPoints } },
        },
      },
    ],
    { session }
  );
}
