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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Appointments</h2>
              {mockAppointments.length === 0 ? (
                <p className="text-gray-500">No appointments scheduled.</p>
              ) : (
                <div className="space-y-4">
                  {mockAppointments.map((appointment) => (
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
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Background>
  );
}