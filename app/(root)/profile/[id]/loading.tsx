import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      {/* Profile Header Section */}
      <section className="flex justify-between items-start gap-4 bg-light700_dark200 p-4">
        <div className="flex max-sm:flex-col gap-4 items-center">
          {/* Avatar Skeleton */}
          <div className="w-32 h-32">
            <Skeleton className="w-full h-full rounded-full" />
          </div>

          <div className="space-y-2">
            {/* Name Skeleton */}
            <Skeleton className="h-8 w-48" />
            {/* Email Skeleton */}
            <Skeleton className="h-7 w-64" />
          </div>
        </div>

        {/* Reputation Skeleton */}
        <div className="flex-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-12" />
        </div>
      </section>

      {/* Profile Links Section */}
      <section className="bg-light700_dark200 p-4 mt-2 ">
        <div className="flex-start mt-6 gap-4 sm:gap-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Bio Skeleton */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <Skeleton className="h-7 w-20 mt-10 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
          {/* Questions & Answers Card */}
          <div className="px-5 py-2.5 rounded-lg bg-light700_dark200 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>

          {/* Badge Cards */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="px-5 py-2.5 rounded-lg bg-light700_dark200 flex flex-col justify-evenly"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section - No Tabs Component */}
      <section className="mt-12 flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-2/3">
          {/* Tab buttons skeleton */}
          <div className="bg-light700_dark400 inline-flex h-10 items-center justify-center rounded-md p-1 mb-4">
            <Skeleton className="h-8 w-24 mx-1" />
            <Skeleton className="h-8 w-24 mx-1" />
          </div>

          {/* Questions/Answers Content */}
          <div className="mt-5 w-full flex flex-col gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-light700_dark200 space-y-4"
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
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-6 flex justify-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Top Tech Sidebar */}
        <div className="md:w-1/3 mt-4 shrink">
          <Skeleton className="h-7 w-24 mb-4" />
          <div className="space-y-3 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div  key={i} className="flex-between bg-light700_dark200 p-4 rounded-lg">
                <Skeleton className="h-6 w-18 rounded-lg" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
