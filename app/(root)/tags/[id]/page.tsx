import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommentFilters from "@/components/filters/CommentFilters";
import { HomePageFilters } from "@/components/filters/HomeFilters";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/searchbars/LocalSearch";
import ROUTES from "@/constants/routes";
import { getTagQuestions } from "@/lib/server actions/tag.action";
import { RouteParams } from "@/Types/global";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const { data, success } = await getTagQuestions({
    page: 1,
    pageSize: 10,
    tagId: id,
  });

  if (!success || !data || !data.tag) {
    return {
      title: "Tag Not Found",
      description: "The requested tag could not be found.",
    };
  }

  const { tag, questions } = data;
  const questionCount = questions?.length || 0;

  const tagName = tag.name;
  const displayName = tagName.charAt(0).toUpperCase() + tagName.slice(1);

  return {
    title: `${displayName} Questions | Q&A`,
    description: `Browse ${questionCount}+ questions tagged with ${tagName}. Get answers and solutions for ${tagName} related programming problems from experienced developers.`,

    keywords: [
      tagName,
      `${tagName} questions`,
      `${tagName} programming`,
      `${tagName} help`,
      `${tagName} tutorial`,
      `${tagName} code`,
      `${tagName} examples`,
      "programming questions",
      "coding help",
      "developer community",
    ],

    // Open Graph
    openGraph: {
      title: `${displayName} Questions`,
      description: `Find answers to ${tagName} programming questions. ${questionCount}+ discussions from developers worldwide.`,
      type: "website",
      // url: `https://yourdomain.com/tags/${id}`,
      // images: [
      //   {
      //     url: `https://yourdomain.com/og-tag-${tagName}.png`, // Could be dynamic tag icon
      //     width: 1200,
      //     height: 630,
      //     alt: `${displayName} Questions`,
      //   },
      // ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: `${displayName} Questions`,
      description: `Find answers to ${tagName} programming questions from experienced developers.`,
      // images: [`https://yourdomain.com/og-tag-${tagName}.png`],
      // creator: "@yourtwitterhandle",
    },

    // Additional metadata
    other: {
      topic: tagName,
      "article:tag": tagName,
    },

    // Robots - Tag pages are great for SEO!
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      googleBot: {
        index: true,
        follow: true,
      },
    },

    // Alternates
    alternates: {
      // canonical: `https://yourdomain.com/tags/${id}`,
    },
  };
}

export default async function Tag({ params, searchParams }: RouteParams) {
  const [{ id }, { page, query, filter }] = await Promise.all([
    params,
    searchParams,
  ]);

  const { data, success, error } = await getTagQuestions({
    page: Number(page) || 1,
    pageSize: 10,
    query,
    filter,
    tagId: id,
  });
  const { isNext, tag, questions } = data || {};
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <h1 className="h1-semibold text-dark200_light800">{tag?.name}</h1>
      <section className="mt-6 flex-center flex-col sm:flex-row gap-2.5">
        <div className="w-full">
          <LocalSearch
            route={ROUTES.TAG(id)}
            placeholder="search for Question..."
          />
        </div>
        <CommentFilters
          filters={HomePageFilters}
          otherClasses="w-full sm:w-fit h-full"
        />
      </section>

      <section>
        <DataRenderer
          success={success}
          error={error}
          empty={{
            title: "No questions found",
            message:
              "The question board is empty. Maybe it’s waiting for your brilliant question to get things rolling",
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
      </section>
    </div>
  );
}
