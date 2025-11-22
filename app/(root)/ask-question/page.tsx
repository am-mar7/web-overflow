import QuestionForm from "@/components/forms/QuestionForm";
import React from "react";

export default function AskQuestion() {
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="text-dark200_light800 h1-bold">
        Ask a Question
      </section>

      <section className="mt-6 sm:mt-10">
        <QuestionForm/>
      </section>
    </div>
  );
}
