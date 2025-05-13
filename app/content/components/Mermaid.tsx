import { useEffect, useRef } from "react";

export function Mermaid({ chart }: Readonly<{ chart: string }>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    if (!ref.current) return;

    // Dynamically import Mermaid to ensure it only runs on client
    import("mermaid").then(({ default: mermaid }) => {
      // Initialize Mermaid (only once per chart render)
      mermaid.initialize({
        startOnLoad: false, // we're calling render manually
        theme: "forest",
        securityLevel: "loose",
      });

      // Render the chart to SVG
      mermaid
        // Generate a unique ID for this chart instance
        .init()
        .then(() => {
          const uniqueId = `mermaid-${Math.random().toString(36).substring(2)}`;
          return mermaid.render(uniqueId, chart);
        })
        .then(({ svg }) => {
          if (ref.current && isMounted) {
            ref.current.innerHTML = svg;

            const svgElement = ref.current.querySelector("svg");
            if (svgElement) {
              svgElement.style.width = "100%";
              svgElement.style.height = "auto";
            }
          }
        })
        .catch((error) => {
          console.error("Mermaid render error:", error);
        });
    });

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return <div ref={ref} className="my-4" />;
}
