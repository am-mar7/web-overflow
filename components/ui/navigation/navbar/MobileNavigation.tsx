import Image from "next/image";
import React from "react";

export default function MobileNavigation() {
  return (
    <button className="sm:hidden">
      <Image
        src="icons/hamburger.svg"
        alt="toggle icon"
        width={20}
        height={20}
        className="invert-colors"
      />
    </button>
  );
}
