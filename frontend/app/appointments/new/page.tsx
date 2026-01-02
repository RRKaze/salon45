"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";
import Background from "../../../components/Background";
import SubmitButton from "../../../components/SubmitButton";
import { formatDate, toDisplayTime } from "@/utils/scheduleUtils";
import { DateTime } from "luxon";
import NormalButton from "@/components/NormalButton";
import { DayAvailability, TimeRange, AppointmentServiceProvider, Appointment } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

interface SelectedSlot {
  date: string;
  timeRange: TimeRange;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [availableDays, setAvailableDays] = useState<DayAvailability[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);

  // Load initial days and existing appointments on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const initialize = async () => {
      await loadExistingAppointments();
      await loadDays(0);
    };
    initialize();
  }, [isAuthenticated, router]);

  /**
   * Load existing appointments to filter out taken slots
   */
  const loadExistingAppointments = async () => {
    try {
      // Load a large number of appointments to check all available slots
      const appointments = await AppointmentServiceProvider.get().getAppointments(1000);
      setExistingAppointments(appointments);
    } catch (error) {
      console.error("Failed to load existing appointments:", error);
    }
  };

  /**
   * Check if a time slot is already taken
   * All comparisons are done in EST timezone
   */
  const isSlotTaken = (date: string, timeRange: TimeRange): boolean => {
    return existingAppointments.some(apt => {
      // Parse appointment datetime in EST timezone
      const aptDate = DateTime.fromISO(apt.appointmentDateTime, { zone: "America/New_York" });
      // Parse slot date in EST timezone
      const slotDate = DateTime.fromISO(date, { zone: "America/New_York" });
      
      // Check if same date (in EST)
      if (aptDate.toISODate() !== slotDate.toISODate()) {
        return false;
      }

      // Check if time overlaps (times are already in EST format HH:mm)
      const aptStart = aptDate.toFormat("HH:mm");
      const slotStart = timeRange.start;
      const slotEnd = timeRange.end;

      // Check if appointment time overlaps with slot time
      return aptStart >= slotStart && aptStart < slotEnd;
    });
  };

  /**
   * Load available days from the backend and filter out taken slots
   * @param offset Offset for pagination
   */
  const loadDays = async (offset: number) => {
    setLoading(true);
    try {
      const response = await AppointmentServiceProvider.get().getAvailability(offset, 5);
      
      // Filter out taken slots using current existing appointments
      const filteredDays = response.availableDays.map(day => ({
        ...day,
        timeRanges: day.timeRanges.filter(timeRange => !isSlotTaken(day.date, timeRange))
      }));

      if (offset === 0) {
        // Initial load: replace all days
        setAvailableDays(filteredDays);
      } else {
        // Pagination: append new days
        setAvailableDays(prev => [...prev, ...filteredDays]);
      }
      setCanLoadMore(response.more);
    } catch (error) {
      console.error("Failed to load available days:", error);
      // TODO: Show error notification to user
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextOffset = offset + 1;
    setOffset(nextOffset);
    loadDays(nextOffset);
  };

  const handleTimeSelect = (date: string, timeRange: TimeRange) => {
    setSelectedSlot({ date, timeRange });
  };

  const isSlotSelected = (date: string, timeRange: TimeRange): boolean => {
    return selectedSlot?.date === date &&
           selectedSlot?.timeRange.start === timeRange.start &&
           selectedSlot?.timeRange.end === timeRange.end;
  };

  /**
   * Book the selected appointment
   * Sends appointment date, time, user id, and status as "pending"
   */
  const handleBookAppointment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!selectedSlot || !user) {
      return;
    }

    setBookingInProgress(true);
    
    try {
      await AppointmentServiceProvider.get().bookAppointment(
        selectedSlot.date,
        selectedSlot.timeRange.start
      );
      
      // Reload appointments to update the list
      await loadExistingAppointments();
      
      // Reload available days to remove the booked slot (reset to offset 0)
      setOffset(0);
      await loadDays(0);
      
      alert(`✓ Appointment booked!\n\nDate: ${formatDate(selectedSlot.date)}\nTime: ${selectedSlot.timeRange.start} - ${selectedSlot.timeRange.end}`);
      
      // Clear selection and redirect to appointments page
      setSelectedSlot(null);
      router.push('/appointments');
      
    } catch (error) {
      console.error("Failed to book appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setBookingInProgress(false);
    }
  };

  return (
    <Background>
      <Navigation />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand mb-2">Book an Appointment</h1>
            <p className="text-gray-600">Select a date and time that works best for you</p>
          </div>

          {/* Stacked date sections */}
          <div className="space-y-6">
            {availableDays.map((day) => (
              <div
                key={day.date}
                className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
                  {/* Left: Date */}
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-gray-600">
                      {formatDate(day.date, DateTime.DATE_MED_WITH_WEEKDAY)}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">EST/EDT</p>
                  </div>

                  {/* Right: Time ranges */}
                  <div>
                    {day.timeRanges.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No slots available
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {day.timeRanges.map((timeRange, index) => {
                          const isSelected = isSlotSelected(day.date, timeRange);
                          
                          return (
                            <button
                              key={`${timeRange.start}-${index}`}
                              onClick={() => handleTimeSelect(day.date, timeRange)}
                              className={`px-4 py-3 rounded-lg font-medium transition cursor-pointer ${
                                isSelected
                                  ? "bg-brand text-white"
                                  : "bg-gray-100 hover:bg-gray-100 text-gray-900"
                              }`}
                            >
                              {toDisplayTime(timeRange.start)} - {toDisplayTime(timeRange.end)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading state */}
            {loading && (
              <div className="text-center py-8 text-gray-600">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                <p className="mt-2 text-sm">Loading...</p>
              </div>
            )}

            {/* Load More Button */}
            {canLoadMore && !loading && (
              <div className="text-center">
                <SubmitButton onClick={handleLoadMore}>
                    Load more
                </SubmitButton>
              </div>
            )}
          </div>

          {/* Floating booking summary */}
          {selectedSlot && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-6 z-50">
              <div className="rounded-2xl border bg-white shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-600 mb-3">Appointment Summary</h3>
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p><strong>Date:</strong> {formatDate(selectedSlot.date, DateTime.DATE_MED_WITH_WEEKDAY)}</p>
                  <p><strong>Time:</strong> {selectedSlot.timeRange.start} - {selectedSlot.timeRange.end} (EST/EDT)</p>
                </div>
                
                <div className="flex gap-3">
                  <NormalButton
                    onClick={() => setSelectedSlot(null)}
                    disabled={bookingInProgress}
                    className="flex-1"
                  >
                    Cancel
                  </NormalButton>
                  <SubmitButton
                      onClick={handleBookAppointment}
                      disabled={bookingInProgress}
                      className="flex-1"
                  >
                      {bookingInProgress ? "Booking..." : "Confirm"}
                  </SubmitButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </Background>
  );
}