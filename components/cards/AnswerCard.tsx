import { Answer } from "@/Types/global";
import UserAvatar from "../UserAvatar";
import { getTimeStamp } from "@/lib/utils";
import { Preview } from "../editor/Preview";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import Vote from "../Vote";
import { hasVoted } from "@/lib/server actions/vote.action";
import ActionsButton from "../user/ActionsButton";

interface Props extends Answer {
  readMore?: boolean;
}

export default function AnswerCard({
  _id,
  readMore = false,
  author,
  content,
  createdAt,
  upvotes,
  question,
  downvotes,
}: Props) {
  const date = getTimeStamp(createdAt);

  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "answer",
  });

  return (
    <article className="bg-light700_dark300 shadow-md dark:shadow-none px-5 py-2.5 rounded-lg">
      <span id={`answer-${_id}`}></span>
      <div className="flex-between">
        <div className="flex item-center gap-2 mb-5">
          <Link href={ROUTES.PROFILE(author._id)} className="mt-2.5">
            <UserAvatar
              user={{ id: author._id, ...author }}
              width={6}
              height={6}
            />
          </Link>
          <div>
            <Link href={ROUTES.PROFILE(author._id)} className="body-regular">
              {author.name}
            </Link>
            <p className="small-regular">Answerd {date}</p>
          </div>
        </div>
        <div>
          <div className="w-full flex justify-end py-3">
            <ActionsButton type="answer" id={_id} authorId={author._id} />
          </div>
          <Vote
            upvotes={upvotes}
            downvotes={downvotes}
            targetId={_id}
            targetType="answer"
            hasVotedPromise={hasVotedPromise}
          />
        </div>
      </div>

      <Preview content={content} />

      {readMore && (
        <Link
          className="text-sky-600"
          href={`/questions/${question}#answer-${_id}`}
        >
          read more...
        </Link>
      )}
    </article>
  );
}
