import { ActionResponse, Answer } from "@/Types/global";
import DataRenderer from "./DataRenderer";
import AnswerCard from "./cards/AnswerCard";
import CommentFilters from "./filters/CommentFilters";
import { AnswerFilters } from "@/constants";

interface Props extends ActionResponse<Answer[]> {
  page?: number;
  isNext?: boolean;
  totalAnswers?: number;
}
export default function AllAnswers({
  data,
  totalAnswers,
  success,
  error,
}: Props) {
  return (
    <div>
      <div className="flex-between">
        <h3 className="text-primary-gradient body-regular">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <CommentFilters filters={AnswerFilters} otherClasses="" />
      </div>

      <section className="mt-6 space-y-12">
        <DataRenderer
          success={success}
          error={error}
          data={data}
          empty={{
            title: "No answers yet !",
            message: "be first one to help this developr",
          }}
          render={(data) =>
            data?.map((answer) => <AnswerCard {...answer} key={answer._id} />)
          }
        />
      </section>
    </div>
  );
}
