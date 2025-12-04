"use server";

import {
  ActionResponse,
  Answer,
  ErrorResponse,
  PaginatedSearchParams,
  Question,
  User,
  getUserAnswersParams,
  getUserQuestionsParams,
  getUserTagsParams,
} from "@/Types/global";
import actionHandler from "../handlers/action";
import {
  getUserSchema,
  PaginatedSearchParamsSchema,
  getUserQuestionsSchema,
  getUserTagsSchema,
  getUserAnswersSchema,
} from "../validation";
import handleError from "../handlers/error";
import mongoose, { PipelineStage, Types } from "mongoose";
import {
  Answer as answerModel,
  Question as questionModel,
  User as userModel,
} from "@/models";
import { NotFoundError } from "../http-errors";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
  const validate = await actionHandler({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validate instanceof Error) return handleError(validate) as ErrorResponse;

  let sortCriteria = {};
  const filterQuery: mongoose.QueryFilter<typeof userModel> = {};

  const { query, filter, page = 1, pageSize = 10 } = validate.params!;

  const skip = (page - 1) * pageSize;

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
  }

  if (query) {
    filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
  }

  try {
    const usersCount = await userModel.countDocuments(filterQuery);
    const users = await userModel
      .find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    const isNext = usersCount > skip + users.length;
    return {
      success: true,
      data: { isNext, users: JSON.parse(JSON.stringify(users)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(userId: string): Promise<ActionResponse<User>> {
  const validate = await actionHandler({
    params: { userId },
    schema: getUserSchema,
  });
  if (validate instanceof Error) return handleError(validate) as ErrorResponse;

  try {
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError("User");

    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(
  params: getUserQuestionsParams
): Promise<ActionResponse<{ isNext: boolean; questions: Question[] }>> {
  const validate = await actionHandler({
    params,
    schema: getUserQuestionsSchema,
  });
  if (validate instanceof Error) return handleError(validate) as ErrorResponse;

  const { userId, page = 1, pageSize = 10 } = validate.params!;
  const skip = (page - 1) * pageSize;
  try {
    const [questionsCount, questions] = await Promise.all([
      questionModel.countDocuments({ author: userId }),
      questionModel
        .find({ author: userId })
        .populate("tags")
        .populate("author")
        .skip(skip)
        .limit(pageSize),
    ]);

    if (!questions) throw new Error("Failed to find user's questions");
    const isNext = questionsCount > skip + questions.length;
    return {
      success: true,
      data: { isNext, questions: JSON.parse(JSON.stringify(questions)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserAnswers(
  params: getUserAnswersParams
): Promise<ActionResponse<{ isNext: boolean; answers: Answer[] }>> {
  const validate = await actionHandler({
    params,
    schema: getUserAnswersSchema,
  });
  if (validate instanceof Error) return handleError(validate) as ErrorResponse;

  const { userId, page = 1, pageSize = 10 } = validate.params!;
  const skip = (page - 1) * pageSize;
  try {
    const [answersCount, answers] = await Promise.all([
      answerModel.countDocuments({ author: userId }),
      answerModel
        .find({ author: userId })
        .populate("author")
        .skip(skip)
        .limit(pageSize),
    ]);

    if (!answers) throw new Error("Failed to find user's questions");
    const isNext = answersCount > skip + answers.length;
    return {
      success: true,
      data: { isNext, answers: JSON.parse(JSON.stringify(answers)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserTags(
  params: getUserTagsParams
): Promise<ActionResponse<{ _id: string; name: string; count: number }[]>> {
  const validate = await actionHandler({
    params,
    schema: getUserTagsSchema,
  });
  if (validate instanceof Error) return handleError(validate) as ErrorResponse;

  const { userId } = validate.params!;

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tag",
        },
      },
      { $unwind: "$tag" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {$project: {
        _id: "$tag._id",
        name: "$tag.name",
        count: 1,
      }}
    ];
    const userTags = await questionModel.aggregate(pipeline);
    return { success: true, data: userTags };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
