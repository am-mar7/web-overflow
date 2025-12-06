import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/server actions/question.action";
import { RouteParams } from "@/Types/global";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const { success, data: question } = await getQuestion(id);

  if (!success || !question) {
    return {
      title: "Question Not Found",
      description: "The requested question could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { title } = question;

  return {
    title: `Edit: ${title}`,
    description: `Edit your question: ${title}. Update the title, content, tags, or fix any issues.`,
    
    keywords: [
      "edit question",
      "update question",
      "modify question",
      "programming question",
    ],

    // Open Graph
    openGraph: {
      title: `Edit: ${title}`,
      description: "Edit your programming question",
      type: "website",
      // url: `https://yourdomain.com/questions/${id}/edit`,
    },

    // Twitter Card
    twitter: {
      card: "summary",
      title: `Edit: ${title}`,
      description: "Edit your programming question",
      // creator: "@yourtwitterhandle",
    },

    // Robots - IMPORTANT: Don't index edit pages!
    robots: {
      index: false,     // Edit pages should NOT be indexed
      follow: false,    // Don't follow links from edit pages
      noarchive: true,  // Don't cache this page
      googleBot: {
        index: false,
        follow: false,
        noarchive: true,
      },
    },

    // Alternates
    alternates: {
      // canonical: `https://yourdomain.com/questions/${id}`, // Point to the actual question, not edit page
    },
  };
}


export default async function EditQuestion({ params }: RouteParams) {
  const { id } = await params;
  if (!id) return notFound();

  const [session,{data:question , success}] = await Promise.all([auth() , getQuestion(id)])

  if (!session?.user) return redirect(ROUTES.SIGN_IN);
 
  if(!success) return notFound();

  if (question?.author?._id !== session?.user?.id)
    return redirect(ROUTES.QUESTION(id));

  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="text-dark200_light800 h1-bold">Edit Question</section>

      <section className="mt-6 sm:mt-10">
        <QuestionForm question={question} isEdit />
      </section>
    </div>
  );
}
