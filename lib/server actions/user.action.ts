"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  User,
} from "@/Types/global";
import actionHandler from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { User as userModel } from "@/models";

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
