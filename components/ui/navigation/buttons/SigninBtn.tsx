import React from "react";
import { Button } from "../../button";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import Image from "next/image";

export default function SigninBtn() {
  return (
    <Button
      className="py-3 bg-primary-gradient text-light-800 h3-semibold"
      asChild
    >
      <Link href={ROUTES.SIGN_IN}>
        <span className="max-xl:hidden">Login</span>
        <Image
          src="icons/account.svg"
          alt="login logo"
          width={20}
          height={20}
          className="xl:hidden"
        />
      </Link>
    </Button>
  );
}
