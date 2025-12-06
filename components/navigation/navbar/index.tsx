import Image from "next/image";
import Link from "next/link";
import { ModeToggler } from "./ModeToggler";
import ROUTES from "@/constants/routes";
import MobileNavigation from "./MobileNavigation";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import GlobalSearch from "@/components/searchbars/GlobalSearch";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="flex-between p-5 sm:px-12 fixed w-full z-50 bg-light900_dark200 shadow-light-300 dark:shadow-none h-20">
      <Link
        href={ROUTES.HOME}
        prefetch={false}
        className="flex items-center justify-start gap-1.5 sm:w-[70px] xl:w-[266px] 2xl:w-[246px]"
      >
        <Image
          src="/images/site-logo.svg"
          width={30}
          height={30}
          alt="devoverflow logo"
        />
        <p className="max-xl:hidden font-space-grotesk h2-bold">
          Dev <span className="text-primary-500">Overflow</span>
        </p>
      </Link>
      <div className="flex sm:w-full">
        <GlobalSearch />

        <div className="flex items-center justify-end gap-2 sm:gap-4 max-lg:ml-4 lg:w-[275px] xl:w-[410px] 2xl:w-[360px]">
          <ModeToggler />
          {user?.id && (
            <Link href={ROUTES.PROFILE(user.id)}>
              <UserAvatar user={user} />
            </Link>
          )}
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
}
