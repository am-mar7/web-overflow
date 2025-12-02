import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

interface Props<T> {
  success: boolean;
  data?: T[] | undefined | null;
  error?: {
    message: string;
    details?: Record<string, string[]>;
    
  };
  render: (data:T[] | undefined | null) => React.ReactNode;
  empty: {
    title: string;
    message:string;
    button?: {
      text: string;
      href: string;
    };
  };
}
interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

function StateSkeleton({ image, title, message, button }: StateSkeletonProps) {
  return (
    <div className="mt-16 w-full flex-center flex-col">
      <Image
        src={image.light}
        alt={image.alt}
        width={250}
        height={250}
        className="block dark:hidden object-contain"
      />
      <Image
        src={image.dark}
        alt={image.light}
        width={350}
        height={350}
        className="hidden dark:block object-contain"
      />
      <h2 className="h2-semibold text-dark200_light900 mt-12">{title}</h2>
      <p className="body-regular text-dark500_light700 my-4 max-w-md text-center">
        {message}
      </p>

      {button && (
        <Button asChild className="bg-primary-500 text-light-700 hover:bg-primary-gradient">
          <Link href={button?.href}>{button.text}</Link>
        </Button>
      )}
    </div>
  );
}

export default function DataRenderer<T>({
  success,
  data,
  error,
  render,
  empty,
}: Props<T>) {
  if (!success) {
    return (
      <StateSkeleton
        image={{
          dark: "/images/dark-error.png",
          light: "/images/light-error.png",
          alt: "error",
        }}
        title={error?.message || "Error"}
        message={JSON.stringify(error?.details) || "Something went wrong"}
      />
    );
  }

  if (!data || data.length === 0) {
    return <StateSkeleton
    image={{
      dark: "/images/dark-illustration.png",
      light: "/images/light-illustration.png",
      alt: "illustration",
    }}
    title={empty.title || "Ops..."}
    message={empty.message}
    button={empty.button}
  />
  }

  return <>{render(data)}</>;
}
