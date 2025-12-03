import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommentFilters from "@/components/filters/CommentFilters";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { TagFilters } from "@/constants";
import ROUTES from "@/constants/routes";
import { getTagQuestions } from "@/lib/server actions/tag.action";
import { RouteParams } from "@/Types/global";

export default async function Tag({ params, searchParams }: RouteParams) {
  const { id } = await params;
  const { page, query } = await searchParams;
  const { data, success, error } = await getTagQuestions({
    page: Number(page) || 1,
    pageSize: 10,
    query,
    tagId: id,
  });
  const { isNext, data: questions } = data || {};
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <h1 className="h1-semibold text-dark200_light800">Tag name</h1>
      <section className="mt-6 flex-center flex-col sm:flex-row gap-2.5">
        <div className="w-full">
          <LocalSearch route={ROUTES.TAG(id)} placeholder="search for tag..." />
        </div>
        <CommentFilters
          filters={TagFilters}
          otherClasses="w-full sm:w-fit h-full"
        />
      </section>

      <section>
        <DataRenderer
          success={success}
          error={error}
          empty={{
            title: "No questions found",
            message:
              "The question board is empty. Maybe it’s waiting for your brilliant question to get things rolling",
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

        <Pagination isNext={isNext || false} page={page} />
      </section>
    </div>
  );
}
