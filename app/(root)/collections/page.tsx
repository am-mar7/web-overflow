import { auth } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommentFilters from "@/components/filters/CommentFilters";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { CollectionFilters } from "@/constants";
import ROUTES from "@/constants/routes";
import { getCollections } from "@/lib/server actions/collection.action";
import { RouteParams } from "@/Types/global";
import { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";

export const metadata: Metadata = {
  title: "DOF | Saved Questions",
  description:
    "View and manage your saved questions. Access your bookmarked programming questions and answers for quick reference and future learning.",

  keywords: [
    "saved questions",
    "bookmarked questions",
    "question collection",
    "saved answers",
    "programming bookmarks",
    "developer resources",
    "code snippets",
    "learning resources",
  ],

  // Open Graph for social media sharing
  openGraph: {
    title: "My Collections | Saved Questions",
    description:
      "View and manage your saved programming questions and answers.",
    type: "website",
    // url: "https://yourdomain.com/collections", // Add your domain
    // images: [
    //   {
    //     url: "https://yourdomain.com/og-collections.png", // Add your OG image
    //     width: 1200,
    //     height: 630,
    //     alt: "Collections - Your App Name",
    //   },
    // ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "My Collections | Saved Questions",
    description:
      "View and manage your saved programming questions and answers.",
    // images: ["https://yourdomain.com/og-collections.png"],
    // creator: "@yourtwitterhandle",
  },

  // Additional metadata
  robots: {
    index: false, // Collections are personal, don't index
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default async function Collection({ searchParams }: RouteParams) {
  const [{ page, pageSize, query, filter }, session] = await Promise.all([
    searchParams,
    auth(),
  ]);

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-3">
            <Bookmark
              className="mx-auto h-26 w-16 text-dark300_light700"
              strokeWidth={1.5}
            />
            <h1 className="h2-bold text-dark200_light800">
              Collections Require Authentication
            </h1>
            <p className="body-regular text-dark500_light700">
              Sign in to view and manage your saved questions. Start building
              your personal collection of knowledge today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={ROUTES.SIGN_IN}
              className="primary-gradient min-h-[46px] px-6 py-3 rounded-lg text-dark200_light800 font-semibold transition-all hover:opacity-90"
            >
              Sign In
            </Link>
            <Link
              href={ROUTES.SIGN_UP}
              className="btn-secondary min-h-[46px] px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Create Account
            </Link>
          </div>

          <Link
            href={ROUTES.HOME}
            className="inline-block text-primary-500 hover:text-primary-600 transition-colors body-medium"
          >
            ← Explore Questions
          </Link>
        </div>
      </div>
    );
  }

  const { success, data, error } = await getCollections({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { questions, isNext } = data || {};
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="flex gap-5 flex-col-reverse sm:flex-row justify-between">
        <h1 className="h1-bold text-dark200_light800"> Saved Questions</h1>
      </section>

      <section className="mt-6 flex-center flex-col sm:flex-row gap-2.5">
        <div className="w-full">
          <LocalSearch
            route={ROUTES.COLLECTIONS}
            placeholder="search for a saved Question..."
          />
        </div>
        <CommentFilters
          filters={CollectionFilters}
          otherClasses="w-full sm:w-fit h-full"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        empty={{
          title: "Collections Are Empty",
          message:
            "Looks like you haven’t created any collections yet. Start curating something extraordinary today",
          button: {
            text: "go explore questions",
            href: ROUTES.HOME,
          },
        }}
        data={questions}
        render={(questions) => (
          <section className="mt-5 w-full flex flex-col gap-6">
            {questions?.map((item) => {
              return <QuestionCard key={item._id} question={item.question} />;
            })}
          </section>
        )}
      />

      <Pagination isNext={isNext || false} page={page} />
    </div>
  );
}
