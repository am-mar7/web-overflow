import AllAnswers from "@/components/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import { Preview } from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/server actions/answer.action";
import { getQuestion } from "@/lib/server actions/question.action";
import { getTimeStamp } from "@/lib/utils";
import { RouteParams } from "@/Types/global";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function QuestionDetails({ params }: RouteParams) {
  const { id } = await params;

  const { success, data: question } = await getQuestion(id);
  if (!success || !question) return notFound();

  const {
    data,
    success: answerSuccess,
    error,
  } = await getAnswers({ questionId: question._id, pageSize: 3 });

  const { upvotes, views, answers, createdAt, title, author, content, tags } =
    question;

  const metricships = [
    { iconUrl: "/icons/eye.svg", value: views, alt: "views" },
    { iconUrl: "/icons/message.svg", value: answers, alt: "answers" },
  ];

  const timeMertic = (
    <div className="flex-center gap-2">
      <Image src="/icons/clock.svg" width={20} height={20} alt="clock" />
      <div>
        Asked{" "}
        {getTimeStamp(createdAt)
          .split(" ")
          .map((s, idx) => (
            <span className="mx-0.5" key={idx}>
              {s}
            </span>
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="flex-between">
        <Link className="flex-center gap-2" href={ROUTES.PROFILE(author._id)}>
          <UserAvatar
            user={{ id: author?._id, ...author }}
            width={6}
            height={6}
          />
          <p className="body-bold">{author?.name}</p>
        </Link>

        <div className="flex-center gap-3">
          <div className="flex-center gap-1.5">
            <Image
              src="/icons/upvote.svg"
              width={20}
              height={20}
              alt="upvote"
            />
            <span>{upvotes}</span>
          </div>

          <div className="flex-center gap-1.5">
            <Image
              src="/icons/downvote.svg"
              width={20}
              height={20}
              alt="upvote"
            />
            <span>{upvotes}</span>
          </div>

          <Image src="/icons/star.svg" width={20} height={20} alt="upvote" />
        </div>
      </section>

      <section className="py-5 text-dark200_light800 h1-semibold">
        <p>{title}</p>

        <div className="flex gap-3 small-medium text-dark400_light800 mt-3">
          {timeMertic}
          {metricships.map((ship) => {
            return (
              <div className="flex-center gap-1" key={ship.alt}>
                <Metric
                  key={ship.value}
                  value={ship.value}
                  iconUrl={ship.iconUrl}
                  alt={ship.alt}
                />

                <span>{ship.alt}</span>
              </div>
            );
          })}
        </div>
      </section>

      <Preview content={content} />

      <section className="flex gap-2 mb-5">
        {tags.map((t) => (
          <TagCard key={t._id} id={t._id} name={t.name} />
        ))}
      </section>

      <section className="mb-5">
        <AllAnswers
          data={data?.answers}
          isNext={data?.isNext}
          error={error}
          success={answerSuccess}
          totalAnswers={data?.totalAnswers}
        />
      </section>

      <section>
        <AnswerForm
          questionId={question._id}
          questionTitle={title}
          questionContent={content}
        />
      </section>
    </div>
  );
}
