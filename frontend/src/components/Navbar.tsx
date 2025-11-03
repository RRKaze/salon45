import { useState } from "react";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = ["Home", "Profile", "Tasks", "Settings", "Logout"];

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side — brand or logo */}
          <div className="text-xl font-bold text-white">MyApp</div>

          {/* Right side — navigation links */}
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-16 px-4 flex items-center text-sm font-medium transition-colors ${
                  activeTab === tab ? "bg-blue-700" : "hover:bg-blue-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
