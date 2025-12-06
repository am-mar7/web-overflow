"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { setTimeout } from "timers";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/urls";
import GlobalResult from "../GlobalResult";

export default function GlobalSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const query = searchParams.get("global");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(query?.length || false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOut = (e: MouseEvent) => {
      // @ts-expect-error Property 'contains' does not exist on type 'EventTarget | null'.
      if (searchRef?.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("click", handleClickOut);

    return () => removeEventListener("click", handleClickOut);
  }, []);
  useEffect(() => {
    const DebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(DebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, query, pathName]);
  useEffect(() => {
    setIsOpen(false);
    setSearch("");
  }, [pathName]);
  return (
    <div ref={searchRef} className="relative max-sm:hidden w-full">
      <div className="bg-light800_dark200! w-full flex gap-4 p-4 bg-light800_darkgradient rounded-lg shadow-md dark:shadow-none">
        <Image
          src="/icons/search.svg"
          alt="search icon"
          width={25}
          height={25}
        />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          placeholder="search for questions, tags or even developers..."
          type="search"
          className="border-none! ring-0! hover:ring-0! bg-transparent! h-full shadow-none!"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
}
