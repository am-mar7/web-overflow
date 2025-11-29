"use server";

import {
  ActionResponse,
  ErrorResponse,
  getTagQUestionParams,
  PaginatedSearchParams,
  Question,
  Tag,
} from "@/Types/global";
import handleError from "../handlers/error";
import { Question as questionModel, Tag as tagModel } from "@/models";
import actionHandler from "../handlers/action";
import {
  getTagQuestionSchema,
  PaginatedSearchParamsSchema,
} from "../validation";
import mongoose from "mongoose";
import { NotFoundError } from "../http-errors";

export async function getTags(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ isNext: boolean; data: Tag[] }>> {
  const validated = actionHandler({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  let sortCriteria = {};
  const filterQuery: mongoose.QueryFilter<typeof tagModel> = {};

  const { page = 1, pageSize = 10, query, filter } = params;

  try {
    if (query) {
      filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
    }

    switch (filter) {
      case "popular":
        sortCriteria = { questions: -1 };
        break;
      case "recent":
        sortCriteria = { createdAt: -1 };
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      case "name":
        sortCriteria = { name: 1 };
        break;
      default:
        sortCriteria = { questions: -1 };
        break;
    }

    const tagsCount = await tagModel.countDocuments(filterQuery);
    const skip = (page - 1) * pageSize;
    const tags = await tagModel
      .find(filterQuery)
      .sort(sortCriteria)
      .lean()
      .limit(pageSize)
      .skip(skip);

    const isNext = tagsCount > skip + tags.length;

    return {
      success: true,
      data: { isNext, data: JSON.parse(JSON.stringify(tags)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getTagQuestion(
  params: getTagQUestionParams
): Promise<ActionResponse<{ isNext: boolean; data: Question[] }>> {
  const validated = actionHandler({
    params,
    schema: getTagQuestionSchema,
  });
  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const { page = 1, pageSize = 10, query, tagId } = params;
  const skip = (Number(page) - 1) * pageSize;

  try {
    const tag = await tagModel.findById(tagId);
    if (!tag) throw new NotFoundError("Tag");

    const filterQuery: mongoose.QueryFilter<typeof questionModel> = {
      tags: { $in: [tagId] },
    };
    if (query) {
      filterQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    const questionsCount = await questionModel.countDocuments(filterQuery);
    const questions = await questionModel
      .find(filterQuery)
      .populate("author")
      .populate("tags")
      .skip(skip)
      .limit(pageSize);
    const isNext = questionsCount > questions.length + skip;

    return {
      success: true,
      data: { isNext, data: JSON.parse(JSON.stringify(questions)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
