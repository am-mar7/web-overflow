"use server";
import {
  ActionResponse,
  deleteQuestionParams,
  ErrorResponse,
  incrementViewsParams,
  PaginatedSearchParams,
  Question,
  QuestionParams,
  RecommendationParams,
  updateQuestionParams,
} from "@/Types/global";
import actionHandler from "../handlers/action";
import {
  createQuestionSchema,
  deleteQuestionSchema,
  editQuestionSchema,
  getQuestionSchema,
  PaginatedSearchParamsSchema,
} from "../validation";
import handleError from "../handlers/error";
import questionModel, { IQuestionDoc } from "@/models/question.model";
import mongoose, { ObjectId, Types } from "mongoose";
import TagQuestion, { ITagQuestion } from "@/models/tag-question.model";
import Tag, { ITagDoc } from "@/models/tag.model";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { dbConnect } from "../mongoose";
import { revalidatePath } from "next/cache";
import { Answer, Collection, Interaction, ViewQuestion, Vote } from "@/models";
import { IAnswerDoc } from "@/models/answer.model";
import { after } from "next/server";
import { createInteraction } from "./interaction.action";
import ROUTES from "@/constants/routes";
import { cache } from "react";
import { auth } from "@/auth";

export async function createQuestion(
  params: QuestionParams
): Promise<ActionResponse<Question | null>> {
  const validated = await actionHandler({
    params,
    schema: createQuestionSchema,
    authorizetionProccess: true,
  });

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  const { title, content, tags } = validated.params!;
  const userId = validated.session?.user?.id;
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

    const tagResults = await Promise.all(
      tags.map((tag) =>
        Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        )
      )
    );

    const tagIds: ObjectId[] = [];
    const tagDocs: ITagQuestion[] = [];

    for (const newTag of tagResults) {
      if (!newTag) throw new Error(`Failed to create tag`);
      tagIds.push(newTag._id);
      tagDocs.push({
        tag: newTag._id,
        question: question._id,
      });
    }

    await Promise.all([
      TagQuestion.insertMany(tagDocs, { session }),
      questionModel.findByIdAndUpdate(
        question._id,
        { $push: { tags: { $each: tagIds } } },
        { session }
      ),
    ]);

    await session.commitTransaction();

    revalidatePath("/", "layout");

    after(async () => {
      await createInteraction({
        performerId: userId,
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
  const validated = await actionHandler({
    params,
    schema: editQuestionSchema,
    authorizetionProccess: true,
  });

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  const { title, content, tags, questionId } = validated.params!;
  const userId = validated.session?.user?.id;

  try {
    if (!userId) throw new UnauthorizedError();

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

    const tagResults = await Promise.all(
      tagsToAdd.map((tag) =>
        Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        )
      )
    );

    const tagIds: ObjectId[] = [];
    const tagDocs: ITagQuestion[] = [];

    for (const newTag of tagResults) {
      if (!newTag) throw new Error(`Failed to create tag: ${newTag}`);
      tagIds.push(newTag._id);
      tagDocs.push({
        tag: newTag._id,
        question: question._id,
      });
    }

    const finalOperations = [];

    if (tagsToRemove.length > 0) {
      const tagsToRemoveIds = tagsToRemove.map((tag) => tag._id);
      finalOperations.push(
        Tag.updateMany(
          { _id: { $in: tagsToRemoveIds } },
          { $inc: { questions: -1 } },
          { session }
        ),
        TagQuestion.deleteMany(
          { tag: { $in: tagsToRemoveIds }, question: question._id },
          { session }
        ),
        questionModel.findByIdAndUpdate(
          question._id,
          { $pull: { tags: { $in: tagsToRemoveIds } } },
          { session }
        )
      );
    }
    if (tagIds.length)
      finalOperations.push(
        questionModel.findByIdAndUpdate(
          question._id,
          { $push: { tags: { $each: tagIds } } },
          { session }
        )
      );

    if (tagDocs.length)
      finalOperations.push(TagQuestion.insertMany(tagDocs, { session }));

    if (finalOperations.length) await Promise.all(finalOperations);
    await Tag.deleteMany({ questions: { $lte: 0 } }, { session });
    await session.commitTransaction();

    revalidatePath("/", "layout");

    after(async () => {
      await createInteraction({
        performerId: userId,
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

export const getQuestion = cache(async function getQuestion(
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

    if (!question) throw new NotFoundError("Question");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    } as ActionResponse<Question>;
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});

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
  const skip = (page - 1) * pageSize;

  try {
    if (filter === "recommended") {
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        return { success: true, data: { questions: [], isNext: false } };
      }
      return await getRecommendedQuestions({
        skip,
        query,
        userId,
        limit: pageSize,
      });
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

    const [questionCount, questions] = await Promise.all([
      questionModel.countDocuments(filterQuery),
      questionModel
        .find(filterQuery)
        .sort(sortCriteria)
        .limit(pageSize)
        .skip(skip)
        .populate("tags", "name")
        .populate("author", "name image"),
    ]);

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

    return { success: true, data: JSON.parse(JSON.stringify(questions)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteQuestion(
  params: deleteQuestionParams
): Promise<ActionResponse> {
  const validated = await actionHandler({
    params,
    schema: deleteQuestionSchema,
    authorizetionProccess: true,
  });

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const { questionId } = validated.params!;
  const userId = validated.session?.user?.id;

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

    const deleteOperations = [];
    deleteOperations.push(
      Collection.deleteMany({ question: questionId }).session(session),
      TagQuestion.deleteMany({ question: questionId }).session(session),
      Vote.deleteMany({
        targetType: "question",
        targetId: questionId,
      }).session(session)
    );

    if (question.tags.length > 0) {
      deleteOperations.push(
        Tag.updateMany(
          { _id: { $in: question.tags } },
          { $inc: { questions: -1 } },
          { session }
        )
      );
    }

    const answers = (await Answer.find({ question: questionId }).session(
      session
    )) as IAnswerDoc[];

    if (answers.length) {
      deleteOperations.push(
        Answer.deleteMany({ question: questionId }).session(session)
      );
      const answersIds = answers.map((answer) => answer._id);
      deleteOperations.push(
        Vote.deleteMany({
          targetType: "answer",
          targetId: { $in: answersIds },
        }).session(session)
      );
    }

    deleteOperations.push(
      questionModel.findByIdAndDelete(questionId).session(session)
    );

    await Promise.all(deleteOperations);
    await Tag.deleteMany({ questions: { $lte: 0 } }, { session });
    await session.commitTransaction();

    revalidatePath("/", "layout");
    after(async () => {
      await createInteraction({
        performerId: userId,
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
  const { questionId, viewer } = params;

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

    revalidatePath(ROUTES.QUESTION(question._id.toString()));
    revalidatePath("/", "layout");

    after(async () => {
      await createInteraction({
        performerId: viewer,
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
// runs on try catch blocks
async function getRecommendedQuestions({
  userId,
  limit,
  skip,
  query,
}: RecommendationParams): Promise<
  ActionResponse<{
    questions: Question[];
    isNext: boolean;
  }>
> {
  const [excludedInteraction, includedInteraction, answeredQuestions] =
    await Promise.all([
      Interaction.find({
        authorId: userId,
        actionType: "question",
        action: { $in: ["bookmark", "post"] },
      }).distinct("actionId"),

      Interaction.find({
        authorId: userId,
        actionType: "question",
        action: { $in: ["view", "upvote"] },
      }).distinct("actionId"),

      Answer.find({ author: userId }).distinct("question"),
    ]);

  const excludedQuestionIds = [
    ...new Set([
      ...excludedInteraction.map((actionId) => actionId.toString()),
      ...answeredQuestions.map((question) => question.toString()),
    ]),
  ];
  const includedQuestionIds = [
    ...new Set(
      includedInteraction
        .map((actionId) => actionId.toString())
        .filter((id) => !excludedQuestionIds.includes(id))
    ),
  ];
  const interactedQuestionIds = [
    ...excludedQuestionIds,
    ...includedQuestionIds,
  ];

  const includedQuestionTags = await questionModel
    .find({
      _id: { $in: interactedQuestionIds },
    })
    .select("tags");

  const tagIds = [
    ...new Set(
      includedQuestionTags.flatMap((q) =>
        q.tags.map((tag: Types.ObjectId) => tag.toString())
      )
    ),
  ];

  const filterQuery: mongoose.QueryFilter<typeof questionModel> = {
    _id: { $nin: excludedQuestionIds },
    tags: { $in: tagIds },
  };
  if (query) {
    filterQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }

  const [recommendedQuestions, recommendedQuestionsCount] = await Promise.all([
    questionModel
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .populate("tags")
      .populate("author")
      .skip(skip)
      .limit(limit),

    questionModel.countDocuments({
      ...filterQuery,
      _id: { $nin: excludedQuestionIds },
      tags: { $in: tagIds },
    }),
  ]);

  const isNext = recommendedQuestionsCount > recommendedQuestions.length + skip;

  return {
    success: true,
    data: {
      questions: JSON.parse(JSON.stringify(recommendedQuestions)),
      isNext,
    },
  };
}
