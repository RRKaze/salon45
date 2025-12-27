"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import Background from "../../components/Background";
import InputField from "../../components/InputField";
import NormalButton from "../../components/NormalButton";
import { userService } from "@/utils/api";
import { authService } from "@/utils/api";
import { AppointmentServiceProvider } from "@/utils/api/services/appointmentService";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
}

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: "2",
    date: "2024-01-22",
    time: "2:30 PM",
    status: "pending",
  },
  {
    id: "3",
    date: "2024-02-01",
    time: "11:00 AM",
    status: "confirmed",
  },
];

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, refetchUser, clearUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [editData, setEditData] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    // Don't redirect to login if we're logging out (will navigate to home instead)
    if (!isLoading && !isAuthenticated && !isLoggingOut) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, isLoggingOut, router]);

  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setErrorMessage("");
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email || "",
      });
    }
    setIsEditing(false);
    setErrorMessage("");
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      await userService.updateUser(user.id, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        phone: editData.phone,
        email: editData.email || undefined,
      });
      await refetchUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      clearUser();
      // Navigate immediately to prevent redirect to login
      router.push("/home");
      // Reset logout state after navigation
      setTimeout(() => setIsLoggingOut(false), 100);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.id]: e.target.value });
    setErrorMessage("");
  };

  const handleCancelClick = (appointmentId: string) => {
    setCancelConfirmId(appointmentId);
  };

  const handleCancelConfirm = async () => {
    if (!cancelConfirmId) return;

    setIsCanceling(true);
    try {
      await AppointmentServiceProvider.get().cancelAppointment(cancelConfirmId);
      // Remove the appointment from the list
      setAppointments(prev => prev.filter(apt => apt.id !== cancelConfirmId));
      setCancelConfirmId(null);
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      setErrorMessage("Failed to cancel appointment. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleCancelDecline = () => {
    setCancelConfirmId(null);
  };

  const getAppointmentToCancel = () => {
    return appointments.find(apt => apt.id === cancelConfirmId);
  };

  if (isLoading) {
    return (
      <Background>
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </main>
      </Background>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Background>
      <Navigation />
      <main className="flex-1 py-12">
        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-brand">My Profile</h1>
            <NormalButton
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-500 text-white border-red-500 hover:bg-red-600"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </NormalButton>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing && (
                  <NormalButton onClick={handleEdit} className="text-sm py-1 px-4">
                    Edit
                  </NormalButton>
                )}
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <InputField
                      label="First Name"
                      id="firstName"
                      value={editData.firstName}
                      onChange={handleChange}
                      className="w-full"
                    />
                    <InputField
                      label="Last Name"
                      id="lastName"
                      value={editData.lastName}
                      onChange={handleChange}
                      className="w-full"
                    />
                    <InputField
                      label="Phone Number"
                      id="phone"
                      type="tel"
                      value={editData.phone}
                      onChange={handleChange}
                      className="w-full"
                    />
                    <InputField
                      label="Email Address"
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={handleChange}
                      className="w-full"
                    />
                    {errorMessage && (
                      <p className="text-red-600 text-sm">{errorMessage}</p>
                    )}
                    <div className="flex gap-3 mt-4">
                      <NormalButton
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-brand text-white border-brand hover:bg-brand-dark"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </NormalButton>
                      <NormalButton onClick={handleCancel} disabled={isSaving}>
                        Cancel
                      </NormalButton>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">First Name</label>
                      <p className="mt-1 text-lg text-gray-900">{user.firstName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Name</label>
                      <p className="mt-1 text-lg text-gray-900">{user.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Username</label>
                      <p className="mt-1 text-lg text-gray-900">{user.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
                    </div>
                    {user.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Appointments Section */}
            <div className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm">
              <h1 className="text-3xl font-semibold text-brand mb-6">My Appointments</h1>
              {appointments.length === 0 ? (
                <p className="text-gray-500">No appointments scheduled.</p>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointment Information</h2>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatDate(appointment.date)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{appointment.time}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1)}
                            </span>
                          {appointment.status !== "cancelled" && (
                            <NormalButton
                              onClick={() => handleCancelClick(appointment.id)}
                              className="text-xs py-0.5 px-2 bg-red-500 text-white border-red-500 hover:bg-red-600"
                            >
                              Cancel
                            </NormalButton>
                          )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {cancelConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Cancel Appointment
              </h3>
              {getAppointmentToCancel() && (
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">
                    Are you sure you want to cancel this appointment?
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">
                      Date: {formatDate(getAppointmentToCancel()!.date)}
                    </p>
                    <p className="text-gray-600 mt-1">
                      Time: {getAppointmentToCancel()!.time}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <NormalButton
                  onClick={handleCancelConfirm}
                  disabled={isCanceling}
                  className="flex-1 bg-red-500 text-white border-red-500 hover:bg-red-600"
                >
                  {isCanceling ? "Canceling..." : "Confirm Cancel"}
                </NormalButton>
                <NormalButton
                  onClick={handleCancelDecline}
                  disabled={isCanceling}
                  className="flex-1"
                >
                  Keep Appointment
                </NormalButton>
              </div>
            </div>
          </div>
        )}
      </main>
    </Background>
  );
}