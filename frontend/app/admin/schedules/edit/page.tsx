"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Background from "@/components/Background";
import InputField from "@/components/InputField";
import SubmitButton from "@/components/SubmitButton";
import DatePicker from "@/components/DatePicker";
import OpenPeriodsEditor from "@/components/OpenPeriodsEditor";
import { NormalSchedule } from "@/models/normalSchedule";

export default function EditSchedulePage() {
  const params = useSearchParams();
  const router = useRouter();
  const scheduleId = params.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [schedule, setSchedule] = useState<NormalSchedule | null>(null);

  // Mock load schedule
  async function loadScheduleMock(id: string): Promise<NormalSchedule> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          description: "Standard Week",
          start: "2024-01-01",
          sunday: [],
          monday: [{ open: "09:00", close: "17:00" }],
          tuesday: [{ open: "09:00", close: "17:00" }],
          wednesday: [{ open: "09:00", close: "17:00" }],
          thursday: [{ open: "09:00", close: "17:00" }],
          friday: [{ open: "09:00", close: "17:00" }],
          saturday: [{ open: "10:00", close: "14:00" }],
        });
      }, 600);
    });
  }

  async function loadSchedule() {
    if (!scheduleId) {
      setError("No schedule ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Mock data for testing
      const data = await loadScheduleMock(scheduleId);

      /* When backend is ready, use this instead:
      const res = await fetch(
        `http://localhost:3001/api/admin/schedules/${encodeURIComponent(scheduleId)}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        throw new Error(`Failed to load schedule (${res.status})`);
      }
      const data: NormalSchedule = await res.json();
      */

      setSchedule(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchedule();
  }, [scheduleId]);

  const handleSave = async () => {
    if (!schedule) return;

    try {
      setSaving(true);
      setError("");

      /* When backend is ready, use this:
      const res = await fetch(
        `http://localhost:3001/api/admin/schedules/${encodeURIComponent(scheduleId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schedule),
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to save schedule (${res.status})`);
      }
      */

      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 800));

      router.push("/admin/schedules");
    } catch (e: any) {
      setError(e?.message ?? "Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/schedules");
  };

  if (loading) {
    return (
      <Background>
        <Navigation />
        <main className="flex-1">
          <section className="mx-auto max-w-4xl px-6 py-10">
            <div className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm">
              <p className="text-gray-700">Loading schedule…</p>
            </div>
          </section>
        </main>
      </Background>
    );
  }

  if (error && !schedule) {
    return (
      <Background>
        <Navigation />
        <main className="flex-1">
          <section className="mx-auto max-w-4xl px-6 py-10">
            <div className="rounded-2xl border bg-red-50 p-6 shadow-sm">
              <p className="text-red-700">{error}</p>
            </div>
          </section>
        </main>
      </Background>
    );
  }

  if (!schedule) {
    return (
      <Background>
        <Navigation />
        <main className="flex-1">
          <section className="mx-auto max-w-4xl px-6 py-10">
            <div className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm">
              <p className="text-gray-700">Schedule not found.</p>
            </div>
          </section>
        </main>
      </Background>
    );
  }

  return (
    <Background>
      <Navigation />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-10">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-brand">
              Editing schedule {scheduleId}
            </h1>
            <p className="text-gray-600 mt-1">
              Update the description, start date, and open periods for this schedule.
            </p>
          </div>

          <div className="rounded-2xl border bg-white/70 backdrop-blur-sm p-8 shadow-sm">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              <InputField
                label="Description"
                type="text"
                className="w-full"
                value={schedule.description}
                onChange={(e) =>
                  setSchedule({ ...schedule, description: e.target.value })
                }
                placeholder="Enter schedule description"
              />

              <DatePicker
                label="Start Date"
                value={schedule.start}
                onChange={(date) => setSchedule({ ...schedule, start: date })}
              />

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Open Periods by Day
                </h3>

                <OpenPeriodsEditor
                  label="Sunday"
                  periods={schedule.sunday}
                  onChange={(periods) =>
                    setSchedule({ ...schedule, sunday: periods })
                  }
                />

                <OpenPeriodsEditor
                  label="Monday"
                  periods={schedule.monday}
                  onChange={(periods) =>
                    setSchedule({ ...schedule, monday: periods })
                  }
                />

                <OpenPeriodsEditor
                  label="Tuesday"
                  periods={schedule.tuesday}
                  onChange={(periods) =>
                    setSchedule({ ...schedule, tuesday: periods })
                  }
                />

                <OpenPeriodsEditor
                  label="Wednesday"
                  periods={schedule.wednesday}
                  onChange={(periods) =>
                    setSchedule({ ...schedule, wednesday: periods })
                  }
                />

                <OpenPeriodsEditor
                  label="Thursday"
                  periods={schedule.thursday}
                  onChange={(periods) =>
                    setSchedule({ ...schedule, thursday: periods })
                  }
                />

                <OpenPeriodsEditor
                  label="Friday"
                  periods={schedule.friday}
                  onChange={(periods) =>
                    setSchedule({ ...schedule, friday: periods })
                  }
                />

                <OpenPeriodsEditor
                  label="Saturday"
                  periods={schedule.saturday}
                  onChange={(periods) =>
                    setSchedule({ ...schedule, saturday: periods })
                  }
                />
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t">
                <SubmitButton onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </SubmitButton>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </Background>
  );
}