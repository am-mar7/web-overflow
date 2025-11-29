import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import HomeFilters from "@/components/filters/HomeFilters";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { getQuestions } from "@/lib/server actions/question.action";
import { RouteParams } from "@/Types/global";
import Link from "next/link";

export default async function Home({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { questions } = data || {};
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="flex gap-5 flex-col-reverse sm:flex-row justify-between">
        <h1 className="h1-bold text-dark200_light800"> All Questions</h1>
        <Button
          asChild
          className="bg-primary-gradient text-light-900 min-h-[42px]"
        >
          <Link href={ROUTES.ASK_QUESTION} className="base-medium!">
            Ask a Questions
          </Link>
        </Button>
      </section>

      <section className="mt-6">
        <LocalSearch route={ROUTES.HOME} placeholder="search for a Question" />
      </section>

      <HomeFilters />

      <DataRenderer
        success={success}
        error={error}
        empty={{
          title: "No questions found",
          message: "The question board is empty. Maybe it’s waiting for your brilliant question to get things rolling",
          button: {
            text: "ask question",
            href: ROUTES.ASK_QUESTION,
          },
        }}
        data={questions}
        render={(questions) => (
          <section className="mt-5 w-full flex flex-col gap-6">
            {questions?.map((question) => {
              return <QuestionCard key={question._id} question={question} />;
            })}
          </section>
        )}
      />
    </div>
  );
}
