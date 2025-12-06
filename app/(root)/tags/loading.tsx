import CommentFilters from "@/components/filters/CommentFilters";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { TagFilters } from "@/constants";
import ROUTES from "@/constants/routes";
import React from "react";

export default function TagsLoading() {
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <h1 className="h1-bold text-dark200_light800"> All Tags</h1>

      <section className="mt-6 flex-center flex-col sm:flex-row gap-2.5">
        <div className="w-full">
          <LocalSearch route={ROUTES.TAGS} placeholder="search for a tags" />
        </div>
        <CommentFilters
          filters={TagFilters}
          otherClasses="w-full sm:w-fit h-full"
        />
      </section>

      <div className="py-4 grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="flex flex-col gap-3 bg-light700_dark200 p-4 rounded-lg">
            <div className="flex-between">
              <Skeleton className="w-[75px] h-5" />
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-4full h-4" />
            </div>

            <div className="mt-4">
              <Skeleton className="w-24 h-6"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
