"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/urls";

export default function LocalSearch({
  route,
  placeholder,
}: {
  route: string;
  placeholder: string;
}) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(searchQuery);
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    const depouncedFn = setTimeout(() => {
      if (query) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathName === route) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(depouncedFn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [query, pathName, route]);

  return (
    <div className="flex gap-4 p-4 bg-light800_darkgradient rounded-lg shadow-light-300 dark:shadow-none">
      <Image src="icons/search.svg" alt="search icon" width={25} height={25} />
      <Input
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        type="search"
        className="border-none! ring-0! hover:ring-0! bg-transparent! h-full shadow-none!"
       />
    </div>
  );
}
