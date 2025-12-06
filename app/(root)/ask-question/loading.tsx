import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function AskQuestionloading() {
  return (
    <div className="px-3 py-5 sm:px-6 sm:py-10">
      <section className="text-dark200_light800 h1-bold">
        Ask a Question
      </section>

      <section className="mt-6 sm:mt-10">
        <p>
          Question Title <span className="text-primary-500">*</span>
        </p>

        <Skeleton className="w-full h-[50px] my-2" />

        <p className="text-light-500">
          Be specific and imagine you&apos;re asking a question to another
          person.
        </p>
      </section>

      <section className="mt-10">
        <p className="h3-semibold">
          Detailed explanation of your problem{" "}
          <span className="text-primary-500">*</span>
        </p>
        <Skeleton className="w-full h-[400px] my-2" />

        <p className="body-regular text-light-500">
          Introduce the problem and expand on what you&apos;ve put in the title.
        </p>
      </section>

      <section className="mt-10">
        <p className="h3-semibold">
          Tags <span className="text-primary-500">*</span>
        </p>
        <div className="flex my-2 gap-2">
          <Skeleton className="w-full h-[50px]" />
          <Skeleton className="bg-light700_dark400 w-[75px]  rounded-lg border-light-300 dark-border-none" />
        </div>
        <p className="body-regular text-light-500">
          Add up to 3 tags to describe what your question is about. You need to
          press enter to add a tag.
        </p>

        <div className="mt-10 sm:mt-16 flex justify-end">
            <Skeleton className="w-[150px] h-[50px]"/>
        </div>
      </section>
    </div>
  );
}
