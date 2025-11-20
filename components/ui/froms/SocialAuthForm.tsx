"use client";
import { toast } from "sonner";
import { Button } from "../button";
import Image from "next/image";
import ROUTES from "@/constants/routes";
import { signIn } from "next-auth/react";

export default function SocialAuthForm() {
  const buttonClass =
    "bg-light900_dark400 text-dark200_light800 px-8 py-5 flex-1 min-h-12";
  const handleSocialAuth = async (provider: "github" | "google") => {
    console.log(provider);    
    try {
      // implement social auth logic here
      await signIn('provider', {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });
      // throw new Error("Not implemented");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Social auth with ${provider} is not implemented yet.`
      );
    }
  };
  return (
    <div className="flex-center flex-wrap mt-8 gap-4 ">
      <Button
        className={buttonClass}
        onClick={() => {handleSocialAuth("github")}}
      >
        continue with GitHub
        <Image
          src="icons/github.svg"
          width={30}
          height={30}
          alt="github logo"
          className="invert-colors object-contain ml-2.5"
        />
      </Button>
      <Button
        className={buttonClass}
        onClick={() => {handleSocialAuth("google")}}
      >
        continue with Google
        <Image
          src="icons/google.svg"
          width={30}
          height={30}
          alt="Google logo"
          className="ml-2.5 object-contain"
        />
      </Button>
    </div>
  );
}
