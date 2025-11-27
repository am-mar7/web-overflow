import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { User } from "next-auth";
import Link from "next/link";
import ROUTES from "@/constants/routes";

export default function UserAvatar({ user }: { user: User }) {
  const { id, name, email, image } = user;
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  if (!id) return null;
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar>
        {image ? (
          <AvatarImage
            width={30}
            height={30}
            src={image}
            alt={name || email || "User Avatar"}
          />
        ) : (
          <AvatarFallback className="bg-primary-500 w-full flex-center">{initials}</AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
}
