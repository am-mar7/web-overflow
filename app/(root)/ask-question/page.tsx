import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "DOF | Ask a Question",
  description: "Ask a programming question and get help from the community. Share your code, describe your problem, and receive expert answers from developers worldwide.",  
  keywords: [
    "ask question",
    "programming help",
    "coding question",
    "developer community",
    "tech support",
    "code help",
    "programming forum",
    "ask developers"
  ],

  // Open Graph for social media sharing (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "Ask a Question",
    description: "Get help with your programming questions from experienced developers.",
    type: "website",
    // url: "https://yourdomain.com/ask-question", // Add your domain
    // images: [
    //   {
    //     url: "https://yourdomain.com/og-image.png", // Add your OG image
    //     width: 1200,
    //     height: 630,
    //     alt: "Ask a Question - Your App Name",
    //   },
    // ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Ask a Question",
    description: "Get help with your programming questions from experienced developers.",
    // images: ["https://yourdomain.com/og-image.png"], // Add your image
    // creator: "@yourtwitterhandle", // Optional: your Twitter handle
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function AskQuestion() {
  const session = await auth();
  if(!session?.user)
    return redirect(ROUTES.SIGN_IN);
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="text-dark200_light800 h1-bold">
        Ask a Question
      </section>

      <section className="mt-6 sm:mt-10">
        <QuestionForm/>
      </section>
    </div>
  );
}
