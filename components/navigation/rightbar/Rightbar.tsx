import Image from "next/image";
import TagCard from "../../cards/TagCard";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { getTags } from "@/lib/server actions/tag.action";
import DataRenderer from "@/components/DataRenderer";

const hotQuestions = [
  { _id: "1", title: "how to create custom hook in react" },
  { _id: "2", title: "how to create context in react" },
  { _id: "3", title: "how to create use react Query" },
  { _id: "4", title: "how to use redux in react" },
  { _id: "5", title: "why use Next instead of react" },
];
export default async function Rightbar() {
  const { data, success , error} = await getTags({});
  const { data: popularTags } = data || {};
  return (
    <section className="hidden fixed right-0 top-0 pt-26 h-screen lg:flex flex-col bg-light900_dark200 shadow-light-400 shadow-sm dark:shadow-none custom-scrollbar overflow-y-auto light-border border-r lg:w-[260px] xl:w-[340px]">
      <div className="px-8 py-4">
        <h3 className="h3-semibold text-dark200_light800">Top questions</h3>
        <div className="space-y-3 mt-7">
          {hotQuestions.map(({ _id, title }) => {
            return (
              <div key={_id}>
                <Link href={ROUTES.QUESTION(_id)} className="flex-between">
                  <p className="text-dark500_light700 paragraph-medium">
                    {title}
                  </p>
                  <Image
                    src="icons/chevron-right.svg"
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

      <div className="mt-18 px-8">
        <h3 className="h3-semibold text-dark200_light800">Popular Tags</h3>
        <div className="space-y-3 py-4">
          <DataRenderer
            success={success}
            data={popularTags}
            error={error}
            empty={{
              title:"No tags to show",
              message:"if you added a question with that you would be the first one to use the tag isn't that exiting!",
              button:{
                text: "ask question",
                href:ROUTES.ASK_QUESTION,
              }
            }
              
            }
            render={(popularTags) => (
              <>
                {popularTags?.map(({ _id, name, questions }) => (
                  <div key={_id}>
                    <TagCard id={_id} name={name} questions={questions} />
                  </div>
                ))}
              </>
            )}
          />
        </div>
      </div>
    </section>
  );
}
