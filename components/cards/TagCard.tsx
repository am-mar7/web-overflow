import ROUTES from "@/constants/routes";
import { getDeviconClassName } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
type props = {
  id: string;
  name: string;
  questions?: number;
  deleteTag?: () => void;
  removable?: boolean;
};

export default function TagCard({
  id,
  name,
  questions,
  deleteTag,
  removable,
}: props) {
  const iconsClass = getDeviconClassName(name);
  const content = (
    <>
      <div className="bg-light900_dark400 flex-center gap-1 text-light-500 px-3 py-1 space-x-2 border border-light-100 dark:border-0 rounded-lg">
        <div className="space-x-1">
          <i className={iconsClass}></i>
          <i>{name}</i>
        </div>
        {deleteTag && removable && (
          <Image
            src="/icons/close.svg"
            alt="close"
            width={15}
            height={15}
            onClick={() => {
              deleteTag();
            }}
            className="invert-0 dark:invert cursor-pointer"
          />
        )}
      </div>
      <p>{questions}</p>
    </>
  );
  return removable ? (
    <div className="flex-between small-regular">{content}</div>
  ) : (
    <Link href={ROUTES.TAG(id)} className="flex-between small-regular">
      {content}
    </Link>
  );
}
