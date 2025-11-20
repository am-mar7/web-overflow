'use clint'
import Image from "next/image";
import React from "react";
import { Input } from "../ui/input";

export default function LocalSearch() {
  // function handleSearch() {
  //   console.log("aloo");
  // }
  return (
    <div className="flex gap-4 p-4 bg-light800_darkgradient shadow-xs shadow-light-400 dark:shadow-none">
      <Image src="icons/search.svg" alt="search icon" width={25} height={25} />
      <Input
        // onSubmit={() =>{handleSearch}}
        type="search"
        className="border-none ring-0! hover:ring-0! bg-transparent!"
      />
    </div>
  );
}
