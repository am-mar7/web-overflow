import ROUTES from "@/constants/routes";
import { getDeviconClassName } from "@/lib/utils";
import Link from "next/link";
import React from "react";
type props = {
  id: string;
  name: string;
  questions?: number;
};

export default function TagCard({ id, name, questions }: props) {
  const iconsClass = getDeviconClassName(name);
  return (
    <div>
      <Link href={ROUTES.TAG(id)} className="flex-between small-regular">
        <p className="bg-light900_dark400 text-light-500 px-3 py-1 space-x-2  rounded-lg">
          <i className={iconsClass}></i>
          <i>{name}</i>
        </p>
        <p>{questions}</p>
      </Link>
    </div>
  );
}
