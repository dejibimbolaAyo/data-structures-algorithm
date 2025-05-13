export function Footer() {
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
      </footer>
    </div>
  );
}
