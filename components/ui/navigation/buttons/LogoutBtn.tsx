import React from "react";
import { Button } from "../../button";
import Image from "next/image";

export default function LogoutBtn() {
  return (
    <Button className="py-3 text-dark200_light800 btn-secondary h3-semibold hover:bg-red-600! transition-colors hover:text-light-900! group delay-75">
      <span className="max-xl:hidden">Logout</span>
      <Image
        src="icons/arrow-right.svg"
        alt="login logo"
        width={18}
        height={18}
        className="invert-colors group/hover:invert-0!"
      />
    </Button>
  );
}
