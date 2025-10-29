import { useState, useEffect, useCallback, useRef } from "react";
import { Package, LogOut, Menu, X } from "lucide-react";

/**
 * AdminLayout
 * - Fully responsive (mobile, tablet, desktop, ultra-wide)
 * - Accessible mobile drawer (ESC to close, backdrop click, ARIA roles/labels)
 * - Body scroll lock when drawer open
 * - Safe-area paddings for notched devices
 * - Clean gradient aesthetic with Tailwind
 */
export default function AdminLayout({ children, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("produk");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dialogRef = useRef(null);

  const menuItems = [
    { id: "produk", label: "Kelola Produk", icon: <Package size={20} /> },
    // Tambahkan menu lain di sini jika perlu
    // { id: "pesanan", label: "Kelola Pesanan", icon: <ClipboardList size={20} /> },
  ];

  const handleLogoutLocal = useCallback(async () => {
    try {
      if (typeof onLogout === "function") {
        await onLogout();
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  }, [onLogout]);

  // Body scroll lock + ESC to close mobile drawer
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = sidebarOpen
      ? "hidden"
      : originalOverflow || "";

    const onKeyDown = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sidebarOpen]);

  // Focus the close button when drawer opens (basic focus management)
  useEffect(() => {
    if (sidebarOpen && dialogRef.current) {
      const closeBtn = dialogRef.current.querySelector("button[data-close]");
      closeBtn?.focus();
    }
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-slate-100">
      {/* Sidebar desktop (>= lg) */}
      <aside className="hidden lg:flex w-72 xl:w-80 bg-slate-900/80 backdrop-blur-xl border-r border-blue-500/20 flex-col shadow-2xl">
        {/* Brand */}
        <div className="p-6 xl:p-8 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-black text-white">W3</span>
            </div>
            <div>
              <h1 className="font-black text-xl xl:text-2xl text-white tracking-tight">
                W3Liquor
              </h1>
              <p className="text-sm text-blue-400 font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav (desktop) */}
        <nav className="flex-1 p-4 sm:p-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/60">
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
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30 scale-[1.02]"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-base xl:text-[1.05rem]">
                  {item.label}
                </span>
                {isActive && (
                  <span className="ml-auto h-2 w-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}

          {/* Logout (desktop) */}
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

      {/* Mobile/Tablet top bar (<= lg) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-blue-600/20 to-purple-700/20 backdrop-blur supports-[backdrop-filter]:bg-slate-900/30 border-b border-white/10 flex items-center justify-between gap-3 [padding-top:env(safe-area-inset-top)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu samping"
            aria-expanded={sidebarOpen}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-lg sm:text-xl font-black text-white">
                W3
              </span>
            </div>
            <div>
              <h1 className="font-black text-base sm:text-lg leading-tight">
                W3Liquor
              </h1>
              <p className="text-[11px] sm:text-xs text-blue-300 font-semibold">
                Admin Panel
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogoutLocal}
          className="hidden xs:flex items-center gap-2 bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/10 rounded-xl px-3 py-2 text-sm font-semibold"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </header>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            className="fixed inset-y-0 left-0 w-[85vw] max-w-[360px] sm:w-96 bg-slate-900/95 backdrop-blur-xl border-r border-blue-500/30 flex flex-col z-50 shadow-2xl overflow-auto lg:hidden"
          >
            {/* Brand mobile */}
            <div className="p-6 border-b border-blue-500/20 flex items-center justify-between [padding-top:env(safe-area-inset-top)]">
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
                data-close
                onClick={() => setSidebarOpen(false)}
                aria-label="Tutup menu samping"
                className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
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

              {/* Logout (mobile) */}
              <div className="pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
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
        {/* Content wrapper */}
        <div className="h-full overflow-auto">
          {/* Top spacing for mobile header */}
          <div className="pt-16 sm:pt-20 lg:pt-0" />

          {/* Content container */}
          <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="max-w-7xl 2xl:max-w-[88rem] mx-auto">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
