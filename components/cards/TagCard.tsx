import ROUTES from "@/constants/routes";
import { getDeviconClassName, getTechDescription } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
type props = {
  id: string;
  name: string;
  questions?: number;
  deleteTag?: () => void;
  removable?: boolean;
  compact?: boolean;
};

export default function TagCard({
  id,
  name,
  questions,
  deleteTag,
  removable,
  compact = true,
}: props) {
  const iconsClass = getDeviconClassName(name);
  const techDescription = getTechDescription(name);
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
  if (compact) {
    return removable ? (
      <div className="flex-between small-regular">{content}</div>
    ) : (
      <Link href={ROUTES.TAG(id)} className="flex-between small-regular">
        {content}
      </Link>
    );
  }

  return (
    <Link href={ROUTES.TAG(id)} className="shadow-md dark:shadow-none overflow-hidden">
      <article className="flex justify-between flex-col gap-2 h-full bg-light800_dark200 p-5 rounded-lg">
        <div className="space-y-2">
          <div className="flex-between">
            <p className="text-dark200_light800 bg-light700_dark400 py-1 px-2 rounded-sm  base-bold ">
              {name}
            </p>
            <i className={`${iconsClass} text-xl`} />
          </div>
          <p className="small-regular  text-dark500_light700">
            {techDescription}
          </p>
        </div>
        <div>
          <span className="text-primary-500">+{questions}</span>{" "}
          <span className="text-light-500">Questions</span>
        </div>
      </article>
    </Link>
  );
}
