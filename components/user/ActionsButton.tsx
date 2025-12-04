"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Link from "next/link";
import ROUTES from "@/constants/routes";
import { useSession } from "next-auth/react";
import { deleteQuestion } from "@/lib/server actions/question.action";
import { deleteAnswer } from "@/lib/server actions/answer.action";
import { toast } from "sonner";
import { useTransition } from "react";
import Image from "next/image";

interface Props {
  type: "question" | "answer";
  id: string;
  authorId: string;
}
export default function ActionsButton({ type, id, authorId }: Props) {
  const session = useSession();
  const [isPending, startTransition] = useTransition();
  if (session.data?.user?.id !== authorId) return;

  const handleDelete = async () => {
    startTransition(async () => {
      const deleteFn = type === "question" ? deleteQuestion : deleteAnswer;
      const params = { questionId: id, answerId: id };
      const { success, error } = await deleteFn(params);
      if (!success) toast.error(error?.message || `Failed to delete ${type}`);
    });
  };
  if (type === "question")
    return (
      <>
        <div>
          <Link
            aria-disabled={isPending}
            className="w-full flex-between"
            href={`${ROUTES.QUESTION(id)}/edit`}
          >
            <Image
              src="/icons/edit.svg"
              width={18}
              height={18}
              alt="edit icon"
            />
          </Link>
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Image
                className={`${isPending ? "opacity-40" : ""}`}
                src="/icons/trash.svg"
                alt="trash-icon"
                width={18}
                height={18}
              />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your {type} and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={isPending} onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </>
    );

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Image
          className={`${isPending ? "opacity-40" : ""}`}
          src="/icons/trash.svg"
          alt="trash-icon"
          width={18}
          height={18}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {type} and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
