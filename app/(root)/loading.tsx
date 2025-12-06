import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HomeFilters, { HomePageFilters } from "@/components/filters/HomeFilters";
import CommentFilters from "@/components/filters/CommentFilters";
import LocalSearch from "@/components/searchbars/LocalSearch";
import ROUTES from "@/constants/routes";
export default function HomePageLoading() {
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="flex gap-5 flex-col-reverse sm:flex-row justify-between">
        <h1 className="h1-bold text-dark200_light800"> All Questions</h1>
        <Skeleton className="h-[42px] w-[180px]" />
      </section>

      <section className="mt-6">
        <LocalSearch route={ROUTES.HOME} placeholder="search for a Question" />
      </section>

      <HomeFilters />
      <CommentFilters filters={HomePageFilters} otherClasses="sm:hidden mt-5" />
      <div className="mt-5 w-full flex flex-col gap-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="p-6 rounded-lg bg-light800_dark200 space-y-4"
          >
            {/* Question Title */}
            <Skeleton className="h-6 w-3/4" />

            {/* Question Content */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Tags and Stats */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
