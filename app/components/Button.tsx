"use client";

import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function CopyButton({ text }: Readonly<{ text: string }>) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="hover:bg-gray-400/20 p-1 rounded absolute right-1 text-zinc-200"
      aria-label="Copy to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? (
        <CheckIcon className="w-4 h-4" />
      ) : (
        <ClipboardDocumentIcon className="w-4 h-4" />
      )}
    </button>
  );
}
