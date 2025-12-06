import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommentFilters from "@/components/filters/CommentFilters";
import HomeFilters, { HomePageFilters } from "@/components/filters/HomeFilters";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { getQuestions } from "@/lib/server actions/question.action";
import { RouteParams } from "@/Types/global";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dev Overflow",
  // Alternative title with template:
  // title: {
  //   default: "Your App Name - Q&A Platform for Developers",
  //   template: "%s | Your App Name" // For child pages
  // },
  
  description: "Join our community of developers to ask questions, share knowledge, and learn from experienced programmers. Get answers to your coding problems and help others grow.",
  
  keywords: [
    "programming questions",
    "coding help",
    "developer community",
    "Q&A platform",
    "programming forum",
    "coding answers",
    "tech questions",
    "developer help",
    "software development",
    "learn programming",
    "code solutions",
    "programming tutorials"
  ],

  // Application metadata
  applicationName: "Your App Name",
  authors: [{ name: "Your Name" }],
  generator: "Next.js",
  
  // Open Graph for social media sharing
  openGraph: {
    title: "Your Q&A Platform for Developers",
    description: "Ask questions, share knowledge, and learn from experienced developers worldwide.",
    type: "website",
    locale: "en_US",
    siteName: "Your App Name",
    // url: "https://yourdomain.com", // Add your domain
    // images: [
    //   {
    //     url: "https://yourdomain.com/og-home.png", // Add your OG image
    //     width: 1200,
    //     height: 630,
    //     alt: "Your App Name - Developer Q&A Platform",
    //     type: "image/png",
    //   },
    // ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Your Q&A Platform for Developers",
    description: "Ask questions, share knowledge, and learn from experienced developers worldwide.",
    // site: "@yourtwitterhandle", // Your site's Twitter handle
    // creator: "@yourtwitterhandle", // Your Twitter handle
    // images: ["https://yourdomain.com/og-home.png"],
  },

  // Verification for search engines
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  //   bing: "your-bing-verification-code",
  // },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

 // Category
  category: "technology",
};

export default async function Home({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { questions , isNext } = data || {};
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="flex gap-5 flex-col-reverse sm:flex-row justify-between">
        <h1 className="h1-bold text-dark200_light800"> All Questions</h1>
        <Button
          asChild
          className="bg-primary-gradient text-light-900 min-h-[42px]"
        >
          <Link href={ROUTES.ASK_QUESTION} className="base-medium!">
            Ask a Questions
          </Link>
        </Button>
      </section>

      <section className="mt-6">
        <LocalSearch route={ROUTES.HOME} placeholder="search for a Question" />
      </section>

      <HomeFilters />
      <CommentFilters filters={HomePageFilters} otherClasses="sm:hidden mt-5" />
      <DataRenderer
        success={success}
        error={error}
        empty={{
          title: "No questions found",
          message: "The question board is empty. Maybe it’s waiting for your brilliant question to get things rolling",
          button: {
            text: "ask question",
            href: ROUTES.ASK_QUESTION,
          },
        }}
        data={questions}
        render={(questions) => (
          <section className="mt-5 w-full flex flex-col gap-6">
            {questions?.map((question) => {
              return <QuestionCard key={question._id} question={question} />;
            })}
          </section>
        )}
      />

      <Pagination isNext={isNext || false} page={page} />
    </div>
  );
}
