"use server";
import { ZodError, ZodSchema } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import { dbConnect } from "../mongoose";

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
      else 
        return new Error("schema validation failed");
    }
  }

  let session: Session | null = null;
  if (authorizetionProccess) {
    session = await auth();
    if (!session) return new UnauthorizedError();
  }
  await dbConnect();

  return { session, params };
}
