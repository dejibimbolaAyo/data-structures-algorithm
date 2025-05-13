import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import { Menu } from "./components/Menu";
import { ThemeToggle } from "./components/ThemeToggle";
import { ThemeProvider } from "./context/ThemeContext";

import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { Footer } from "./components/Footer";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-emerald-50 dark:bg-emerald-1000">
        <ThemeProvider>
          <div className="flex h-full">
            <Menu />
            <main className="flex-1 overflow-auto">
              <div className="animate-fadeIn mb-16">
                <Outlet />
              </div>
            </main>
          </div>
          <ThemeToggle />
          <ScrollRestoration />
          <Scripts />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-emerald-50 dark:bg-emerald-1000">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white dark:bg-emerald-900 rounded-lg shadow-xl p-8 max-w-lg w-full">
            <h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-50 mb-4">
              Oops! Something went wrong
            </h1>
            <div className="bg-emerald-50 dark:bg-emerald-800 rounded p-4 mb-4">
              <p className="text-emerald-800 dark:text-emerald-100 font-mono text-sm">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
            </div>
            <a
              href="/"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Go back home
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
