import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Data Structures & Algorithms" },
    {
      name: "description",
      content: "Learn about various data structures and algorithms",
    },
  ];
};

export default function Index() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-emerald-50 dark:bg-emerald-1000 rounded-lg shadow-lg p-8 border border-emerald-200 dark:border-emerald-800">
        <h1 className="text-4xl font-bold mb-6 text-emerald-900 dark:text-emerald-50">
          Data Structures & Algorithms
        </h1>
        <p className="text-lg text-emerald-800 dark:text-emerald-100 mb-6">
          Select a data structure from the menu to learn more about it. Explore
          various implementations, time complexities, and real-world
          applications.
        </p>
        <div className="bg-emerald-100 dark:bg-emerald-950 rounded-md p-4 border border-emerald-200 dark:border-emerald-800">
          <h2 className="text-xl font-semibold mb-3 text-emerald-900 dark:text-emerald-50">
            Getting Started
          </h2>
          <p className="text-emerald-800 dark:text-emerald-100">
            Use the navigation menu on the left to explore different data
            structures and algorithms. Each section includes detailed
            explanations, code examples, and interactive visualizations.
          </p>
        </div>
      </div>
    </div>
  );
}
