type RunningTimes = {
  access?: string;
  search?: string;
  insert?: string;
  delete?: string;
  [key: string]: string | undefined;
};

export function RunningTimeTable({ times }: { times: RunningTimes }) {
  return (
    <table className="my-4 border-collapse w-full text-sm">
      <thead>
        <tr>
          <th className="border-b p-2 text-left">Operation</th>
          <th className="border-b p-2 text-left">Time Complexity</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(times).map(([op, time]) => (
          <tr key={op}>
            <td className="p-2">{op.charAt(0).toUpperCase() + op.slice(1)}</td>
            <td className="p-2 font-mono">{time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
