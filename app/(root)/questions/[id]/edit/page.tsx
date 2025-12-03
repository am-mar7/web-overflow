import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/server actions/question.action";
import { RouteParams } from "@/Types/global";
import { notFound, redirect } from "next/navigation";

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
      <section className="text-dark200_light800 h1-bold">edit Question</section>

      <section className="mt-6 sm:mt-10">
        <QuestionForm question={question} isEdit />
      </section>
    </div>
  );
}
