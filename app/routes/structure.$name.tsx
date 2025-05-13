import React from "react";

import path from "path";

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";
import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkMermaid from "remark-mermaid";

import { Code } from "@/content/components/Code";
import { CodeSwitcher } from "@/content/components/CodeSwitcher";
import { InteractiveRunningTimeGraph } from "@/content/components/InteractiveRunningTimeGraph";
import { Mermaid } from "@/content/components/Mermaid";
import { RunningTimeTable } from "@/content/components/RunningTime";
import { RunningTimeGraph } from "@/content/components/RunningTimeGraph";
import { ArrayVisualizer } from "@/content/components/visualizers/ArrayVisualizer";
const chConfig = {
  components: { code: "Code" },
  syntaxHighlighting: {
    theme: "github-dark",
  },
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { name } = params;

  if (!name) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const mdxFile = path.join(process.cwd(), "app", "content", `${name}.mdx`);
    const { code, frontmatter } = await bundleMDX({
      file: mdxFile,
      cwd: process.cwd(),
      // Also allow import and calling functions
      mdxOptions(options) {
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          remarkGfm,
          remarkMdx,
          remarkMermaid,
          [remarkCodeHike, chConfig],
        ];
        options.recmaPlugins = [
          ...(options.recmaPlugins ?? []),
          [recmaCodeHike, chConfig],
        ];
        return options;
      },
    });

    return json({ code, frontmatter });
  } catch (error) {
    console.error("Error loading content:", error);
    throw new Response("Not Found", { status: 404 });
  }
}

const components = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className="text-2xl font-bold">
      {children}
    </h1>
  ),
  Code: Code,
  CodeSwitcher: CodeSwitcher,
  RunningTimeTable: RunningTimeTable,
  RunningTimeGraph: RunningTimeGraph,
  InteractiveRunningTimeGraph: InteractiveRunningTimeGraph,
  Mermaid: Mermaid,
  ArrayVisualizer: ArrayVisualizer,
};

export default function Structure() {
  const { code } = useLoaderData<typeof loader>();
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <div className="flex min-h-screen bg-emerald-50 dark:bg-emerald-1000">
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto prose prose-xs sm:prose-sm dark:prose-invert prose-emerald prose-headings:font-medium prose-p:leading-snug prose-pre:bg-black prose-pre:text-emerald-100 prose-pre:border prose-pre:border-emerald-200/20 prose-table:border prose-table:border-emerald-200/20 prose-th:bg-emerald-100/50 dark:prose-th:bg-emerald-900/50 prose-th:border prose-th:border-emerald-200/20 prose-td:border prose-td:border-emerald-200/20 py-4 pt-16 px-2">
          <Component components={components} />
        </div>
      </main>
    </div>
  );
}
