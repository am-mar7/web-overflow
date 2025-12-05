"use server";
import {
  ActionResponse,
  Answer,
  createAnswerParams,
  deleteAnswerParams,
  ErrorResponse,
  getAnswersParams,
} from "@/Types/global";
import actionHandler from "../handlers/action";
import {
  createAnswerSchema,
  deleteAnswerSchema,
  getAnswersSchema,
} from "../validation";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Answer as answerModel, Interaction, Question, Vote } from "@/models";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { IAnswerDoc } from "@/models/answer.model";
import { IQuestionDoc } from "@/models/question.model";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";
import { after } from "next/server";

export async function createAnswer(
  params: createAnswerParams
): Promise<ActionResponse<IAnswerDoc>> {
  const validated = await actionHandler({
    params,
    schema: createAnswerSchema,
    authorizetionProccess: true,
  });

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const userId = validated?.session?.user?.id;

  const { questionId, content } = validated.params!;
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    if (!userId) throw new UnauthorizedError();

    const question = (await Question.findById(questionId)) as IQuestionDoc;
    if (!question) throw new NotFoundError("Question");

    const [answer] = await answerModel.create(
      [
        {
          question: questionId,
          author: userId,
          content,
        },
      ],
      { session }
    );
    if (!answer) throw new Error("Failed to create the answer");

    question.answers += 1;
    await question.save({ session });
    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    after(async () => {
      await Interaction.create({
        action: "post",
        actionId: answer._id.toString(),
        actionType: "answer",
        authorId: question.author.toString(),
      });
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(answer)),
    } as ActionResponse<IAnswerDoc>;
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getAnswers(params: getAnswersParams): Promise<
  ActionResponse<{
    answers: Answer[];
    isNext: boolean;
    totalAnswers: number;
  }>
> {
  const validated = await actionHandler({
    params,
    schema: getAnswersSchema,
  });

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const { questionId, page = 1, pageSize = 10, filter } = validated.params!;
  let sortCriteria = {};
  const skip = (page - 1) * pageSize;

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
  }

  try {
    const totalAnswers = await answerModel.countDocuments({
      question: questionId,
    });

    const answers = await answerModel
      .find({ question: questionId })
      .populate("author")
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteAnswer(
  params: deleteAnswerParams
): Promise<ActionResponse> {
  const validate = await actionHandler({
    params,
    schema: deleteAnswerSchema,
    authorizetionProccess: true,
  });

  if (validate instanceof Error) return handleError(validate) as ErrorResponse;

  const { answerId } = validate.params!;
  const userId = validate.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const answer = (await answerModel
      .findById(answerId)
      .session(session)) as IAnswerDoc;

    if (!answer) throw new NotFoundError("Answer");
    if (answer.author.toString() !== userId)
      throw new UnauthorizedError(
        "You are not authorized to delete this answer"
      );

    await Vote.deleteMany({
      targetType: "answer",
      targetId: answer._id,
    }).session(session);

    await Question.findByIdAndUpdate(answer.question, {
      $inc: { answers: -1 },
    }).session(session);

    await answerModel.findByIdAndDelete(answerId).session(session);

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(answer.question._id.toString()));
    revalidatePath(ROUTES.PROFILE(userId));

    after(async () => {
      await Interaction.create({
        action: "delete",
        actionId: answer._id.toString(),
        actionType: "answer",
        authorId: userId,
      });
    });

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
