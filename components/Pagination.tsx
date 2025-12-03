"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/urls";

interface Props {
  isNext: boolean ;
  page: string | number;
}
export default function Pagination({ isNext, page = 1 }: Props) {
  page = Number(page);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePagination = (step: 1 | -1) => {
    const value = page + step > 1 ? (page + step).toString() : "";
    let newUrl = "";
    if (value.length) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value,
      });
    } else {
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["page"],
      });
    }

    router.push(newUrl);
  };

  if(page === 1 && !isNext) return null;

  return (
    <div className="w-full flex-center gap-3.5 mt-8">
      <div>
        <Button
          onClick={() => handlePagination(-1)}
          disabled={page === 1}
          className={`${
            page > 1 ? null : "opacity-30"
          } bg-light700_dark200 px-3.5! py-3.5! h-full! rounded-lg text-dark200_light800 shadow-lg`}
        >
          <Image
            src="/icons/arrow-left.svg"
            width={20}
            height={20}
            alt="prev"
            className="invert-colors"
          />
        </Button>
      </div>

      <div className="bg-primary-500 px-5 py-2.5 rounded-lg text-light-800">
        <p>{page}</p>
      </div>

      <div>
        <Button
          onClick={() => handlePagination(1)}
          disabled={!isNext}
          className={`${
            isNext ? null : "opacity-40"
          } bg-light700_dark200 px-3.5! py-3.5! h-full! rounded-lg text-dark200_light800 shadow-lg`}
        >
          <Image
            src="/icons/arrow-right.svg"
            width={20}
            height={20}
            alt="prev"
            className="invert-colors"
          />
        </Button>
      </div>
    </div>
  );
}
