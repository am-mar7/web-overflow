import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      {/* Profile Header Section */}
      <section className="flex justify-between items-start gap-4">
        <div className="flex max-sm:flex-col gap-4 sm:items-center">
          {/* Avatar Skeleton */}
          <Skeleton className="w-32 h-32 rounded-full" />
          
          <div className="space-y-2">
            {/* Name Skeleton */}
            <Skeleton className="h-8 w-48" />
            {/* Email Skeleton */}
            <Skeleton className="h-6 w-64" />
          </div>
        </div>
        
        {/* Reputation Skeleton */}
        <div className="flex-center gap-2">
          <Skeleton className="h-6 w-24" />
        </div>
      </section>

      {/* Profile Links Section */}
      <section>
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
        <Skeleton className="h-8 w-32 mt-10 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </section>

      {/* Tabs Section */}
      <section className="mt-12 flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="bg-light800_dark400!">
              <TabsTrigger className="tab" value="questions">
                questions
              </TabsTrigger>
              <TabsTrigger className="tab" value="answers">
                answers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="questions">
              <div className="mt-5 w-full flex flex-col gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
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
            </TabsContent>

            <TabsContent value="answers">
              <div className="mt-5 w-full flex flex-col gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-lg bg-light800_dark200 space-y-4"
                  >
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Pagination Skeleton */}
          <div className="mt-6 flex justify-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Top Tech Sidebar */}
        <div className="md:w-1/3 mt-4 shrink">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-3 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}