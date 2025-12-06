import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import SigninBtn from "../buttons/SigninBtn";
import SignupBtn from "../buttons/SignupBtn";
import NavLinks from "./NavLinks";
import { auth } from "@/auth";
import LogoutBtn from "../buttons/LogoutBtn";

export default async function MobileNavigation() {
  const session = await auth();
  const isAuthentecated = session?.user ? true : false;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="p-2! sm:hidden">
          <Image
            src="/icons/hamburger.svg"
            alt="toggle icon"
            width={25}
            height={25}
            className="invert-colors"
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-light900_dark200 border-none px-5 py-8 sm:hidden"
      >
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <div>
          <div className="flex-start gap-1.5">
            <Image
              src="/images/site-logo.svg"
              width={30}
              height={30}
              alt="devoverflow logo"
            />
            <p className="font-space-grotesk h2-bold">
              Dev <span className="text-primary-500">Overflow</span>
            </p>
          </div>
          <div className="space-y-4 mt-12">
            <NavLinks isMobile userId={session?.user?.id} />
          </div>
        </div>
        <SheetFooter>
          {isAuthentecated ? (
            <LogoutBtn isMobile />
          ) : (
            <>
              <SheetClose asChild>
                <SigninBtn isMobile />
              </SheetClose>
              <SheetClose asChild>
                <SignupBtn isMobile />
              </SheetClose>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
