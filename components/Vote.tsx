"use client";
import ROUTES from "@/constants/routes";
import { createVote } from "@/lib/server actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { ActionResponse, HasVotedResponse } from "@/Types/global";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { use, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  upvotes: number;
  downvotes: number;
  targetId: string;
  targetType: "question" | "answer";
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}

export default function Vote({
  upvotes,
  downvotes,
  targetId,
  targetType,
  hasVotedPromise,
}: Props) {
  const { success, data } = use(hasVotedPromise);
  const { hasUpvoted, hasDownvoted } = data || {};
  const session = useSession();
  const [isPending, startTransition] = useTransition();

  const handlevote = async (voteType: "upvote" | "downvote") => {
    if (!session.data?.user?.id)
      return toast.error(
        <div>
          <p>You must be logged in to vote</p>
          <Link href={ROUTES.SIGN_IN} className="underline font-semibold">
            Sign in now
          </Link>
        </div>
      );
    startTransition(async () => {
      const { success, error } = await createVote({
        targetId,
        targetType,
        voteType,
      });
      console.log(success);
      if (!success)
        toast.error(error?.message || "something went wrong please try again");
    });
  };

  return (
    <div className="flex-center gap-3">
      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          width={16}
          height={16}
          alt="upvote"
          className={`cursor-pointer ${isPending && "opacity-25"}`}
          onClick={() => !isPending && handlevote("upvote")}
        />
        <span className="small-regular bg-light700_dark400 py-1 px-1.5">
          {formatNumber(upvotes)}
        </span>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          width={16}
          height={16}
          alt="downvotes"
          className={`cursor-pointer ${isPending && "opacity-40"}`}
          onClick={() => !isPending && handlevote("downvote")}
        />
        <span className="small-regular bg-light700_dark400 px-1.5 py-1">
          {formatNumber(downvotes)}
        </span>
      </div>
    </div>
  );
}
