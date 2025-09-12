import { useState } from "react";

export default function PublisherSidebar({ 
  activeTab, 
  setActiveTab, 
  stats 
}: {
  activeTab: string;
  setActiveTab: (tab: "dashboard" | "websites" | "add-website" | "analytics" | "earnings" | "settings") => void;
  stats: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <aside className={`${sidebarOpen ? 'w-56 lg:w-64' : 'w-14 lg:w-16'} flex-shrink-0 flex flex-col transition-all duration-300 min-h-screen shadow-lg sticky top-0 h-screen overflow-y-auto`} style={{backgroundColor: 'var(--base-primary)', borderRight: '1px solid var(--base-tertiary)'}}>
      <div className="flex items-center justify-between p-3 sm:p-4 h-14 sm:h-16 lg:h-[6.25rem] flex-shrink-0" style={{borderBottom: '1px solid var(--base-tertiary)'}}>
        <div className={`${sidebarOpen ? 'block' : 'hidden'} text-xl lg:text-2xl font-bold`} style={{color: 'var(--secondary-primary)'}}>
          Publisher
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg transition-colors"
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
        >
          <span className="material-symbols-outlined">
            menu
          </span>
        </button>
      </div>

      <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 lg:space-y-2">
        <div className="space-y-1 lg:space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "dashboard"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "dashboard" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "dashboard" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "dashboard") {
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "dashboard") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">dashboard</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Dashboard</span>
          </button>
        </div>

        <div className="pt-3 lg:pt-4 mt-3 lg:mt-4 space-y-1 lg:space-y-2" style={{borderTop: '1px solid var(--base-tertiary)'}}>
          <button
            data-tab="websites"
            onClick={() => setActiveTab("websites")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "websites"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "websites" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "websites" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "websites") {
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "websites") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">web</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>My Websites</span>
            {sidebarOpen && stats.total > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium" style={{backgroundColor: 'var(--success)', color: 'white'}}>
                {stats.total}
              </span>
            )}
          </button>
          
          <button
            data-tab="add-website"
            onClick={() => setActiveTab("add-website")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "add-website"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "add-website" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "add-website" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "add-website") {
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "add-website") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">add</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Add Website</span>
          </button>
        </div>

        <div className="pt-3 lg:pt-4 mt-3 lg:mt-4 space-y-1 lg:space-y-2" style={{borderTop: '1px solid var(--base-tertiary)'}}>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "analytics"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "analytics" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "analytics" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "analytics") {
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "analytics") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">analytics</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Analytics</span>
          </button>
          
          <button
            onClick={() => setActiveTab("earnings")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "earnings"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "earnings" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "earnings" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "earnings") {
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "earnings") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">monetization_on</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Earnings</span>
          </button>
        </div>

        <div className="pt-3 lg:pt-4 mt-3 lg:mt-4 space-y-1 lg:space-y-2" style={{borderTop: '1px solid var(--base-tertiary)'}}>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "settings"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "settings" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "settings" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "settings") {
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "settings") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">settings</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Settings</span>
          </button>
        </div>
      </nav>

      <div className="p-3 lg:p-4" style={{borderTop: '1px solid var(--base-tertiary)'}}>
        <div className="flex items-center">
          <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base" style={{backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)'}}>
            P
          </div>
          <div className={`${sidebarOpen ? 'block' : 'hidden'} ml-2 lg:ml-3`}>
            <p className="text-xs lg:text-sm font-semibold" style={{color: 'var(--secondary-primary)'}}>Publisher</p>
            <a className="text-xs lg:text-sm transition-colors" style={{color: 'var(--secondary-lighter)'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--accent-primary)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--secondary-lighter)'} href="#">View profile</a>
          </div>
        </div>
      </div>
    </aside>
  );
}