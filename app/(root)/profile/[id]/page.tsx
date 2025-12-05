import ProfileLink from "@/components/user/ProfileLink";
import UserAvatar from "@/components/UserAvatar";
import {
  getUser,
  getUserAnswers,
  getUserQuestions,
  getUserStats,
  getUserTags,
} from "@/lib/server actions/user.action";
import { RouteParams } from "@/Types/global";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import StatsCard from "@/components/user/StatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataRenderer from "@/components/DataRenderer";
import ROUTES from "@/constants/routes";
import QuestionCard from "@/components/cards/QuestionCard";
import AnswerCard from "@/components/cards/AnswerCard";
import Pagination from "@/components/Pagination";
import TagCard from "@/components/cards/TagCard";

export default async function Profile({ params, searchParams }: RouteParams) {
  const [{ id }, { page }] = await Promise.all([params, searchParams]);
  const [
    { success, data: user },
    {
      success: userQuestinsSuccess,
      data: questionsData,
      error: questionsError,
    },
    { success: userAnswersSuccess, data: answersData, error: answersError },
    { success: userTagsSuccess, data: tagsData, error: tagsError },
    { data: statsData },
  ] = await Promise.all([
    getUser(id),
    getUserQuestions({ userId: id, page: Number(page) || 1, pageSize: 5 }),
    getUserAnswers({ userId: id, page: Number(page) || 1, pageSize: 5 }),
    getUserTags({ userId: id }),
    getUserStats(id),
  ]);

  if (!success || !user || !id) return notFound();

  const { name, email, bio, createdAt, portfolio, reputation } = user || {};
  const { questions, isNext: hasMoreQuestions } = questionsData || {};
  const { answers, isNext: hasMoreAnswers } = answersData || {};
  const { totalQuestions, totalAnswers, badges } = statsData || {};

  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <section className="flex justify-between items-start gap-4">
        <div className="flex max-sm:flex-col gap-4 items-center">
          <div className="w-32 h-32">
            <UserAvatar user={user} width={32} height={32} />
          </div>
          <div>
            <p className="font-space-grotesk py-0! h1-semibold">{name}</p>
            <p className="font-space-grotesk h3-semibold">{email}</p>
          </div>
        </div>
        <p className="flex-center gap-2">
          <span className="text-light-500 font-space-grotesk">
            reputation:
          </span>
          <span>{reputation}</span>
        </p>
      </section>

      <section>
        <div className="flex-start mt-6 gap-4 sm:gap-6">
          {portfolio && (
            <ProfileLink
              imgUrl="/icons/link.svg"
              href={portfolio}
              title="Portfolio"
            />
          )}
          <ProfileLink
            imgUrl="/icons/calendar.svg"
            title={dayjs(createdAt).format("MMMM YYYY")}
          />
        </div>

        <p>{bio}</p>
      </section>

      <section>
        <h3 className="h3-semibold mt-10 mb-4">Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4  gap-4">
          <div className="px-5 py-2.5 flex flex-col justify-evenly rounded-lg bg-light800_dark200 flex-1">
            <p className="flex-between">
              <span>answers</span>
              <span>{totalAnswers || 0}</span>
            </p>
            <p className="flex-between">
              <span>questions</span>
              <span>{totalQuestions || 0}</span>
            </p>
          </div>
          <StatsCard
            image="/icons/gold-medal.svg"
            title="glod badges"
            value={badges?.GOLD || 0}
          />
          <StatsCard
            image="/icons/silver-medal.svg"
            title="silver badges"
            value={badges?.SILVER || 0}
          />
          <StatsCard
            image="/icons/bronze-medal.svg"
            title="bronze badges"
            value={badges?.BRONZE || 0}
          />
        </div>
      </section>

      <section className="mt-12 flex flex-col md:flex-row gap-10">
        <Tabs defaultValue="qustions" className="w-full md:w-2/3">
          <TabsList className="bg-light800_dark400!">
            <TabsTrigger className="tab" value="qustions">
              qustions
            </TabsTrigger>
            <TabsTrigger className="tab" value="answers">
              answers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qustions">
            <DataRenderer
              data={questions}
              success={userQuestinsSuccess}
              error={questionsError}
              empty={{
                title: "No questions found",
                message:
                  "Your question board is empty. it's the time for your brilliant question to get things rolling",
                button: {
                  text: "ask question",
                  href: ROUTES.ASK_QUESTION,
                },
              }}
              render={(questions) => (
                <section className="mt-5 w-full flex flex-col gap-6">
                  {questions?.map((question) => {
                    return (
                      <QuestionCard key={question._id} question={question} />
                    );
                  })}
                </section>
              )}
            />

            <Pagination page={page} isNext={hasMoreQuestions || false} />
          </TabsContent>

          <TabsContent value="answers">
            <DataRenderer
              data={answers}
              success={userAnswersSuccess}
              error={answersError}
              empty={{
                title: "No answers found",
                message: "You hav'nt answer any questions before !",
              }}
              render={(answers) => (
                <section className="mt-5 w-full flex flex-col gap-6">
                  {answers?.map(
                    ({
                      _id,
                      content,
                      upvotes,
                      downvotes,
                      createdAt,
                      author,
                      question,
                    }) => {
                      return (
                        <AnswerCard
                          key={_id}
                          _id={_id}
                          content={content.slice(0, 77)}
                          upvotes={upvotes}
                          downvotes={downvotes}
                          createdAt={createdAt}
                          author={author}
                          question={question}
                          readMore
                        />
                      );
                    }
                  )}
                </section>
              )}
            />

            <Pagination page={page} isNext={hasMoreAnswers || false} />
          </TabsContent>
        </Tabs>

        <div className="md:w-1/3 mt-4 shrink">
          <h3 className="h3-semibold text-dark200_light800">Top Tech</h3>
          <DataRenderer
            data={tagsData}
            success={userTagsSuccess}
            error={tagsError}
            empty={{
              title: "No Tags found",
              message: "seems like you did not tag your questions before",
            }}
            render={(tagsData) => (
              <div className="space-y-3 py-4">
                {tagsData &&
                  tagsData?.map(({ _id, name, count }) => (
                    <div key={_id}>
                      <TagCard id={_id} name={name} questions={count} />
                    </div>
                  ))}
              </div>
            )}
          />
        </div>
      </section>
    </div>
  );
}
