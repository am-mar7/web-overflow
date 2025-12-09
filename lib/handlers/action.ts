"use server";
import { ZodError, ZodSchema } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import { dbConnect } from "../mongoose";
import mongoose from "mongoose";
export interface ActionOptions<T> {
  params?: T;
  schema?: ZodSchema<T>;
  authorizetionProccess?: boolean;
}

export default async function actionHandler<T>({
  params,
  schema,
  authorizetionProccess = false,
}: ActionOptions<T>) {
  if (params && schema) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError)
        return new ValidationError(error.flatten().fieldErrors);
      else return new Error("schema validation failed");
    }
  }

  let session: Session | null = null;
  if (authorizetionProccess) {
    session = await auth();
    if (!session) return new UnauthorizedError();
  }
  try {
    await dbConnect();
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not ready");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Database connection error:", error);

    // Return user-friendly error
    if (
      error.message?.includes("timeout") ||
      error.message?.includes("buffering")
    ) {
      return new Error("network connection timeout. Please try again ");
    }

    return new Error(
      "Connection Faild. Please check your network and try again."
    );
  }

  return { session, params };
}
