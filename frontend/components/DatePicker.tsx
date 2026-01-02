import { useState } from "react";
import { formatDate } from "@/utils/scheduleUtils";
import Calendar from "react-calendar";
import { DateTime } from "luxon";
import { Value } from "react-calendar/dist/shared/types.js";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
}

export default function DatePicker({ label, value, onChange }: DatePickerProps) {
  const [calendarIsOpen, setOpenCalendar] = useState(false);

  const handleCalendarClick = () => {
    setOpenCalendar(!calendarIsOpen);
  };

  // The value passed should be a date only in ISO format (e.g. 2024-12-31)
  const valueToDisplay = /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : DateTime.now().toISODate();

  const handleValueChange = (v: Value) => {
    const date = DateTime.fromJSDate(v as Date);
    const result = date.toISODate()?.toString();
    if (result) {
      onChange(result);
      setOpenCalendar(false);
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="border border-slate-500 shadow-lg rounded-md mb-4 text-sm text-black flex cursor-pointer hover:opacity-85" onClick={handleCalendarClick}>
        <div className="px-4 py-3 rounded-md bg-brand text-white flex items-center gap-2">
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
        </div>
        <span className="block p-3">
          {formatDate(value)}
        </span>
      </div>
      {calendarIsOpen && <Calendar className="absolute" value={valueToDisplay + "T00:00:00"} onChange={handleValueChange}></Calendar>}
    </div>
  );
}