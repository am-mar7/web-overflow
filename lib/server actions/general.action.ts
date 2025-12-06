"use server";

import {
  ActionResponse,
  ErrorResponse,
  GlobalSearchedItem,
  globalSearchParams,
} from "@/Types/global";
import { globalSearchSchema } from "../validation";
import actionHandler from "../handlers/action";
import handleError from "../handlers/error";
import { Answer, Question, Tag, User } from "@/models";

export async function globalSearch(
  params: globalSearchParams
): Promise<ActionResponse<GlobalSearchedItem[]>> {
  const validated = await actionHandler({
    params,
    schema: globalSearchSchema,
  });

  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  const { query, type } = validated.params!;
  const regexQuery = { $regex: query, $options: "i" };

  const modelsAndTypes = [
    { model: Question, type: "question", searchField: "title" },
    { model: Answer, type: "answer", searchField: "content" },
    { model: User, type: "user", searchField: "name" },
    { model: Tag, type: "tag", searchField: "name" },
  ];
  const searchableTypes = modelsAndTypes.map((item) => item.type);
  const searchResult = [];
  try {
    if (!type || !searchableTypes.includes(type?.toLocaleLowerCase())) {
      for (const { model, type, searchField } of modelsAndTypes) {
        const res = await model.find({ [searchField]: regexQuery }).limit(2);

        searchResult.push(
          ...res.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            id: type === "answer" ? item.question : item._id,
            type,
          }))
        );
      }
    } else {
      const { model, searchField } =
        modelsAndTypes.find((item) => item.type === type.toLocaleLowerCase()) ||
        {};
      if (!model || !searchField) throw new Error("type is not valid");

      const res = await model
        .find({
          [searchField]: regexQuery,
        })
        .limit(8);

      searchResult.push(
        ...res.map((item) => ({
          title:
            type === "answer"
              ? `Answers containing ${query}`
              : item[searchField],
          id: type === "answer" ? item.question : item._id,
          type,
        }))
      );
    }
    return {
      success: true,
      data: JSON.parse(JSON.stringify(searchResult)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
