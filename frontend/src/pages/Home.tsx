import { useState } from "react";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="p-8 text-center">
        {activeTab === "Overview" && <div>Welcome to your dashboard.</div>}
        {activeTab === "Tasks" && <div>Here are your tasks.</div>}
        {activeTab === "Settings" && <div>Update your preferences here.</div>}
      </div>
    </div>
  );
}
