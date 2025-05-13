import { useEffect, useState } from "react";

import { HighlightedCode, RawCode, highlight } from "codehike/code";

import { Code } from "@/content/components/Code";
import { CodeSkeleton } from "@/content/components/CodeSkeleton";

export function CodeSwitcher(props: Readonly<{ code: RawCode[] }>) {
  const [highlighted, setHighlighted] = useState<HighlightedCode[]>([]);

  useEffect(() => {
    Promise.all(
      props.code.map((codeblock) => highlight(codeblock, "github-dark"))
    ).then(setHighlighted);
  }, [props.code]);

  if (!highlighted.length) {
    return <CodeSkeleton />;
  }

  return <Code highlighted={highlighted} />;
}
