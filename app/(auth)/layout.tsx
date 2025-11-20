import SocialAuthForm from "@/components/forms/SocialAuthForm";
import Image from "next/image";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-dvh dark:bg-auth-dark bg-auth-light bg-center bg-cover bg-no-repeat flex-center p-5">
        <section className="border light-border bg-light800_dark200 px-6 py-8 rounded-2xl shadow-lg shadow-light100_dark100 w-full sm:max-w-[520px]">
          <div className="flex-center">
            <div className="w-full">
              <h2 className="h2-bold">Join Dev Overflow</h2>
              <h4 className="text-light-400 body-regular">
                to get your questions answered
              </h4>
            </div>
            <Image
              src="images/site-logo.svg"
              alt="Dev Overflow Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          {children}
          <SocialAuthForm />
        </section>
      </main>
    </>
  );
}
