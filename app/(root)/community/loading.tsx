import CommentFilters from "@/components/filters/CommentFilters";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { UserFilters } from "@/constants";
import ROUTES from "@/constants/routes";

export default function CommunityLoading() {
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="flex gap-5 flex-col-reverse sm:flex-row justify-between">
        <h1 className="h1-bold text-dark200_light800"> All users</h1>
      </section>

      <section className="mt-6 flex-center flex-col sm:flex-row gap-2.5">
        <div className="w-full">
          <LocalSearch
            route={ROUTES.COMMUNITY}
            placeholder="search for your fav dev..."
          />
        </div>
        <CommentFilters
          filters={UserFilters}
          otherClasses="w-full sm:w-fit h-full"
        />
      </section>

      <div className="py-4 grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="flex-center gap-3 flex-col bg-light700_dark200 py-4 rounded-lg">
            <Skeleton className="h-[75px] w-[75px] rounded-full"/>
            <Skeleton className="h-4 w-[150px]"/>
            <Skeleton className="h-6 w-[180px]"/>
          </div>
        ))}
      </div>
    </div>
  );
}
