"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Tag,
} from "@/Types/global";
import handleError from "../handlers/error";
import { Tag as tagModel } from "@/models";
import actionHandler from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validation";
import mongoose from "mongoose";

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


