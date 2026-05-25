interface NameEntry {
  name: string;
  meaning: string;
  score: number;
  analysis?: string;
  tagline?: string;
}

interface NameResultsProps {
  names: NameEntry[];
  isPaid: boolean;
}

export function NameResults({ names, isPaid }: NameResultsProps) {
  if (names.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {names.map((entry, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{entry.name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              {entry.score}分
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{entry.meaning}</p>
          {entry.tagline && (
            <p className="mt-2 text-sm text-gray-500 italic">"{entry.tagline}"</p>
          )}
          {isPaid && entry.analysis && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 leading-relaxed">{entry.analysis}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
