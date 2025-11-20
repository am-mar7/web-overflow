"use client";
import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ isMobile = false }) {
  const pathName = usePathname();
  const userId = "1";
  return (
    <>
      {sidebarLinks.map((link) => {
        if (link.label === "Profile" && !userId) return null;
        const resolvedRoute =
          typeof link.route === "function" ? link.route(userId) : link.route;

        const isActive =
          (pathName.includes(resolvedRoute) && resolvedRoute.length > 1) ||
          pathName === resolvedRoute;
        const linkComponent = (
          <Link
            className={`${
              isMobile ? "flex-start" : "flex-center xl:flex-start"
            } gap-3 ${isActive && "bg-primary-gradient"} rounded-lg p-3`}
            href={resolvedRoute}
            prefetch={false}
          >
            <Image
              src={link.imgURL}
              alt={link.label}
              width={30}
              height={30}
              className={isActive ? "" : "invert-colors"}
            />
            <p
              className={`${isMobile ? "" : "max-xl:hidden"} ${
                isActive ? "text-light-900" : "text-dark200_light800"
              }`}
            >
              {link.label}
            </p>
          </Link>
        );
        return isMobile ? (
          <SheetClose asChild key={link.label} className="w-full">
            {linkComponent}
          </SheetClose>
        ) : (
          <div className="w-full" key={link.label}>
            {linkComponent}
          </div>
        );
      })}
    </>
  );
}
