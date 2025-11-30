import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "next-auth";

export default function UserAvatar({
  user,
  width = 9,
  height = 9,
}: {
  user: User;
  width?: number;
  height?: number;
}) {
  const { name, email, image } = user;
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={`w-${width} h-${height}`}>
      {image ? (
        <AvatarImage
          width={width}
          height={height}
          src={image}
          alt={name || email || "User Avatar"}
        />
      ) : (
        <AvatarFallback className="bg-primary-500 w-full flex-center">
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
