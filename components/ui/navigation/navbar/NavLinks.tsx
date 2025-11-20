"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathName = usePathname();
  return (
    <>
      {sidebarLinks.map((link) => {
        const isActive =
          (pathName.includes(link.route) && link.route.length > 1) ||
          pathName === link.route;
        return (
          <div key={link.label} className="w-full px-4">
            <Link
              className={`flex items-center gap-3 ${
                isActive && "bg-primary-gradient"
              } rounded-lg px-6 py-3`}
              href={link.route}
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
                className={`max-xl:hidden ${
                  isActive ? "text-light-900" : "text-dark200_light800"
                }`}
              >
                {link.label}
              </p>
            </Link>
          </div>
        );
      })}
    </>
  );
}
