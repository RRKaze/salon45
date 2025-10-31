export default function Navbar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
    const tabs = ["Overview", "Tasks", "Settings"];
  
    return (
      <nav className="flex justify-center gap-8 bg-white shadow p-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`text-lg font-medium ${
              activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    );
  }
  