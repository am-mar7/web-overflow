import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { redirect } from "next/navigation";


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
