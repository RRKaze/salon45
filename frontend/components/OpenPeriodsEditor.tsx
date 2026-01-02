import { toDisplayTime } from "@/utils/scheduleUtils";

export type OpenPeriod = {
  open: string;
  close: string;
};

interface OpenPeriodsEditorProps {
  label: string;
  periods: OpenPeriod[];
  onChange: (periods: OpenPeriod[]) => void;
}

export default function OpenPeriodsEditor({
  label,
  periods,
  onChange,
}: OpenPeriodsEditorProps) {
  const handleDelete = (index: number) => {
    const updated = periods.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAdd = () => {
    // TODO: Open modal to add new period
    console.log("Add period clicked for", label);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="border border-slate-500 shadow-lg rounded-md mb-4 text-sm text-black flex cursor-pointer p-2 min-h-[60px]">
        <div className="flex flex-wrap gap-2">
          {periods.map((period, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 bg-gray-100 rounded-full pl-4 pr-2 py-2"
            >
              <span className="text-sm text-gray-900">
                {toDisplayTime(period.open)} — {toDisplayTime(period.close)}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="rounded-full p-1 hover:bg-gray-200 transition"
                aria-label="Delete period"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className=" inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand text-white text-sm hover:bg-brand-dark transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}