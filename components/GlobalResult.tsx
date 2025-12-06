"use client";
import ROUTES from "@/constants/routes";
import { useSearchParams } from "next/navigation";
import GlobalFilters from "./filters/GlobalFilters";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GlobalSearchedItem } from "@/Types/global";
import Image from "next/image";
import { globalSearch } from "@/lib/server actions/general.action";

export default function GlobalResult() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<GlobalSearchedItem[]>([]);
  const global = searchParams.get("global");
  const type = searchParams.get("type");

  const generateLink = (id: string, type: string) => {
    switch (type) {
      case "question":
        return ROUTES.QUESTION(id);
      case "answer":
        return ROUTES.QUESTION(id);
      case "user":
        return ROUTES.PROFILE(id);
      case "tag":
        return ROUTES.TAG(id);
      default:
        return "/";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "question":
        return "/icons/question.svg";
      case "answer":
        return "/icons/question.svg";
      case "user":
        return "/icons/account.svg";
      case "tag":
        return "/icons/tag.svg";
      default:
        return "/icons/tag.svg";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "question":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "answer":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "user":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "tag":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  useEffect(() => {
    const getResults = async () => {
      setLoading(true);
      setResult([]);
      const { success, data } = await globalSearch({
        query: global as string,
        type,
      });
      console.log(data);

      if (success && data) setResult(data);
      setLoading(false);
    };
    if (global) getResults();
  }, [global, type]);

  return (
    <div className="absolute top-full z-10 mt-5 ml-2 min-w-[450px] max-w-[600px] rounded-xl border border-light-700 bg-light-900 shadow-xl dark:border-dark-400 dark:bg-dark-200 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-3 pb-2">
        <GlobalFilters />
      </div>
      <div className="h-px bg-light-700/50 dark:bg-dark-500/50" />

      <div className="max-h-[500px] overflow-y-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative h-12 w-12">
              <div className="absolute h-full w-full rounded-full border-4 border-light-700 dark:border-dark-400"></div>
              <div className="absolute h-full w-full animate-spin rounded-full border-4 border-transparent border-t-primary-500"></div>
            </div>
            <p className="mt-4 text-sm text-dark-400 dark:text-light-500">
              Searching for matches...
            </p>
          </div>
        ) : result.length > 0 ? (
          <div className="space-y-3">
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-dark-400 dark:text-light-500">
              {result.length} {result.length === 1 ? "Result" : "Results"} Found
            </p>

            <div className="space-y-1">
              {result.map((item: GlobalSearchedItem, idx) => (
                <Link
                  href={generateLink(item.id, item.type)}
                  key={idx}
                  className="group flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-light-800 dark:hover:bg-dark-300"
                >
                  <div className="mt-0.5 shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-light-800 dark:bg-dark-300 group-hover:bg-light-700 dark:group-hover:bg-dark-400 transition-colors">
                      <Image
                        src={getTypeIcon(item.type)}
                        alt={item.type}
                        width={16}
                        height={16}
                        className="invert-colors object-contain"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-200 dark:text-light-800 line-clamp-2 group-hover:text-primary-500 transition-colors">
                      {item.title}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getTypeColor(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="h-5 w-5 text-dark-400 dark:text-light-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-light-800 dark:bg-dark-300">
              <svg
                className="h-8 w-8 text-dark-400 dark:text-light-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-dark-200 dark:text-light-800">
              No results found
            </p>
            <p className="mt-1 text-xs text-dark-400 dark:text-light-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
