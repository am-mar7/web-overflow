import { z } from "zod";

export const InteractionActionEnums = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
];


export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const createQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long." })
    .max(150, { message: "Title cannot exceed 150 characters." }),

  content: z.string().min(1, { message: "content is required" }),

  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag must have at least 1 character." })
        .max(15, { message: "Tag must not exceed 15 characters." })
    )
    .min(1, { message: "Please select at least one tag." })
    .max(5, { message: "You can select up to 5 tags." }),
});

export const editQuestionSchema = createQuestionSchema.extend({
  questionId: z.string().min(1, "Question ID is required"),
});

export const getQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().default(1),
  pageSize: z.number().int().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const answerSchema = z.object({
  content: z.string().min(1, "content is required"),
});

export const createAnswerSchema = answerSchema.extend({
  questionId: z.string().min(1, "question id is required"),
});

export const getAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().min(1, "question id is required"),
});

export const getTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string().min(1, "tag id is required"),
});

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  image: z.string().url("Invalid image URL").optional(),
  portfolio: z.string().url("Invalid portfolio URL").optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Invalid image URL").optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
  user: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    image: z.string().url("Invalid image URL").optional(),
  }),
});

export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(5, "question has to be at least 5 characters")
    .max(200, "question can't exceed 200 characters"),

  content: z.string().min(5, "question has to be at least 5 characters"),

  baseAnswer: z.string().min(50, "answer has to be at least 50 characters"),
});

export const createVoteSchema = z.object({
  targetId: z.string().min(1, "Target ID is required"),
  targetType: z.enum(["question", "answer"], {
    message: "Invalid target type. Must be 'question' or 'answer'.",
  }),
  voteType: z.enum(["upvote", "downvote"], {
    message: "Invalid vote type. Must be 'upvote' or 'downvote'.",
  }),
});

export const updateVoteSchema = createVoteSchema.extend({
  change: z
    .number()
    .int()
    .min(-1, "Change must be -1 (decrement) or 1 (increment)")
    .max(1, "Change must be -1 (decrement) or 1 (increment)"),
});

export const hasVotedSchema = createVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export const CollectionSchema = getQuestionSchema.extend({});

export const getUserSchema = z.object({
  userId: z.string().min(1, "use Id is required"),
});

export const getUserQuestionsSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().min(1, "use Id is required"),
});

export const getUserAnswersSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().min(1, "use Id is required"),
});

export const getUserTagsSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().min(1, "use Id is required"),
});
export const deleteQuestionSchema = z.object({
  questionId: z.string().min(1, "question Id is required"),
});

export const deleteAnswerSchema = z.object({
  answerId: z.string().min(1, "answer Id is required"),
});

export const createInteractionSchema = z.object({
  actionId: z.string().min(1, "action Id is required"),
  authorId: z.string().min(1, "author Id is required"),
  actionType: z.enum(["question", "answer"]),
  action: z.enum(InteractionActionEnums),
});

export const incrementViewsSchema = z.object({
  questionId: z.string().min(1, "question Id is required"),
  viewer: z.string().min(1, "viewer Id is required"),
});