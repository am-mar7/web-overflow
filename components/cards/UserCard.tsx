import { User } from "@/Types/global";
import UserAvatar from "../UserAvatar";
import CopyCard from "./CopyCard";
import Link from "next/link";
import ROUTES from "@/constants/routes";

export default function UserCard(user: User) {
  const { name, email, _id } = user;
  return (
    <div className="flex-center flex-col gap-4 bg-light800_dark200 shadow-md dark:shadow-none py-5 rounded-2xl">
      <Link href={ROUTES.PROFILE(_id)} className="flex-center flex-col gap-4 w-full">
        <div className="w-26 h-26">
          <UserAvatar user={user} width={26} height={26} />
        </div>
        <h2 className="h2-semibold font-space-grotesk">{name}</h2>{" "}
      </Link>

      <CopyCard text={email} showText />
    </div>
  );
}
