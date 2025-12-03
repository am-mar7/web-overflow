"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/lib/urls";

interface Filter {
  name: string;
  value: string;
}

interface Props {
  otherClasses: string;
  filters: Filter[];
}
export default function CommentFilters({ otherClasses, filters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchFilters = searchParams.get("filter");

  const handleChangeFilter = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="w-full sm:w-fit">
      <Select
        onValueChange={handleChangeFilter}
        defaultValue={searchFilters || undefined}
      >
        <SelectTrigger
          className={cn(
            "w-full! bg-light800_dark200! shadow-md dark:shadow-none py-4.5! px-5! h-full! body-regular border-none",
            otherClasses
          )}
          aria-label="Filter options"
        >
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent className="bg-light800_dark200!">
          <SelectGroup>
            <SelectLabel>Filters</SelectLabel>
            {filters.map(({ name, value }) => (
              <SelectItem key={value} value={value}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
