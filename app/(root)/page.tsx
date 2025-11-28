import QuestionCard from "@/components/cards/QuestionCard";
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

      {success ? (
        <section className="mt-5 space-y-2.5">
          {questions && questions.length > 0 ? (
            questions.map(
              ({
                _id,
                answers,
                views,
                author,
                upvotes,
                title,
                createdAt,
                tags,
              }) => {
                return (
                  <QuestionCard
                    key={_id}
                    _id={_id}
                    author={author}
                    title={title}
                    tags={tags}
                    createdAt={createdAt}
                    upvotes={upvotes}
                    views={views}
                    answers={answers}
                  />
                );
              }
            )
          ) : (
            <div className="mt-5 space-y-2.5">
              <p className="text-dark500_light700">No questions found</p>
            </div>
          )}
        </section>
      ) : (
        <div className="mt-10 text-red-500 text-center">
          <p>{error?.message || "some thing went wrong"}</p>
          <p>please try again</p>
        </div>
      )}
    </div>
  );
}
