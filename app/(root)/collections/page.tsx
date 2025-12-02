import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/searchbars/LocalSearch";
import ROUTES from "@/constants/routes";
import { getCollections } from "@/lib/server actions/collection.action";
import { RouteParams } from "@/Types/global";

export default async function Collection({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getCollections({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { questions  } = data || {};
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="flex gap-5 flex-col-reverse sm:flex-row justify-between">
        <h1 className="h1-bold text-dark200_light800"> Saved Questions</h1>
      </section>

      <section className="mt-6">
        <LocalSearch route={ROUTES.COLLECTIONS} placeholder="search for a saved Question..." />
      </section>


      <DataRenderer
        success={success}
        error={error}
        empty={{
          title: "Collections Are Empty",
          message:
            "Looks like you haven’t created any collections yet. Start curating something extraordinary today",
          button: {
            text: "go explore questions",
            href: ROUTES.HOME,
          },
        }}
        data={questions}
        render={(questions) => (
          <section className="mt-5 w-full flex flex-col gap-6">
            {questions?.map((item) => {
              return <QuestionCard key={item._id} question={item.question} />;
            })}
          </section>
        )}
      />
    </div>
  );
}

