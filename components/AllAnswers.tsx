import { auth } from "@/auth";
import DataRenderer from "./DataRenderer";
import Pagination from "./Pagination";
import AnswerCard from "./cards/AnswerCard";
import CommentFilters from "./filters/CommentFilters";
import { AnswerFilters } from "@/constants";
import { getAnswers } from "@/lib/server actions/answer.action";
import { Author } from "@/Types/global";

interface Props {
  page?: number | string;
  filter?: string;
  questionId: string;
  questionAuthor: Author;
}
export default async function AllAnswers({
  page = 1,
  questionId,
  filter,
  questionAuthor,
}: Props) {
  const [{ data, success, error }, session] = await Promise.all([
    getAnswers({
      questionId,
      filter,
      pageSize: 3,
      page: Number(page) || 1,
    }),
    auth(),
  ]);

  const userId = session?.user?.id;
  const { totalAnswers, answers, isNext } = data || {};
  return (
    <div>
      <div className="flex-between mt-6">
        <h3 className="text-primary-gradient body-bold w-full bg-amber-300">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        {totalAnswers ? (
          <CommentFilters filters={AnswerFilters} otherClasses="max-h-[30px]" />
        ) : null}
      </div>

      <section className="mt-6 space-y-12">
        <DataRenderer
          success={success}
          error={error}
          data={answers}
          empty={{
            title: "No answers yet !",
            message:
              questionAuthor._id === userId
                ? ""
                : "be first one to help this developer",
          }}
          render={(data) =>
            data?.map((answer) => (
              <AnswerCard
                showActionButtons={userId === answer.author._id}
                {...answer}
                key={answer._id}
              />
            ))
          }
        />

        <Pagination isNext={isNext || false} page={page} />
      </section>
    </div>
  );
}
