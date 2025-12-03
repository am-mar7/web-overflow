import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import CommentFilters from "@/components/filters/CommentFilters";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/searchbars/LocalSearch";
import { UserFilters } from "@/constants";
import ROUTES from "@/constants/routes";
import { getUsers } from "@/lib/server actions/user.action";
import { RouteParams } from "@/Types/global";


export default async function Community({ params }: RouteParams) {
  const { query, filter , page} = await params;
  const { success, data, error } = await getUsers({
    query,
    filter,
  });
  const { users , isNext } = data || {};
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

      <Pagination isNext={isNext || false} page={page}/>
    </div>
  );
}
