import { useEffect, useState } from "react";
import {
  InlineAnnotation,
  AnnotationHandler,
  BlockAnnotation,
  InnerLine,
  Pre,
  RawCode,
  highlight,
  HighlightedCode,
  InnerToken,
} from "codehike/code";
import { CopyButton } from "@/components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CodeSkeleton } from "@/content/components/CodeSkeleton";
import { SmoothPre } from "@/content/components/SmoothPre";

const tokenTransitions: AnnotationHandler = {
  name: "token-transitions",
  PreWithRef: SmoothPre,
  Token: (props) => (
    <InnerToken merge={props} style={{ display: "inline-block" }} />
  ),
};

const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 1;
    return (
      <div className="flex">
        <span
          className="text-right opacity-50 select-none"
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className="flex-1 pl-2" />
      </div>
    );
  },
};

const mark: AnnotationHandler = {
  name: "mark",
  Line: ({ annotation, ...props }) => {
    const color = annotation?.query || "rgb(14 165 233)";
    return (
      <div
        className="flex"
        style={{
          borderLeft: "solid 2px transparent",
          borderLeftColor: annotation ? color : "transparent",
          backgroundColor: annotation
            ? `rgb(from ${color} r g b / 0.1)`
            : "transparent",
        }}
      >
        <InnerLine merge={props} className="..." />
      </div>
    );
  },
  Inline: ({ annotation, children }) => {
    const color = annotation?.query || "rgb(14 165 233)";
    return (
      <span
        className="rounded px-0.5 py-0 -mx-0.5"
        style={{
          outline: `solid 1px rgb(from ${color} r g b / 0.5)`,
          background: `rgb(from ${color} r g b / 0.13)`,
        }}
      >
        {children}
      </span>
    );
  },
};

const diff: AnnotationHandler = {
  name: "diff",
  onlyIfAnnotated: true,
  transform: (annotation: BlockAnnotation) => {
    const color = annotation.query == "-" ? "#f85149" : "#3fb950";
    return [annotation, { ...annotation, name: "mark", query: color }];
  },
  Line: ({ annotation, ...props }) => (
    <>
      <div className="min-w-[1ch] box-content opacity-70 pl-2 select-none">
        {annotation?.query}
      </div>
      <InnerLine merge={props} />
    </>
  ),
};

const callout: AnnotationHandler = {
  name: "callout",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation;
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 },
    };
  },
  Block: ({
    annotation,
    children,
  }: {
    annotation: BlockAnnotation;
    children: React.ReactNode;
  }) => {
    const column = annotation.data?.column ?? 0;
    return (
      <>
        {children}
        <div
          style={{ minWidth: `${column + 4}ch` }}
          className="w-fit border bg-zinc-800 border-current rounded px-2 relative -ml-[1ch] mt-1 whitespace-break-spaces"
        >
          <div
            style={{ left: `${column}ch` }}
            className="absolute border-l border-t border-current w-2 h-2 rotate-45 -translate-y-1/2 -top-[1px] bg-zinc-800"
          />
          {annotation.query}
        </div>
      </>
    );
  },
};

export function Code({
  codeblock,
  highlighted,
}: Readonly<{ codeblock?: RawCode; highlighted?: HighlightedCode[] }>) {
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [highlightedCode, setHighlightedCode] =
    useState<HighlightedCode | null>(null);

  useEffect(() => {
    if (codeblock) {
      highlight(codeblock, "github-dark").then(setHighlightedCode);
    }
  }, [codeblock]);

  if (codeblock && !highlightedCode) {
    return <CodeSkeleton />;
  }

  const codes = highlighted || (highlightedCode ? [highlightedCode] : []);
  if (!codes.length) return null;

  if (!selectedLang) {
    setSelectedLang(codes[0].lang);
    return <CodeSkeleton />;
  }

  const selectedCode = codes.find((code) => code.lang === selectedLang)!;
  const hasMultipleLanguages = codes.length > 1;

  return (
    <div className="group relative flex flex-col bg-zinc-900 rounded-lg overflow-hidden border border-emerald-200/20 my-4 pt-2">
      <div className="absolute left-2 text-sm mx-4 text-slate-400 font-mono">
        {selectedCode.lang}
      </div>
      <CopyButton text={selectedCode.code} />
      <div className="my-4">
        <Pre
          code={selectedCode}
          handlers={[lineNumbers, callout, mark, diff, tokenTransitions]}
          className="m-0"
        />
        {hasMultipleLanguages && (
          <div className="absolute bottom-2 right-2">
            <Select value={selectedLang} onValueChange={setSelectedLang}>
              <SelectTrigger className="!bg-transparent border-none h-6 !p-2 gap-2 text-slate-300 !ring-zinc-300/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {codes.map(({ lang }, index) => (
                  <SelectItem key={index} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
