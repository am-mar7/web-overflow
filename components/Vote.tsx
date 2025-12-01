"use client";
import { createVote } from "@/lib/server actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { ActionResponse, HasVotedResponse } from "@/Types/global";
import Image from "next/image";
import { use, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const { success, data } = use(hasVotedPromise);
  const { hasUpvoted, hasDownvoted } = data || {};
  const handlevote = async (voteType: "upvote" | "downvote") => {
    setLoading(true);
    const { success, error } = await createVote({
      targetId,
      targetType,
      voteType,
    });
    console.log(success);
    if (!success)
      toast.error(error?.message || "something went wrong please try again");
    setTimeout(() => setLoading(false), 1500);
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
          className={`cursor-pointer ${loading && "opacity-25"}`}
          onClick={() => !loading && handlevote("upvote")}
        />
        <span className="small-regular">{formatNumber(upvotes)}</span>
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
          className={`cursor-pointer ${loading && "opacity-40"}`}
          onClick={() => !loading && handlevote("downvote")}
        />
        <span className="small-regular">{formatNumber(downvotes)}</span>
      </div>
    </div>
  );
}
