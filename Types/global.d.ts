import { NextResponse } from "next/server";

interface ActionResponse<T = null> {
  [x: string]: string;
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

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  avatarUrl?: string;
}

interface Question {
  title: string;
  _id: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  upvotes: number;
  answers: number;
  views: number;
  author: Author;
  tags: Tag[];
}

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

interface updateQuestionParams extends QuestionParams{
  questionId : string;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}
