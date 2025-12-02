"use client";

import { useState } from "react";

interface CopyCardProps {
  text: string;
  className?: string;
  showText?: boolean;
}

export default function CopyCard({ text, className = "", showText = true }: CopyCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group w-full px-6">
      <button
        onClick={copyToClipboard}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-light-700 dark:bg-dark-400 hover:bg-light-800 dark:hover:bg-dark-300 transition-colors text-dark500_light700 text-sm w-full ${className}`}
      >
        {showText && (
          <span className="text-sm truncate flex-1 text-left">{text}</span>
        )}
        
        {/* Copy icon */}
        {!copied ? (
          <svg
            className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-green-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* Tooltip */}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-dark-300 dark:bg-light-900 text-light-900 dark:text-dark-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {copied ? 'Copied!' : 'Click to copy'}
      </span>
    </div>
  );
}