import React from "react";
import { formatDate } from "@/utils/scheduleUtils";

interface DatePickerProps {
  label: string;
  value: string | Date;
  onChange: (date: string) => void;
}

export default function DatePicker({ label, value, onChange }: DatePickerProps) {
  const handleCalendarClick = () => {
    // TODO: Open calendar modal
    console.log("Calendar button clicked");
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900">
          {formatDate(value)}
        </div>
        <button
          type="button"
          onClick={handleCalendarClick}
          className="px-4 py-3 rounded-lg bg-brand text-white hover:bg-brand-dark transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Choose Date
        </button>
      </div>
    </div>
  );
}