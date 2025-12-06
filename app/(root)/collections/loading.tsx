import CommentFilters from "@/components/filters/CommentFilters";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectionFilters } from "@/constants";
import ROUTES from "@/constants/routes";

export default function CollectionLoading() {
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="flex gap-5 flex-col-reverse sm:flex-row justify-between">
        <h1 className="h1-bold text-dark200_light800">Saved Questions</h1>
      </section>

      <section className="mt-6 flex gap-2">
        <div className="w-full">
          <LocalSearch
            route={ROUTES.COLLECTIONS}
            placeholder="search for a saved Question..."
          />
        </div>
        <CommentFilters filters={CollectionFilters} otherClasses="" />
      </section>

      <div className="mt-5 w-full flex flex-col gap-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="p-6 rounded-lg bg-light800_dark200 space-y-4">
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
