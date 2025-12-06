import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import CommentFilters from "@/components/filters/CommentFilters";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { UserFilters } from "@/constants";
import ROUTES from "@/constants/routes";
import { getUsers } from "@/lib/server actions/user.action";
import { RouteParams } from "@/Types/global";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DOF | Community",
  description: "Explore our community of developers and programmers. Connect with experts, find mentors, and collaborate with fellow developers from around the world.",
  
  keywords: [
    "developer community",
    "programmers",
    "coding community",
    "find developers",
    "tech community",
    "software engineers",
    "developer network",
    "programming experts",
    "code mentors",
    "tech professionals"
  ],

  // Open Graph for social media sharing
  openGraph: {
    title: "Community | Discover Developers",
    description: "Explore our community of developers and programmers. Connect with experts and collaborate with fellow developers.",
    type: "website",
    // url: "https://yourdomain.com/community", // Add your domain
    // images: [
    //   {
    //     url: "https://yourdomain.com/og-community.png", // Add your OG image
    //     width: 1200,
    //     height: 630,
    //     alt: "Community - Your App Name",
    //   },
    // ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Community | Discover Developers",
    description: "Explore our community of developers and programmers. Connect with experts worldwide.",
    // images: ["https://yourdomain.com/og-community.png"],
    // creator: "@yourtwitterhandle",
  },

  // Additional metadata
  robots: {
    index: true, // Community pages should be indexed
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};


export default async function Community({ searchParams }: RouteParams) {
  const { query, filter, page } = await searchParams;
  const { success, data, error } = await getUsers({
    query,
    filter,
    page: Number(page) || 1,
  });
  const { users, isNext } = data || {};
  return (
    <div className="min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <h1 className="h1-bold text-dark200_light800">All users</h1>

      <section className="mt-6 flex-center flex-col sm:flex-row gap-2.5">
        <div className="w-full">
          <LocalSearch
            route={ROUTES.COMMUNITY}
            placeholder="search for your fav dev..."
          />
        </div>
        <CommentFilters
          filters={UserFilters}
          otherClasses="w-full sm:w-fit h-full"
        />
      </section>

      <div className="py-4 grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2">
        <DataRenderer
          success={success}
          data={users}
          error={error}
          empty={{
            title: "No users found",
            message: "",
          }}
          render={(users) =>
            users?.map((user) => <UserCard key={user._id} {...user} />)
          }
        />
      </div>

      <Pagination isNext={isNext || false} page={page} />
    </div>
  );
}
