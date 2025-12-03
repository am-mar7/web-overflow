import Image from "next/image";
import TagCard from "../../cards/TagCard";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { getTags } from "@/lib/server actions/tag.action";
import { getHotQuestions } from "@/lib/server actions/question.action";

export default async function Rightbar() {
  const [{ data }, { data: hotQuestions }] = await Promise.all([
    getTags({}),
    getHotQuestions(),
  ]);

  const { data: popularTags } = data || {};

  return (
    <section className="hidden fixed right-0 top-0 pt-26 h-screen lg:flex flex-col bg-light900_dark200 shadow-light-400 shadow-sm dark:shadow-none custom-scrollbar overflow-y-auto light-border border-r lg:w-[260px] xl:w-[340px]">
      <div className="px-8 py-4">
        <h3 className="h3-semibold text-dark200_light800">Top questions</h3>
        <div className="space-y-3 mt-7">
          {hotQuestions &&
            hotQuestions.map(({ _id, title }) => {
              return (
                <div key={_id}>
                  <Link href={ROUTES.QUESTION(_id)} className="flex-between">
                    <p className="text-dark500_light700 paragraph-medium">
                      {title}
                    </p>
                    <Image
                      src="/icons/chevron-right.svg"
                      alt="shevron"
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
              );
            })}
        </div>
      </div>

      <div className="mt-10 px-8">
        <h3 className="h3-semibold text-dark200_light800">Popular Tags</h3>
        <div className="space-y-3 py-4">
          {popularTags &&
            popularTags?.map(({ _id, name, questions }) => (
              <div key={_id}>
                <TagCard id={_id} name={name} questions={questions} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
