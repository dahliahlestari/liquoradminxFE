import React, { useState } from "react";
// axios tidak dibutuhkan lagi karena pakai Firebase
import logo from "../assets/log.png"; // opsional

// Firebase
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" }); // username = email
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) Login ke Firebase (username dipakai sebagai email)
      const { user } = await signInWithEmailAndPassword(
        auth,
        form.username.trim(),
        form.password
      );

      // 2) Cek role admin di Firestore: admins/{uid}
      const snap = await getDoc(doc(db, "admins", user.uid));
      const isAdmin = snap.exists();

      if (!isAdmin) {
        // kalau bukan admin, logout lagi & kasih pesan
        await signOut(auth);
        throw new Error("Akun ini tidak terdaftar sebagai admin.");
      }

      // 3) Sukses → jalankan callback (router akan arahkan ke halaman admin)
      onLogin && onLogin();
    } catch (err) {
      // map beberapa error code umum biar lebih ramah
      const code = err?.code || "";
      let msg =
        err?.message || err?.response?.data?.error || "Login gagal. Coba lagi.";

      if (code.includes("auth/invalid-email"))
        msg = "Format email tidak valid.";
      if (code.includes("auth/user-not-found")) msg = "Email tidak terdaftar.";
      if (code.includes("auth/wrong-password")) msg = "Password salah.";
      if (code.includes("auth/too-many-requests"))
        msg = "Terlalu banyak percobaan. Coba beberapa menit lagi.";
      if (err?.message === "Akun ini tidak terdaftar sebagai admin.")
        msg = err.message;

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-yellow-50 to-white">
      <div className="bg-white/80 rounded-2xl shadow-2xl p-8 w-full max-w-xs relative animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          {/* logo bisa dipakai kalau mau
          <img src={logo} alt="logo" className="w-16 h-16 mb-2" />
          */}
          <span className="font-extrabold text-2xl text-blue-700 tracking-widest mb-1">
            W3<span className="text-yellow-500">LIQUOR</span>
          </span>
        </div>

        <h2 className="text-xl font-bold mb-5 text-center text-blue-700">
          Admin Login
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="username"
            type="email"
            placeholder="Email"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-100 rounded-lg px-3 py-2 focus:border-yellow-400 focus:outline-none transition"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-100 rounded-lg px-3 py-2 focus:border-yellow-400 focus:outline-none transition"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg animate-shake text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-tr from-blue-500 to-blue-400 text-white font-bold py-2 rounded-lg shadow transition-all duration-150 active:scale-95"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px);}
              to { opacity: 1; transform: none;}
            }
            .animate-fadeIn { animation: fadeIn .7s cubic-bezier(.47,1.64,.41,.8) both; }

            @keyframes shake {
              0% { transform: translateX(0); }
              20% { transform: translateX(-8px); }
              40% { transform: translateX(8px); }
              60% { transform: translateX(-6px); }
              80% { transform: translateX(6px); }
              100% { transform: translateX(0); }
            }
            .animate-shake { animation: shake .35s cubic-bezier(.36,.07,.19,.97) both; }
          `}
        </style>
      </div>
    </div>
  );
}
