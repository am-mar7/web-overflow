import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validation";
import { APIErrorResponse, APIResponse } from "@/Types/global";
import { NextResponse } from "next/server";
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(request: Request) {
  const { question, baseAnswer, content } = await request.json();

  const validatedParams = AIAnswerSchema.safeParse({
    question,
    content,
    baseAnswer,
  });
  if (!validatedParams.success)
    return handleError(
      new ValidationError(validatedParams.error.flatten().fieldErrors)
    ) as APIErrorResponse;
  try {
    // throw new Error("Not implemented but will come soon");
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `Generate a markdown-formatted response to the following question: "${question}".  
      
      Consider the provided context:  
      **Context:** ${content}  
      
      Also, prioritize and incorporate the user's answer when formulating your response:  
      **User's Answer:** ${baseAnswer}  
      
      Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point. 
      Provide the final answer in markdown format.`,
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 }) as APIResponse<string>;
  } catch (error) {
    return handleError(error) as APIErrorResponse;
  }
}

