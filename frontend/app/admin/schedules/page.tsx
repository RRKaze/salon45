"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Background from "@/components/Background";
import { NormalSchedule, OpenPeriod, TestSchedules } from "../../../models/normalSchedule";
import { formatDate, toDisplayTime } from "@/utils/scheduleUtils";
import {scheduleService} from "@/utils/api";

const PAGE_SIZE = 10;

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<NormalSchedule[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastId, setLastId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Mock pagination - simulates backend behavior
  async function loadSchedulesMock(pageSize: number, afterId?: string | null) {
    return new Promise<NormalSchedule[]>((resolve) => {
      setTimeout(() => {
        const startIndex = afterId 
          ? TestSchedules.findIndex(s => s.id === afterId) + 1 
          : 0;
        const page = TestSchedules.slice(startIndex, startIndex + pageSize);
        resolve(page);
      }, 600);
    });
  }

  async function loadSchedules(pageSize: number = PAGE_SIZE, afterId?: string | null) {
    const isInitialLoad = afterId === null || afterId === undefined;
    
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      // Mock data for testing - replace with real API call when backend is ready
      const data = await loadSchedulesMock(pageSize, afterId);


      /* When backend is ready, use this instead:
      const res = scheduleService.getSchedules(pageSize, afterId);
      if (!res.ok) {
        throw new Error(`Failed to load schedules (${res.status})`);
      }
      const data: NormalSchedule[] = await res.json();
      */

      if (isInitialLoad) {
        setSchedules(data);
      } else {
        setSchedules((prev) => [...prev, ...data]);
      }

      // Update pagination state
      if (data.length > 0) {
        setLastId(data[data.length - 1].id);
      }
      setHasMore(data.length >= pageSize);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load schedules");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  function handleLoadMore() {
    if (!loadingMore && hasMore) {
      loadSchedules(PAGE_SIZE, lastId);
    }
  }
  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function renderDay(name: string, periods: OpenPeriod[]) {
    return (
      <div key={name} className="flex items-start justify-between py-2">
        <div className="w-32 shrink-0 text-gray-700 font-medium">{name}</div>
        <div className="flex-1 text-gray-900">
          {periods.length === 0 ? (
            <span className="text-gray-500">Closed</span>
          ) : (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {periods.map((p, idx) => (
                <li key={idx} className="text-sm rounded-full bg-gray-100 px-3 py-1">
                  {toDisplayTime(p.open)} — {toDisplayTime(p.close)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm">
          <p className="text-gray-700">Loading schedules…</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="rounded-2xl border bg-red-50 p-6 shadow-sm">
          <p className="text-red-700">{error}</p>
        </div>
      );
    }
    if (!schedules.length) {
      return (
        <div className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm">
          <p className="text-gray-700">No schedules found.</p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border bg-white/70 backdrop-blur-sm divide-y shadow-sm">
        {schedules.map((s) => {
          const isOpen = !!expanded[s.id];
          return (
            <div key={s.id} className="group">
              <div
                className="grid grid-cols-12 items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleExpand(s.id)}
              >
                <div className="col-span-3">
                  <div className="text-xs uppercase text-gray-500">ID</div>
                  <div className="font-mono text-gray-900 truncate">{s.id}</div>
                </div>
                <div className="col-span-4">
                  <div className="text-xs uppercase text-gray-500">Description</div>
                  <div className="text-gray-900">{s.description}</div>
                </div>
                <div className="col-span-3">
                  <div className="text-xs uppercase text-gray-500">Start date</div>
                  <div className="text-gray-900">{formatDate(s.start)}</div>
                </div>
                <div className="col-span-2 flex justify-end">
                  <Link
                    href={`/admin/schedules/edit?id=${s.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand text-white text-sm hover:bg-brand-dark transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>

              {isOpen && (
                <div className="px-6 pb-5">
                  <div className="rounded-xl border bg-white p-4">
                    {renderDay("Sunday", s.sunday)}
                    <div className="border-t my-2" />
                    {renderDay("Monday", s.monday)}
                    <div className="border-t my-2" />
                    {renderDay("Tuesday", s.tuesday)}
                    <div className="border-t my-2" />
                    {renderDay("Wednesday", s.wednesday)}
                    <div className="border-t my-2" />
                    {renderDay("Thursday", s.thursday)}
                    <div className="border-t my-2" />
                    {renderDay("Friday", s.friday)}
                    <div className="border-t my-2" />
                    {renderDay("Saturday", s.saturday)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [loading, error, schedules, expanded]);

  return (
    <Background>
      <Navigation />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-brand">Schedules</h1>
            <p className="text-gray-600 mt-1">Manage store schedules. Click a row to view open periods by day.</p>
          </div>

          {content}

          {/* Load More Button */}
          {hasMore && !loading && !error && schedules.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`px-6 py-3 rounded-full text-sm font-medium transition ${
                  !loadingMore
                    ? "bg-brand text-white hover:bg-brand-dark cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loadingMore
                  ? "Loading..."
                  : "Load more..."}
              </button>
            </div>
          )}
        </section>
      </main>
    </Background>
  );
}