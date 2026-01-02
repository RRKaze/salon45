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

            
          </div>
        </div>

      </main>
    </Background>
  );
}