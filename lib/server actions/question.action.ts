"use server";
import { ActionResponse, QuestionParams } from "@/Types/global";
import actionHandler from "../handlers/action";
import { createQuestionSchema } from "../validation";
import handleError from "../handlers/error";
import Question, { IQuestionDoc } from "@/models/question.model";
import mongoose, { ObjectId } from "mongoose";
import TagQuestion, { ITagQuestion } from "@/models/tag-question.model";
import Tag from "@/models/tag.model";

export async function createQuestion(
  params: QuestionParams
): Promise<ActionResponse<IQuestionDoc | null>> {
  const validatedParams = await actionHandler({
    params,
    schema: createQuestionSchema,
    authorizetionProccess: true,
  });
  if (validatedParams instanceof Error)
    return handleError(validatedParams) as ActionResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  const { title, content, tags } = validatedParams.params!;
  const userId = validatedParams.session?.user?.id;
  try {
    const [question] = await Question.create(
      [
        {
          author: userId,
          title,
          content,
        },
      ],
      { session }
    );
    if (!question) throw new Error("Failed to create question");

    const tagIds: ObjectId[] = [];
    const tagDocs: ITagQuestion[] = [];

    for (const tag of tags) {
      const newTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );
      if (!newTag) throw new Error(`Failed to create tag: ${tag}`);

      tagIds.push(newTag._id);
      tagDocs.push({
        tag: newTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagDocs, { session });

    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    } as ActionResponse<IQuestionDoc>;
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ActionResponse;
  } finally {
    await session.endSession();
  }
}
