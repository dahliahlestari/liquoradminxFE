import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import AdminLogin from "./components/AdminLogin";
import KelolaProduk from "./components/KelolaProduk";
import AdminLayout from "./layouts/AdminLayout";

function AdminGuard({ children }) {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(null); // null = belum tahu

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) {
        alive && setIsAdmin(false);
        return;
      }
      const snap = await getDoc(doc(db, "admins", user.uid));
      if (alive) setIsAdmin(snap.exists()); // atau cek role == "admin"
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  if (loading || isAdmin === null) {
    return <div className="p-6">Checking access…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin)
    return <div className="p-6 text-red-600">Akses admin diperlukan.</div>;
  return children;
}

export default function App() {
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            // kalau sudah login & admin, lempar ke /produk
            <AuthRedirect>
              <AdminLogin />
            </AuthRedirect>
          }
        />

        {/* Halaman admin dilindungi */}
        <Route
          path="/produk"
          element={
            <AdminGuard>
              <AdminLayout onLogout={handleLogout}>
                <KelolaProduk />
              </AdminLayout>
            </AdminGuard>
          }
        />

        {/* root -> /produk */}
        <Route path="/" element={<Navigate to="/produk" replace />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/produk" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

/** Jika user sudah login & admin, redirect dari /login ke /produk */
function AuthRedirect({ children }) {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) {
        alive && setIsAdmin(false);
        return;
      }
      const snap = await getDoc(doc(db, "admins", user.uid));
      if (alive) setIsAdmin(snap.exists());
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  if (loading || isAdmin === null) return <div className="p-6">Loading…</div>;
  if (user && isAdmin) return <Navigate to="/produk" replace />;
  return children;
}
