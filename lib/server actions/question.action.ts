"use server";
import {
  ActionResponse,
  deleteQuestionParams,
  ErrorResponse,
  incrementViewsParams,
  PaginatedSearchParams,
  Question,
  QuestionParams,
  updateQuestionParams,
} from "@/Types/global";
import actionHandler from "../handlers/action";
import {
  createQuestionSchema,
  deleteQuestionSchema,
  editQuestionSchema,
  getQuestionSchema,
  incrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "../validation";
import handleError from "../handlers/error";
import questionModel, { IQuestionDoc } from "@/models/question.model";
import mongoose, { ObjectId } from "mongoose";
import TagQuestion, { ITagQuestion } from "@/models/tag-question.model";
import Tag, { ITagDoc } from "@/models/tag.model";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { dbConnect } from "../mongoose";
import { revalidatePath } from "next/cache";
import { Answer, Collection, ViewQuestion, Vote } from "@/models";
import { IAnswerDoc } from "@/models/answer.model";
import { after } from "next/server";
import { createInteraction } from "./interaction.action";

export async function createQuestion(
  params: QuestionParams
): Promise<ActionResponse<Question | null>> {
  const validatedParams = await actionHandler({
    params,
    schema: createQuestionSchema,
    authorizetionProccess: true,
  });
  if (validatedParams instanceof Error)
    return handleError(validatedParams) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  const { title, content, tags } = validatedParams.params!;
  const userId = validatedParams.session?.user?.id;
  try {
    if (!userId) throw new UnauthorizedError();

    const [question]: IQuestionDoc[] = await questionModel.create(
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

    await questionModel.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );
    await session.commitTransaction();

    revalidatePath("/", "layout");

    after(async () => {
      await createInteraction({
        action: "post",
        actionId: question._id.toString(),
        actionType: "question",
        authorId: userId,
      });
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    } as ActionResponse<Question>;
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function updateQuestion(
  params: updateQuestionParams
): Promise<ActionResponse<Question | null>> {
  const validatedParams = await actionHandler({
    params,
    schema: editQuestionSchema,
    authorizetionProccess: true,
  });
  if (validatedParams instanceof Error)
    return handleError(validatedParams) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  const { title, content, tags, questionId } = validatedParams.params!;
  const userId = validatedParams.session?.user?.id;

  try {
    const question = await questionModel.findById(questionId).populate("tags");
    if (!question) throw new Error("Question not found");

    if (question.author.toString() !== userId)
      throw new UnauthorizedError(
        "You are not authorized to edit this question"
      );
    if (title !== question.title || content !== question.content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }
    const tagsToAdd = tags.filter(
      (tag) =>
        !question.tags.some(
          (t: ITagDoc) => t.name.toLowerCase() === tag.toLowerCase()
        )
    );

    const tagsToRemove = (question.tags as ITagDoc[]).filter(
      (tag) => !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
    );

    const tagIds: ObjectId[] = [];
    const tagDocs: ITagQuestion[] = [];

    for (const tag of tagsToAdd) {
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

    if (tagsToRemove.length > 0) {
      const tagsToRemoveIds = tagsToRemove.map((tag) => tag._id);
      await Tag.updateMany(
        { _id: { $in: tagsToRemoveIds } },
        { $inc: { questions: -1 } },
        { session }
      );

      await TagQuestion.deleteMany(
        { tag: { $in: tagsToRemoveIds }, question: question._id },
        { session }
      );

      await questionModel.findByIdAndUpdate(
        question._id,
        { $pull: { tags: { $in: tagsToRemoveIds } } },
        { session }
      );
    }
    if (tagIds.length)
      await questionModel.findByIdAndUpdate(
        question._id,
        { $push: { tags: { $each: tagIds } } },
        { session }
      );

    if (tagDocs.length) await TagQuestion.insertMany(tagDocs, { session });

    await session.commitTransaction();
    await question.save();

    revalidatePath("/", "layout");

    after(async () => {
      await createInteraction({
        action: "edit",
        actionId: question._id.toString(),
        actionType: "question",
        authorId: question.author.toString(),
      });
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    } as ActionResponse<Question>;
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestion(
  questionId: string
): Promise<ActionResponse<Question | null>> {
  const validated = await actionHandler({
    params: { questionId },
    schema: getQuestionSchema,
  });
  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;
  try {
    const question = await questionModel
      .findOne({ _id: questionId })
      .populate("tags")
      .populate("author");
    console.log("Question", question);

    if (!question) throw new NotFoundError("Question");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    } as ActionResponse<Question>;
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getQuestions(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    questions: Question[];
    isNext: boolean;
  }>
> {
  const validate = await actionHandler({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validate instanceof Error) return handleError(validate) as ErrorResponse;

  let sortCriteria = {};
  const filterQuery: mongoose.QueryFilter<typeof questionModel> = {};

  const { query, filter, page = 1, pageSize = 10 } = validate.params!;

  try {
    if (filter === "recommended") {
      return { success: true, data: { questions: [], isNext: false } };
    }
    switch (filter) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "unanswered":
        filterQuery.answers = 0;
        sortCriteria = { answers: -1 };
        break;
      case "popular":
        sortCriteria = { upvotes: -1 };
    }

    if (query) {
      filterQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    const questionCount = await questionModel
      .find(filterQuery)
      .countDocuments();
    const skip = (page - 1) * pageSize;
    const questions = await questionModel
      .find(filterQuery)
      .sort(sortCriteria)
      .limit(pageSize)
      .skip(skip)
      .populate("tags", "name")
      .populate("author", "name image");

    const isNext = questionCount > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)) as Question[],
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getHotQuestions(): Promise<ActionResponse<Question[]>> {
  try {
    await dbConnect();

    const questions = await questionModel
      .find()
      .sort({ upvotes: -1, views: -1 })
      .limit(5);

    return { success: true, data: questions };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteQuestion(
  params: deleteQuestionParams
): Promise<ActionResponse> {
  const validate = await actionHandler({
    params,
    schema: deleteQuestionSchema,
    authorizetionProccess: true,
  });

  if (validate instanceof Error) return handleError(validate) as ErrorResponse;

  const { questionId } = validate.params!;
  const userId = validate.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question = (await questionModel
      .findById(questionId)
      .session(session)) as IQuestionDoc;
    if (!question) throw new NotFoundError("Question");

    if (question.author.toString() !== userId || !userId)
      throw new UnauthorizedError(
        "You are not authorized to delete this question"
      );

    await Collection.deleteMany({ question: questionId }).session(session);
    await TagQuestion.deleteMany({ question: questionId }).session(session);

    await Vote.deleteMany({
      targetType: "question",
      targetId: questionId,
    }).session(session);

    const answers = (await Answer.find({ question: questionId }).session(
      session
    )) as IAnswerDoc[];

    if (question.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questions: -1 } },
        { session }
      );
      await Tag.deleteMany({ questions: { $lte: 0 } }, { session });
    }

    if (answers.length) {
      await Answer.deleteMany({ question: questionId }).session(session);
      const answersIds = answers.map((answer) => answer._id);
      await Vote.deleteMany({
        targetType: "answer",
        targetId: { $in: answersIds },
      }).session(session);
    }

    await questionModel.findByIdAndDelete(questionId).session(session);
    await session.commitTransaction();

    revalidatePath("/", "layout");

    after(async () => {
      await createInteraction({
        action: "delete",
        actionId: questionId,
        actionType: "question",
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

export async function incrementViews(
  params: incrementViewsParams
): Promise<ActionResponse> {
  const validate = await actionHandler({
    params,
    schema: incrementViewsSchema,
  });
  if (validate instanceof Error) return handleError(validate) as ErrorResponse;

  const { questionId, viewer } = validate.params!;

  if (!viewer) return handleError(new UnauthorizedError()) as ErrorResponse;

  try {
    const existingView = await ViewQuestion.findOne({
      questionId,
      viewer,
    });

    if (existingView) return { success: true };

    const [view] = await ViewQuestion.create([{ questionId, viewer }]);
    if (!view) throw new Error("Failed to create new view");

    const question = (await questionModel.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    })) as IQuestionDoc;

    revalidatePath("/", "layout");

    after(async () => {
      await createInteraction({
        action: "view",
        actionId: questionId,
        actionType: "question",
        authorId: question.author.toString(),
      });
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
