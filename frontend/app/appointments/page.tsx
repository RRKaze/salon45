"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import Background from "../../components/Background";
import SubmitButton from "../../components/SubmitButton";
import NormalButton from "../../components/NormalButton";
import { AppointmentServiceProvider, Appointment } from "@/utils/api/services/appointmentService";
import { formatDate } from "@/utils/scheduleUtils";
import { DateTime } from "luxon";

const PAGE_SIZE = 10;

export default function AppointmentPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [cancelingId, setCancelingId] = useState<string | null>(null);
    const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async (lastId?: string) => {
        try {
            if (lastId) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const data = await AppointmentServiceProvider.get().getAppointments(PAGE_SIZE, lastId);

            if (lastId) {
                setAppointments(prev => [...prev, ...data]);
            } else {
                setAppointments(data);
            }

            setHasMore(data.length === PAGE_SIZE);
        } catch (error) {
            console.error("Failed to load appointments:", error);
            alert("Failed to load appointments. Please try again.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (appointments.length > 0) {
            const lastAppointment = appointments[appointments.length - 1];
            loadAppointments(lastAppointment.id);
        }
    };

    const handleCancelClick = (appointmentId: string) => {
        setConfirmCancelId(appointmentId);
    };

    const handleCancelConfirm = async () => {
        if (!confirmCancelId) return;

        setCancelingId(confirmCancelId);
        try {
            await AppointmentServiceProvider.get().cancelAppointment(confirmCancelId);
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === confirmCancelId
                        ? { ...apt, status: 'canceled' as const }
                        : apt
                )
            );
            setConfirmCancelId(null);
        } catch (error) {
            console.error("Failed to cancel appointment:", error);
            alert("Failed to cancel appointment. Please try again.");
        } finally {
            setCancelingId(null);
        }
    };

    const handleCancelDecline = () => {
        setConfirmCancelId(null);
    };

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'pending': return 'text-blue-600 bg-blue-50';
            case 'completed': return 'text-green-600 bg-green-50';
            case 'missed': return 'text-red-600 bg-red-50';
            case 'canceled': return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusLabel = (status: Appointment['status']) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <Background>
            <Navigation />

            <main className="flex-1">
                <div className="mx-auto max-w-5xl px-6 py-12">
                    {/* Page Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-brand mb-2">My Appointments</h1>
                            <p className="text-gray-600">View and manage your appointments</p>
                        </div>
                        <SubmitButton onClick={() => router.push('/appointments/new')}>
                            Book One
                        </SubmitButton>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
                            <p className="mt-4 text-gray-600">Loading appointments...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && appointments.length === 0 && (
                        <div className="text-center py-12 rounded-2xl border bg-white/70 backdrop-blur-sm">
                            <p className="text-gray-600 mb-4">You dont have any appointments yet.</p>
                        </div>
                    )}

                    {/* Appointments List */}
                    {!loading && appointments.length > 0 && (
                        <div className="space-y-4">
                            {appointments.map((appointment) => {
                                const appointmentDate = DateTime.fromISO(appointment.appointmentDateTime);
                                const bookedDate = DateTime.fromISO(appointment.bookedDateTime);

                                return (
                                    <div
                                        key={appointment.id}
                                        className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {formatDate(appointment.appointmentDateTime, DateTime.DATE_MED_WITH_WEEKDAY)}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                                        {getStatusLabel(appointment.status)}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 text-gray-700">
                                                    <p>
                                                        <span className="font-medium">Appointment Time:</span>{" "}
                                                        {appointmentDate.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Submitted on:</span>{" "}
                                                        {bookedDate.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium">ID:</span> {appointment.id}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {appointment.status === 'pending' && (
                                                <div>
                                                    <NormalButton
                                                        onClick={() => handleCancelClick(appointment.id)}
                                                        disabled={cancelingId === appointment.id}
                                                        className="bg-red-500 hover:bg-red-600 text-white"
                                                    >
                                                        {cancelingId === appointment.id ? "Canceling..." : "Cancel Appointment"}
                                                    </NormalButton>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="text-center pt-4">
                                    <SubmitButton
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? "Loading..." : "Load More"}
                                    </SubmitButton>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Confirmation Dialog */}
            {confirmCancelId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Cancel Appointment
                        </h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to cancel this appointment? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <NormalButton
                                onClick={handleCancelDecline}
                                className="flex-1"
                            >
                                No, Keep It
                            </NormalButton>
                            <SubmitButton
                                onClick={handleCancelConfirm}
                                className="flex-1 bg-red-500 hover:bg-red-600"
                            >
                                Yes, Cancel
                            </SubmitButton>
                        </div>
                    </div>
                </div>
            )}
        </Background>
    );
}