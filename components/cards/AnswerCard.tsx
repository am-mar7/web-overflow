import { Answer } from "@/Types/global";
import UserAvatar from "../UserAvatar";
import { getTimeStamp } from "@/lib/utils";
import { Preview } from "../editor/Preview";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/routes";

export default function AnswerCard({
  author,
  content,
  createdAt,
  upvotes,
}: Answer) {
  const date = getTimeStamp(createdAt);
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

        <div className="flex-center gap-3">
          <div className="flex-center gap-1.5">
            <Image
              src="/icons/upvote.svg"
              width={16}
              height={16}
              alt="upvote"
            />
            <span className="small-regular">{upvotes}</span>
          </div>

          <div className="flex-center gap-1.5">
            <Image
              src="/icons/downvote.svg"
              width={16}
              height={16}
              alt="upvote"
            />
            <span className="small-regular">{upvotes}</span>
          </div>
        </div>
      </div>

      <Preview content={content} />
    </article>
  );
}
