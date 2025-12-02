"use client";

import { toggleSaveQuestion } from "@/lib/server actions/collection.action";
import { ActionResponse } from "@/Types/global";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use , useTransition } from "react";
import { toast } from "sonner";

type Props = {
  hasSavedPromise: Promise<ActionResponse<{ hasSaved: boolean }>>;
  questionId: string;
};

export default function CollectionBtn({ hasSavedPromise, questionId }: Props) {
  const { data } = use(hasSavedPromise);
  const { hasSaved } = data || {};

  const [isPending, startTransition] = useTransition();

  const session = useSession();
  const userId = session.data?.user?.id;

  const handleToggle = async () => {
    if (isPending) return;
    if (!userId) return toast.error("You must be loggend go login first");

    startTransition(async () => {
      const { success, error } = await toggleSaveQuestion(questionId);
      if (!success)
        toast.error(error?.message || "something went wrong please try again");
    });
  };

  return (
    <div>
      <Image
        src={hasSaved ? "/icons/star-filled.svg" : "/icons/star.svg"}
        width={20}
        height={20}
        alt="collections"
        onClick={handleToggle}
        aria-disabled={isPending}
        aria-label="Save question"
        className={isPending ? "opacity-40" : "cursor-pointer"}
      />
    </div>
  );
}
