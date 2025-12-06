import { GlobalSearchFilters } from "@/constants";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export default function GlobalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";

  const [active, setActive] = useState(type);

  const handleChangeFilter = (value: string) => {
    let newUrl = "";
    if (active === value) {
      setActive("");
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["type"],
      });
    } else {
      setActive(value);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: value,
      });
    }
    router.push(newUrl, { scroll: false });
  };

  return     <div>
  <div className="flex gap-3 mt-6 max-sm:hidden">
    {GlobalSearchFilters.map((filter) => {
      return (
        <Button
          key={filter.value}
          onClick={() => {
            handleChangeFilter(filter.value);
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
</div>;
}
