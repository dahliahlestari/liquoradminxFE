import { useState, useEffect } from "react";
import { Package, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({ children, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("produk");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "produk", label: "Kelola Produk", icon: <Package size={20} /> },
  ];

  const handleLogoutLocal = async () => {
    try {
      if (typeof onLogout === "function") {
        await onLogout();
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-72 bg-slate-900/80 backdrop-blur-xl border-r border-blue-500/20 flex-col shadow-2xl">
        {/* Brand */}
        <div className="p-8 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-black text-white">W3</span>
            </div>
            <div>
              <h1 className="font-black text-xl text-white tracking-tight">
                W3Liquor
              </h1>
              <p className="text-sm text-blue-400 font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav (desktop) */}
        <nav className="flex-1 p-6 space-y-2">
          {/* Items */}
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`group w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30 scale-105"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-base">{item.label}</span>
                {isActive && (
                  <span className="ml-auto h-2 w-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}

          {/* --- Logout tepat di bawah menu --- */}
          <div className="pt-2">
            <button
              onClick={handleLogoutLocal}
              aria-label="Logout"
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-2xl py-4 font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
            >
              <LogOut size={22} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-80 bg-slate-900/95 backdrop-blur-xl border-r border-blue-500/30 flex flex-col z-50 shadow-2xl overflow-auto lg:hidden">
            {/* Brand mobile */}
            <div className="p-6 border-b border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-black text-white">W3</span>
                </div>
                <div>
                  <h1 className="font-black text-lg text-white tracking-tight">
                    W3Liquor
                  </h1>
                  <p className="text-xs text-blue-400 font-semibold">
                    Admin Panel
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav (mobile) */}
            <nav className="flex-1 p-6 space-y-2">
              {menuItems.map((item) => {
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      setSidebarOpen(false);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={`group w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30"
                          : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-base">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}

              {/* --- Logout tepat di bawah menu (mobile) --- */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    handleLogoutLocal();
                    setSidebarOpen(false);
                  }}
                  aria-label="Logout"
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-2xl py-4 font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
                >
                  <LogOut size={22} />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 relative min-h-screen">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar menu"
          className="lg:hidden fixed top-6 left-6 z-30 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Menu size={24} />
        </button>

        {/* Content wrapper */}
        <div className="h-full overflow-auto">
          <div className="p-6 sm:p-8 lg:p-10 pt-20 lg:pt-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
