"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/urls";
import { cn } from "@/lib/utils";
export const HomePageFilters = [
  { name: "Newest", value: "newest" },
  { name: "Popular", value: "popular" },
  { name: "Unanswered", value: "unanswered" },
  { name: "Recommeded", value: "recommended" },
];

export default function HomeFilters() {
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "";
  const [active, setActive] = useState(currentFilter);
  const router = useRouter();

  const handleFilterClick = (value: string) => {
    let newUrl = "";
    if (active === value) {
      setActive("");
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      setActive(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: value,
      });
    }
    router.push(newUrl, { scroll: false });
  };
  return (
    <div>
      <div className="flex gap-3 mt-6 max-sm:hidden">
        {HomePageFilters.map((filter) => {
          return (
            <Button
              key={filter.value}
              onClick={() => {
                handleFilterClick(filter.value);
              }}
              className={cn(
                `body-medium rounded-lg px-4 py-2 capitalize shadow-none`,
                active === filter.value
                  ? "bg-primary-100 text-primary-500  dark:bg-dark-400"
                  : "bg-light-800 text-light-500 border border-light-200 dark:border-0 dark:bg-dark-300  "
              )}
            >
              {filter.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
