import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import CommentFilters from "@/components/filters/CommentFilters";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { TagFilters } from "@/constants";
import ROUTES from "@/constants/routes";
import { getTags } from "@/lib/server actions/tag.action";
import { RouteParams } from "@/Types/global";

export default async function Tags({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;
  const { data, success, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });
  const { data: popularTags, isNext } = data || {};

  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <h1 className="h1-bold text-dark200_light800"> All Tags</h1>

      <section className="mt-6 flex-center flex-col sm:flex-row gap-2.5">
        <div className="w-full">
          <LocalSearch route={ROUTES.TAGS} placeholder="search for a tags" />
        </div>
        <CommentFilters
          filters={TagFilters}
          otherClasses="w-full sm:w-fit h-full"
        />
      </section>
      <div className="py-4 grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2">
        <DataRenderer
          success={success}
          data={popularTags}
          error={error}
          empty={{
            title: "No tags to show",
            message:
              "if you added a question with that you would be the first one to use the tag isn't that exiting!",
            button: {
              text: "ask question",
              href: ROUTES.ASK_QUESTION,
            },
          }}
          render={(popularTags) => (
            <>
              {popularTags?.map(({ _id, name, questions }) => (
                <div key={_id}>
                  <TagCard
                    compact={false}
                    id={_id}
                    name={name}
                    questions={questions}
                  />
                </div>
              ))}
            </>
          )}
        />
      </div>

      <Pagination isNext={isNext || false} page={page} />
    </div>
  );
}
