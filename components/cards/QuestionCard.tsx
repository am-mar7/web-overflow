import { getTimeStamp } from "@/lib/utils";
import TagCard from "./TagCard";
import Metric from "../Metric";
import ROUTES from "@/constants/routes";

export default function QuestionCard({
  id,
  answers,
  views,
  author,
  upvotes,
  title,
  createdAt,
  tags,
}: Question) {
  const metricships = [
    { iconUrl: "icons/like.svg", value: upvotes, alt: "votes" },
    { iconUrl: "icons/eye.svg", value: views, alt: "views" },
    { iconUrl: "icons/message.svg", value: answers, alt: "answers" },
  ];
  return (
    <div className="bg-light800_dark200 space-y-3 px-8 py-5 w-full rounded-lg">
      <span className="subtle-regular text-light-500">
        {getTimeStamp(createdAt)}
      </span>
      <p className="h3-semibold text-dark200_light800 mt-2">{title}</p>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => {
          return <TagCard key={tag.id} id={id} name={tag.name} />;
        })}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Metric
          iconUrl={author.avatarUrl}
          href={ROUTES.PROFILE(author.id)}
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
