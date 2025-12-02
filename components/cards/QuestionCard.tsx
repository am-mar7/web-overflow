import { getTimeStamp } from "@/lib/utils";
import TagCard from "./TagCard";
import Metric from "../Metric";
import ROUTES from "@/constants/routes";
import { Question } from "@/Types/global";
import Link from "next/link";
import CollectionBtn from "../CollectionBtn";
import { hasSavedQuestion } from "@/lib/server actions/collection.action";

export default function QuestionCard({
  question,
}: {
  question: Omit<Question, "content">;
}) {
  const { _id, upvotes, views, answers, createdAt, title, author, tags } =
    question;
  console.log(author);

  const metricships = [
    { iconUrl: "icons/like.svg", value: upvotes, alt: "votes" },
    { iconUrl: "icons/eye.svg", value: views, alt: "views" },
    { iconUrl: "icons/message.svg", value: answers, alt: "answers" },
  ];

  const hasSavedPromise = hasSavedQuestion(question._id);
  return (
    <div className="bg-light800_dark200 space-y-3 px-8 py-5 w-full rounded-lg">
      <span className="subtle-regular text-light-500">
        {getTimeStamp(createdAt)}
      </span>
      <div className="h3-semibold text-dark200_light800 mt-2 flex-between">
        <Link href={ROUTES.QUESTION(_id)}>{title}</Link>
        <CollectionBtn
          questionId={question._id}
          hasSavedPromise={hasSavedPromise}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => {
          return <TagCard key={tag._id} id={_id} name={tag.name} />;
        })}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Metric
          iconUrl={author.image!}
          href={ROUTES.PROFILE(author._id)}
          value={author.name}
          alt={author.name}
        />
        <div className="flex gap-3 small-medium text-dark400_light800">
          {metricships.map((ship) => {
            return (
              <Metric
                key={ship.value}
                value={ship.value}
                iconUrl={ship.iconUrl}
                alt={ship.alt}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
