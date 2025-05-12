import { useParams } from "@remix-run/react";

export default function Structure() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name || "");

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-emerald-900 dark:text-emerald-100">
        {decodedName}
      </h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-emerald-800 dark:text-emerald-200">
          Content for {decodedName} will be added here. This is a placeholder
          for the detailed information about this data structure.
        </p>
      </div>
    </div>
  );
}
