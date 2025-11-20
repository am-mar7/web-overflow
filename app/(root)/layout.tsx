import React from "react";
import Navbar from "@/components/ui/navigation/navbar";
import Leftbar from "@/components/ui/navigation/leftbar/Leftbar";
import Rightbar from "@/components/ui/navigation/rightbar/Rightbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-light850_dark100 relative">
      <Navbar />
      <div className="flex pt-20 ">
        <div className="sm:w-[110px] xl:w-[266px]">
          <Leftbar />
        </div>
        <section className="flex flex-1 p-4 min-h-screen">
          <div className="mx-auto max-w-7xl">{children}</div>
        </section>
        <div className="lg:w-[260px] xl:w-[340px]">
          <Rightbar />
        </div>
      </div>
    </main>
  );
}
