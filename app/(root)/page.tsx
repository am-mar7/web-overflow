import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/filters/HomeFilters";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions: Question[] = [
  {
    title: "How do I center a div in CSS?",
    id: "q1a2b3c4d5e6f7g8h9i0",
    createdAt: new Date("2024-11-15T10:30:00Z"),
    updatedAt: new Date("2024-11-16T14:22:00Z"),
    upvotes: 42,
    answers: 8,
    views: 1250,
    author: {
      id: "user123",
      name: "Sarah Chen",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    tags: [
      { id: "tag1", name: "css" },
      { id: "tag2", name: "html" },
      { id: "tag3", name: "flexbox" },
    ],
  },
  {
    title: "What's the difference between let, const, and var in JavaScript?",
    id: "j9k8l7m6n5o4p3q2r1s0",
    createdAt: new Date("2024-11-18T08:15:00Z"),
    upvotes: 127,
    answers: 15,
    views: 3420,
    author: {
      id: "user456",
      name: "Mike Johnson",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
    tags: [
      { id: "tag4", name: "javascript" },
      { id: "tag5", name: "es6" },
      { id: "tag6", name: "variables" },
    ],
  },
  {
    title: "How to handle async/await errors in React components?",
    id: "t0u9v8w7x6y5z4a3b2c1",
    createdAt: new Date("2024-11-20T16:45:00Z"),
    upvotes: 89,
    answers: 12,
    views: 2180,
    author: {
      id: "user789",
      name: "Alex Rodriguez",
      avatarUrl: "https://i.pravatar.cc/150?img=33",
    },
    tags: [
      { id: "tag7", name: "react" },
      { id: "tag8", name: "async-await" },
      { id: "tag9", name: "error-handling" },
      { id: "tag10", name: "typescript" },
    ],
  },
];

export default function Home() {
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

      <section className="mt-5 space-y-2.5">
        {questions.map(
          ({ id, answers, views, author, upvotes, title, createdAt, tags }) => {
            return (
              <QuestionCard
                key={id}
                id={id}
                author={author}
                title={title}
                tags={tags}
                createdAt={createdAt}
                upvotes={upvotes}
                views={views}
                answers={answers} 
              />
            );
          }
        )}
      </section>
    </div>
  );
}
