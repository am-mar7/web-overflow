import Image from "next/image";
import Link from "next/link";
import { ModeToggler } from "./ModeToggler";
import ROUTES from "@/constants/routes";
import MobileNavigation from "./MobileNavigation";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="flex-between p-5 sm:px-12 fixed w-full z-50 bg-light900_dark200 shadow-light-300 dark:shadow-none h-20">
      <Link href={ROUTES.HOME} prefetch={false} className="flex-center gap-1.5">
        <Image
          src="/images/site-logo.svg"
          width={30}
          height={30}
          alt="devoverflow logo"
        />
        <p className="max-sm:hidden font-space-grotesk h2-bold">
          Dev <span className="text-primary-500">Overflow</span>
        </p>
      </Link>
      <div>global search</div>
      <div className="flex-between gap-2 sm:gap-4">
        <ModeToggler />
        {user && <UserAvatar user={user}/>}
        <MobileNavigation />
      </div>
    </nav>
  );
}
