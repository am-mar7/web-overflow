import DataRenderer from "./DataRenderer";
import Pagination from "./Pagination";
import AnswerCard from "./cards/AnswerCard";
import CommentFilters from "./filters/CommentFilters";
import { AnswerFilters } from "@/constants";
import { getAnswers } from "@/lib/server actions/answer.action";

interface Props {
  page?: number | string;
  filter?: string;
  questionId: string;
}
export default async function AllAnswers({ page = 1, questionId , filter}: Props) {
  const { data, success, error } = await getAnswers({
    questionId,
    filter,
    pageSize: 3,
    page: Number(page) || 1,
  });
  const { totalAnswers, answers, isNext } = data || {};
  return (
    <div>
      <div className="flex-between">
        <h3 className="text-primary-gradient body-bold ">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <CommentFilters filters={AnswerFilters} otherClasses="" />
      </div>

      <section className="mt-6 space-y-12">
        <DataRenderer
          success={success}
          error={error}
          data={answers}
          empty={{
            title: "No answers yet !",
            message: "be first one to help this developr",
          }}
          render={(data) =>
            data?.map((answer) => <AnswerCard {...answer} key={answer._id} />)
          }
        />

        <Pagination isNext={isNext || false} page={page} />
      </section>
    </div>
  );
}
