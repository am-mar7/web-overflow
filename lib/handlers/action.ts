"use server";
import { ZodError, ZodSchema } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import handleError from "./error";
import { dbConnect } from "../mongoose";

interface paramsType<T> {
  params?: T;
  schema?: ZodSchema<T>;
  authorizetionProccess?: boolean;
}

export default async function actionHandler<T>({
  params,
  schema,
  authorizetionProccess = false,
}: paramsType<T>) {
  if (params && schema) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError)
        throw new ValidationError(error.flatten().fieldErrors);
      else throw new Error("schema validation failed");
    }
  }

  let session: Session | null = null;
  if (authorizetionProccess) {
    session = await auth();
    if (!session) return handleError(new UnauthorizedError());
  }
  await dbConnect();

  return { session, params };
}
