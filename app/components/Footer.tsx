import { useEffect, useState } from "react";

declare global {
  interface Window {
    BUILD_TIME?: string;
  }
}

export function Footer() {
  const [buildTime, setBuildTime] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined" && window.BUILD_TIME) {
      setBuildTime(window.BUILD_TIME);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-sm bg-white/30 dark:bg-black/30">
      <footer className="w-full flex flex-col items-center gap-2 py-4 text-sm text-slate-500 border-t border-emerald-200/20 bg-emerald-50 dark:bg-emerald-1000">
        <div className="flex items-center gap-3">
          <img
            src="/dejibimbola.png" // Place your image in public/author.jpg
            alt="Author"
            width={32}
            height={32}
            className="rounded-full border border-emerald-400"
          />
          <span>
            © {new Date().getFullYear()} Deji Abimbola. All rights reserved.
          </span>
        </div>
        <div className="text-xs text-slate-400">
          Build time:{" "}
          {buildTime ? new Date(buildTime).toUTCString() : "unknown"}
        </div>
      </footer>
    </div>
  );
}
