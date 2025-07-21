import { useState, useEffect } from "react";
import {
  AiOutlineAppstore,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";

export default function AdminLayout({ children }) {
  const [activeMenu, setActiveMenu] = useState("produk");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: "produk",
      label: "Kelola Produk",
      icon: <AiOutlineAppstore size={20} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.reload();
  };

  // Disable body scroll saat sidebar mobile terbuka
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-blue-600 to-blue-500 text-white font-sans">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 bg-blue-700 flex-col p-6 rounded-tr-3xl rounded-br-3xl shadow-xl">
        <div>
          {/* Logo & Title */}
          <div className="mb-10 flex items-center gap-3">
            <h1 className="font-extrabold text-xl tracking-wide select-none">
              W3Liquor <br />
              <span className="text-yellow-400">Admin</span>
            </h1>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-4 mb-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                aria-current={activeMenu === item.id ? "page" : undefined}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition
            ${
              activeMenu === item.id
                ? "bg-white text-blue-700 shadow-lg"
                : "hover:bg-blue-600"
            }
          `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout & Footer Info */}
        <div>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="w-full bg-gradient-to-tr from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl py-3 font-bold flex items-center justify-center gap-3 shadow-lg transition"
          >
            <AiOutlineLogout size={20} />
            Logout
          </button>

          <div className="mt-6 bg-blue-800 rounded-xl p-4 text-sm flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white opacity-80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
              />
            </svg>
            <span>
              Halo Admin, semangat kerjanya ❤️, salam dari ibra xixixi
            </span>
          </div>
        </div>
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Sidebar panel */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-blue-700 flex flex-col p-6 z-50 rounded-tr-3xl rounded-br-3xl shadow-xl overflow-auto">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-12 h-12 rounded-xl shadow-lg object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <h1 className="font-extrabold text-xl tracking-wide select-none">
                  W3Liquor <br />
                  <span className="text-yellow-400">Admin</span>
                </h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="text-white text-3xl font-bold hover:text-yellow-400 transition"
              >
                <AiOutlineClose />
              </button>
            </div>

            <nav className="flex flex-col gap-4 mb-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                  }}
                  aria-current={activeMenu === item.id ? "page" : undefined}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition
              ${
                activeMenu === item.id
                  ? "bg-white text-blue-700 shadow-lg"
                  : "hover:bg-blue-600"
              }
            `}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              aria-label="Logout"
              className="w-full bg-gradient-to-tr from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl py-3 font-bold flex items-center justify-center gap-3 shadow-lg transition"
            >
              <AiOutlineLogout size={20} />
              Logout
            </button>

            <div className="mt-6 bg-blue-800 rounded-xl p-4 text-sm flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
                />
              </svg>
              <span>
                Halo Admin, semangat kerjanya ❤️, salam dari ibra xixixi
              </span>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto bg-white rounded-l-3xl shadow-inner min-h-screen">
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
