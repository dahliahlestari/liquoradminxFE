import { useState, useEffect } from "react";
import {
  AiOutlineAppstore,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineClose,
  AiFillHeart,
} from "react-icons/ai";
// (opsional) kalau kamu sudah pakai Firebase, bisa pakai onLogout dari props

export default function AdminLayout({ children, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("produk");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: "produk",
      label: "Kelola Produk",
      icon: <AiOutlineAppstore size={20} />,
    },
  ];

  const handleLogoutLocal = async () => {
    try {
      if (typeof onLogout === "function") {
        await onLogout(); // untuk Firebase signOut()
      } else {
        // fallback: masih pakai token lama
        localStorage.removeItem("adminToken");
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Disable body scroll saat sidebar mobile terbuka
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-black-600 to-black-500 text-white font-sans">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 bg-black-700/95 backdrop-blur flex-col p-6 rounded-tr-3xl rounded-br-3xl shadow-2xl">
        {/* Brand */}
        <div className="mb-10 select-none">
          <h1 className="font-extrabold text-xl leading-tight tracking-wide">
            W3Liquor <br />
            <span className="text-white-400">Admin</span>
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-3 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              aria-current={activeMenu === item.id ? "page" : undefined}
              className={`group flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition
                ${
                  activeMenu === item.id
                    ? "bg-white text-blue-700 shadow-lg"
                    : "hover:bg-white/10 focus:bg-white/10"
                }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              <span
                className={`ml-auto h-2 w-2 rounded-full transition
                ${
                  activeMenu === item.id
                    ? "bg-blue-600"
                    : "bg-white/30 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </nav>

        {/* CTA Logout */}
        <button
          onClick={handleLogoutLocal}
          aria-label="Logout"
          className="w-full bg-gradient-to-tr from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl py-3 font-bold flex items-center justify-center gap-3 shadow-lg transition"
        >
          <AiOutlineLogout size={20} />
          Logout
        </button>

        {/* Love Note Card */}
        <LoveNote className="mt-6" />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-blue-700/95 backdrop-blur flex flex-col p-6 z-50 rounded-tr-3xl rounded-br-3xl shadow-2xl overflow-auto">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="font-extrabold text-xl tracking-wide select-none">
                W3Liquor <br />
                <span className="text-yellow-400">Admin</span>
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="text-white text-3xl font-bold hover:text-yellow-400 transition"
              >
                <AiOutlineClose />
              </button>
            </div>

            <nav className="flex flex-col gap-3 mb-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                  }}
                  aria-current={activeMenu === item.id ? "page" : undefined}
                  className={`group flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition
                    ${
                      activeMenu === item.id
                        ? "bg-white text-blue-700 shadow-lg"
                        : "hover:bg-white/10 focus:bg-white/10"
                    }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                  <span
                    className={`ml-auto h-2 w-2 rounded-full transition
                    ${
                      activeMenu === item.id
                        ? "bg-blue-600"
                        : "bg-white/30 group-hover:bg-white/60"
                    }`}
                  />
                </button>
              ))}
            </nav>

            <button
              onClick={() => {
                handleLogoutLocal();
                setSidebarOpen(false);
              }}
              aria-label="Logout"
              className="w-full bg-gradient-to-tr from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl py-3 font-bold flex items-center justify-center gap-3 shadow-lg transition"
            >
              <AiOutlineLogout size={20} />
              Logout
            </button>

            <LoveNote className="mt-6" />
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto bg-gray-50 text-gray-800 rounded-l-3xl shadow-inner min-h-screen">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar menu"
          className="md:hidden fixed top-5 left-5 z-50 bg-blue-700 text-white p-2 rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          <AiOutlineMenu size={28} />
        </button>

        {children}
      </main>
    </div>
  );
}
