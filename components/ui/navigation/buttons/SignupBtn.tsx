import { Button } from "../../button";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";

export default function SignupBtn() {
  return (
    <Button
      className="py-3 text-dark200_light800 btn-secondary h3-semibold"
      asChild
    >
      <Link href={ROUTES.SIGN_UP}>
        <Image
          src="icons/sign-up.svg"
          alt="login logo"
          width={20}
          height={20}
          className="xl:hidden invert-colors"
        />
        <span className="max-xl:hidden">Sign up</span>
      </Link>
    </Button>
  );
}
