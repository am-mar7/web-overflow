import { Answer } from "@/Types/global";
import UserAvatar from "../UserAvatar";
import { getTimeStamp } from "@/lib/utils";
import { Preview } from "../editor/Preview";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import Vote from "../Vote";
import { hasVoted } from "@/lib/server actions/vote.action";

export default function AnswerCard({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
}: Answer) {
  const date = getTimeStamp(createdAt);

  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "answer",
  });

  return (
    <article>
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
        <Vote
          upvotes={upvotes}
          downvotes={downvotes}
          targetId={_id}
          targetType="answer"
          hasVotedPromise={hasVotedPromise}
        />
      </div>

      <Preview content={content} />
    </article>
  );
}
