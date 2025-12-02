import { NextResponse } from "next/server";

interface ActionResponse<T = null> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
}

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;
type APIErrorResponse = NextResponse<ErrorResponse>;

// data types
interface Tag {
  _id: string;
  name: string;
  questions: number;
}

interface Author {
  _id: string;
  name: string;
  image?: string;
}

interface Question {
  title: string;
  _id: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
  author: Author;
  tags: Tag[];
}

interface Answer {
  _id: string;
  author: Author;
  content: string;
  upvotes: number;
  question: string;
  downvotes: number;
  createdAt: Date;
}

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  image?: string;
  portfolio?: string;
  reputation?: number;
  createdAt: Date;
}

interface Collection {
  _id: string;
  author: string | Author;
  question: Question;
}

// params 

interface SignInWithOauthParams {
  provider: "google" | "github";
  providerAccountId: string;
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
}

interface QuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface getTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

interface updateQuestionParams extends QuestionParams {
  questionId: string;
}

interface createAnswerParams {
  questionId: string;
  content: string;
}

interface getAnswersParams extends PaginatedSearchParams {
  questionId: string;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface createVoteParams {
  targetId: string;
  targetType: "question"|"answer";
  voteType: "upvote"|"downvote";
}

interface updateVoteParams extends createVoteParams{
  change: number;
}

type hasVotedParams = Pick<createVoteParams , "targetId"|"targetType">;

interface HasVotedResponse{
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}
