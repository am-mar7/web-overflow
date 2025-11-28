"use client";
import { createQuestionSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useRef, useTransition } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import TagCard from "../cards/TagCard";
import { createQuestion } from "@/lib/server actions/question.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

const Editor = dynamic(() => import("../editor/index"), {
  ssr: false,
});

export default function QuestionForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [] as string[],
    },
  });
  const editorRef = useRef<MDXEditorMethods | null>(null);
  async function handleCreateQuestion() {
    startTransition(async () => {
      const { success, error, data } = await createQuestion(form.getValues());
      if (success) {
        toast.success("Question created successfully", { duration: 3000 });
        if (data) router.push(ROUTES.QUESTION(data._id.toString()));
        else
          toast.error("some thing went wrong please try again", {
            duration: 3000,
          });
      } else {
        toast.error(
          error?.message || "some thing went wrong please try again",
          {
            duration: 3000,
          }
        );
      }
    });
  }
  function handleKeyDown(e: React.KeyboardEvent, field: { value: string[] }) {
    if (e.key === "Enter") {
      handleaddTag(e, field);
    }
  }
  function handleaddTag(
    e: React.KeyboardEvent | React.MouseEvent,
    field: { value: string[] }
  ) {
    e.preventDefault();
    let newTag = null;

    if (e.type === "keydown")
      newTag = (e.target as HTMLInputElement).value.trim();
    else {
      const input = (e.target as HTMLElement).parentElement?.querySelector(
        "input"
      );
      newTag = input?.value.trim() || "";
    }
    if (
      newTag &&
      !field.value.includes(newTag) &&
      newTag.length > 1 &&
      newTag.length <= 15 &&
      field.value.length < 3
    ) {
      form.clearErrors("tags");
      const newTags = [...field.value, newTag];
      form.setValue("tags", newTags);
      (e.target as HTMLInputElement).value = "";
    } else if (field.value.includes(newTag)) {
      form.setError("tags", {
        message: "Tag already added",
        type: "duplicate",
      });
    } else if (newTag.length > 15) {
      form.setError("tags", {
        message: "Maximum of 15 chars allowed per Tag",
        type: "maxLength",
      });
    } else if (newTag.length < 2) {
      form.setError("tags", {
        message: "Tag must be at least 2 chars long",
        type: "minLength",
      });
    } else if (field.value.length >= 3) {
      form.setError("tags", {
        message: "Maximum of 3 tags allowed",
        type: "maxTags",
      });
    }
  }
  function handleDeleteTage(tag: string, field: { value: string[] }) {
    const newTags = field.value.filter((t) => t !== tag);

    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateQuestion)}
        className="space-y-8 sm:space-y-12"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="h3-semibold">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="min-h-[42px]! border-light-300  my-1"
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="h3-semibold">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="text-dark200_light800 min-h-96 ">
                  <Editor
                    markdown={field.value}
                    onChange={field.onChange}
                    editorRef={editorRef}
                  />
                </div>
              </FormControl>
              <FormDescription className="body-regular text-light-500">
                Introduce the problem and expand on what you&apos;ve put in the
                title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="h3-semibold">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <div className="flex-center gap-1.5">
                    <Input
                      className="min-h-[42px]! border-light-300  my-1"
                      onKeyDown={(e) => {
                        handleKeyDown(e, field);
                      }}
                    />
                    <Button
                      type="button"
                      onClick={(e) => handleaddTag(e, field)}
                      className="bg-light700_dark400 dark:text-light-500 text-dark-500 border-light-300 dark-border-none"
                    >
                      add
                    </Button>
                  </div>

                  {field?.value?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {field?.value?.map((tag, idx) => (
                        <TagCard
                          key={idx}
                          id={tag}
                          name={tag}
                          removable={true}
                          deleteTag={() => handleDeleteTage(tag, field)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="body-regular text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-10 sm:mt-16 flex justify-end">
          <Button
            disabled={isPending}
            type="submit"
            className="bg-primary-gradient text-light-900"
          >
            {isPending
              ? "Publishing"
              : "Publish your Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
