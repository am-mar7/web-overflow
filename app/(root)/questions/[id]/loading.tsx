import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

export default function QuestionDetailsloading() {
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <div className="bg-light700_dark300 px-5 py-2.5 rounded-lg shadow-md dark:shadow-none">
        {/* Author and Actions Section */}
        <section className="flex-between">
          <div className="flex-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="flex-center gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </section>

        {/* Title and Metrics Section */}
        <section className="py-5">
          <Skeleton className="h-8 w-3/4 mb-3" />

          <div className="flex gap-3 mt-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </section>

        {/* Content Preview */}
        <div className="space-y-3 py-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Tags Section */}
        <section className="flex gap-2 my-5">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </section>
      </div>

      {/* All Answers Section */}
      <section className="mb-5 mt-8">
        <Skeleton className="h-7 w-40 mb-4" />
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-light700_dark300 p-5 rounded-lg shadow-md dark:shadow-none"
            >
              <div className="flex-between mb-3">
                <div className="flex-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Answer Form Section */}
      <section>
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="bg-light700_dark300 p-5 rounded-lg shadow-md dark:shadow-none">
          <Skeleton className="h-64 w-full rounded-md" />
          <Skeleton className="h-10 w-32 mt-4" />
        </div>
      </section>
    </div>
  );
}