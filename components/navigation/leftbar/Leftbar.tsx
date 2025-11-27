import LogoutBtn from "../buttons/LogoutBtn";
import SigninBtn from "../buttons/SigninBtn";
import SignupBtn from "../buttons/SignupBtn";
import NavLinks from "../navbar/NavLinks";

export default function Leftbar() {
  const isAuthentecated = false;
  return (
    <section className="hidden fixed left-0 top-0 pt-26 h-screen sm:flex flex-col justify-between bg-light900_dark200 shadow-light-400 shadow-sm dark:shadow-none custom-scrollbar overflow-y-auto light-border border-r sm:w-[110px] xl:w-[266px]">
      <div className="flex flex-col gap-6 flex-1 px-5">
        <NavLinks />
      </div>

      <div className="flex flex-col gap-3 p-4">
        {isAuthentecated ? (
          <LogoutBtn />
        ) : (
          <>
            <SigninBtn />
            <SignupBtn />
          </>
        )}
      </div>
    </section>
  );
}
