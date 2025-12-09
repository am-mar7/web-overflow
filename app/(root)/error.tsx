"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  // Check if it's a network error
  const isNetworkError =
    error.message.includes("fetch") ||
    error.message.includes("network") ||
    error.message.includes("Failed to fetch") ||
    !navigator.onLine;

  const handleForceRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold">
          {isNetworkError
            ? "📡 No Internet Connection"
            : "⚠️ Something went wrong"}
        </h2>
        <p className="text-muted-foreground">
          {isNetworkError
            ? "Please check your internet connection and try again."
            : "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleForceRefresh}
            variant="default"
            className="cursor-pointer"
          >
            Try again
          </Button>
        </div>
        {/* {error.message && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Error details
            </summary>
            <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto max-h-40">
              {error.message}
            </pre>
          </details>
        )} */}
      </div>
    </div>
  );
}
