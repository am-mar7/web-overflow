"use client";
/* eslint-disable react-hooks/refs */
import { answerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/server actions/answer.action";
import { toast } from "sonner";
import api from "@/lib/api";

const Editor = dynamic(() => import("../editor/index"), {
  ssr: false,
});
export default function AnswerForm({
  questionId,
  questionTitle,
  questionContent,
}: {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiSubmitting, setIsAiSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: "",
    },
  });

  const editorRef = useRef<MDXEditorMethods | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { success, error } = await createAnswer({
      questionId,
      content: form.getValues().content,
    });

    if (success) {
      editorRef.current?.setMarkdown("");
      toast.success("answer posted successfully", { duration: 3000 });
    } else {
      console.log(error);

      toast.error(error?.message || "some thing went wrong please try again", {
        duration: 3000,
      });
    }

    setIsSubmitting(false);
  };

  const generateAnswer = async () => {
    setIsAiSubmitting(true);
    const baseAnswer = editorRef.current?.getMarkdown() || ""
    if(baseAnswer.length < 50){
      toast.error("your answer must exceed 50 chars before you ask ai for help !");
      return;
    }
    const { success, data, error } = await api.ai.getOPtimizedAnswer(
      questionTitle,
      questionContent,
      baseAnswer 
    );
    setIsAiSubmitting(false);
    if (!success) {
      toast.error(error?.message || "something went wrong please try again");
      return;
    }
    if (!data) {
      toast.error("something went wrong please try again");
      return;
    }
    editorRef.current?.setMarkdown(data);
  };

  return (
    <div>
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center my-5 gap-3">
        <h4 className="h3-semibold text-dark200_light800">
          write down an answer
        </h4>

        <Button
          onClick={generateAnswer}
          disabled={form.formState.isSubmitting}
          className="bg-light800_dark200 w-full sm:w-fit shadow-sm text-primary-500 delay-75 transition-colors"
        >
          {isAiSubmitting ? (
            "Generating..."
          ) : (
            <>
              <Image
                width={20}
                height={20}
                src="/icons/stars.svg"
                alt="generate with ai"
              />
              Generate answer using AI
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="text-dark200_light800 min-h-96 ">
                    <Editor
                      markdown={field.value}
                      onChange={field.onChange}
                      editorRef={editorRef}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <div className="mt-10 sm:mt-16 flex justify-end">
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="bg-primary-500 hover:bg-primary-gradient text-light-700 delay-75 transition-colors"
            >
              {isSubmitting ? "posting" : "post answer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
