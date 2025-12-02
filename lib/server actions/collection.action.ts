"use server";

import {
  ActionResponse,
  Collection,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/Types/global";
import actionHandler from "../handlers/action";
import handleError from "../handlers/error";
import { PaginatedSearchParamsSchema, CollectionSchema } from "../validation";
import mongoose, { PipelineStage } from "mongoose";
import { UnauthorizedError } from "../http-errors";
import { Collection as collectionModel } from "@/models";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function toggleSaveQuestion(
  questionId: string
): Promise<ActionResponse> {
  const validated = await actionHandler({
    params: { questionId },
    schema: CollectionSchema,
    authorizetionProccess: true,
  });
  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const userId = validated.session?.user?.id;
  if (!userId) return handleError(new UnauthorizedError()) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const savedQuestion = await collectionModel
      .findOneAndDelete({
        question: questionId,
        author: userId,
      })
      .session(session);
    if (!savedQuestion) {
      const [collection] = await collectionModel.create(
        [
          {
            question: questionId,
            author: userId,
          },
        ],
        { session }
      );
      if (!collection) throw new Error("Failed to add question collection");
    }
    await session.commitTransaction();
    revalidatePath(ROUTES.QUESTION(questionId));
    revalidatePath(ROUTES.HOME);
    return { success: true } as ActionResponse;
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getCollections(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Collection[]; isNext: boolean }>> {
  const validated = await actionHandler({
    params,
    schema: PaginatedSearchParamsSchema,
    authorizetionProccess: true,
  });
  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const userId = validated.session?.user?.id;
  if (!userId) return handleError(new UnauthorizedError()) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = validated.params!;
  const skip = (page - 1) * pageSize;

  type sortOptionsType = Record<string, Record<string, 1 | -1>>;
  const sortOptions: sortOptionsType = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostvoted: { "question.upvotes": -1 },
    mostviewed: { "question.views": -1 },
    mostanswered: { "question.answers": -1 },
  };

  const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || {
    "question.createdAt": -1,
  };

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: query, $options: "i" } },
            { "question.content": { $regex: query, $options: "i" } },
          ],
        },
      });
    }
    const [questionsCount] = await collectionModel.aggregate([
      ...pipeline,
      { $count: "count" },
    ]);

    pipeline.push(
      { $sort: sortCriteria },
      { $skip: skip },
      { $limit: pageSize }
    );
    pipeline.push({ $project: { question: 1, author: 1 } });

    const questions = await collectionModel.aggregate(pipeline);

    const totalCount = questionsCount?.count || 0;
    const isNext = totalCount > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSavedQuestion(
  questionId: string
): Promise<ActionResponse<{ hasSaved: boolean }>> {
  const validated = await actionHandler({
    params: { questionId },
    schema: CollectionSchema,
    authorizetionProccess: true,
  });
  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const userId = validated.session?.user?.id;
  if (!userId) return handleError(new UnauthorizedError()) as ErrorResponse;

  try {
    const saved = await collectionModel.find({
      author: userId,
      question: questionId,
    });

    return { success: true, data: { hasSaved: saved.length > 0 } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
