import { signOut } from "@/auth";
import { Button } from "../../ui/button";
import { LogOut } from "lucide-react";

export default function LogoutBtn({isMobile = false}: {isMobile?: boolean}) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button className="py-3 w-full text-dark200_light800 btn-secondary h3-semibold hover:bg-red-600! transition-colors hover:text-light-900! group delay-75">
        <LogOut />
        <span className={isMobile ? "" : "max-xl:hidden"}>Logout</span>
      </Button> 
    </form>
  );
}
