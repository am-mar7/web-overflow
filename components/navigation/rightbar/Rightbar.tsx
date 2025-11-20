import Image from "next/image";
import TagCard from "../../cards/TagCard";
import Link from "next/link";
import ROUTES from "@/constants/routes";

const hotQuestions = [
  { _id: "1", title: "how to create custom hook in react" },
  { _id: "2", title: "how to create context in react" },
  { _id: "3", title: "how to create use react Query" },
  { _id: "4", title: "how to use redux in react" },
  { _id: "5", title: "why use Next instead of react" },
];
const popularTags = [
  { id: "1", name: "React", questions: 100 },
  { id: "2", name: "Javascript", questions: 99 },
  { id: "3", name: "Typescript", questions: 204 },
  { id: "4", name: "Next.Js", questions: 265 },
  { id: "5", name: "Mongo DB", questions: 65 },
];
export default function Rightbar() {
  return (
    <section className="hidden fixed right-0 top-0 pt-26 h-screen lg:flex flex-col bg-light900_dark200 shadow-light-400 shadow-sm dark:shadow-none custom-scrollbar overflow-y-auto light-border border-r lg:w-[260px] xl:w-[340px]">
      <div className="px-8 py-4">
        <h3 className="h3-semibold text-dark200_light800">Top questions</h3>
        <div className="space-y-3 mt-7">
          {hotQuestions.map(({ _id, title }) => {
            return (
              <div key={_id}>
                <Link href={ROUTES.QUESTION(_id)} className="flex-between">
                  <p className="text-dark500_light700 paragraph-medium">{title}</p>
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
          {popularTags.map(({ id, name, questions }) => (
            <div key={id}>
              <TagCard id={id} name={name} questions={questions} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
