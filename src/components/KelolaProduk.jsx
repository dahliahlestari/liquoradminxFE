import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { uploadToCloudinary } from "../services/cloudinary";

const kategoriOptions = [
  "Whisky",
  "Vodka",
  "Gin",
  "Rum",
  "Tequila",
  "Wine",
  "Cognac",
  "Liqueur",
  "Others",
];

const productsCol = collection(db, "products");

/* =================== FORM =================== */
function LiquorForm({ selected, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nama: selected?.nama || "",
    harga: selected?.harga ?? "",
    diskon: selected?.diskon ?? "",
    stok: selected?.stok ?? "",
    deskripsi: selected?.deskripsi || "",
    kategori: selected?.kategori || "",
    rating: selected?.rating ?? "5.0",
    sold: selected?.sold ?? "0",
    gambar: null, // file
  });
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const isEdit = !!selected;

  useEffect(() => {
    setForm({
      nama: selected?.nama || "",
      harga: selected?.harga ?? "",
      diskon: selected?.diskon ?? "",
      stok: selected?.stok ?? "",
      deskripsi: selected?.deskripsi || "",
      kategori: selected?.kategori || "",
      rating: selected?.rating ?? "5.0",
      sold: selected?.sold ?? "0",
      gambar: null,
    });
    setFileName("");
  }, [selected]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    if (name === "gambar" && files?.length) setFileName(files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // upload gambar (kalau ada)
      let gambarUrl = selected?.gambar || "";
      let publicId = selected?.public_id || "";

      if (form.gambar) {
        const up = await uploadToCloudinary(form.gambar);
        gambarUrl = up.secure_url;
        publicId = up.public_id;
      }

      const payload = {
        nama: String(form.nama).trim(),
        kategori: form.kategori || "Others",
        harga: Number(form.harga) || 0,
        diskon: Number(form.diskon) || 0,
        stok: Number(form.stok) || 0,
        deskripsi: form.deskripsi || "",
        rating: Math.max(0, Math.min(5, Number(form.rating) || 0)),
        sold: Number(form.sold) || 0,
        gambar: gambarUrl,
        public_id: publicId,
        updatedAt: serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, "products", selected.id), payload);
      } else {
        await addDoc(productsCol, {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md space-y-6 mb-10"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-5">
        {isEdit ? "Edit Produk Liquor" : "Tambah Produk Liquor"}
      </h2>

      {[
        {
          label: "Nama Produk",
          name: "nama",
          type: "text",
          required: true,
          placeholder: "Masukkan nama produk",
        },
        {
          label: "Harga",
          name: "harga",
          type: "number",
          required: true,
          placeholder: "Masukkan harga",
          min: 0,
        },
        {
          label: "Diskon (%)",
          name: "diskon",
          type: "number",
          placeholder: "Diskon produk (%)",
          min: 0,
          max: 100,
        },
        {
          label: "Stok",
          name: "stok",
          type: "number",
          required: true,
          placeholder: "Jumlah stok",
          min: 0,
        },
        {
          label: "Rating",
          name: "rating",
          type: "number",
          required: true,
          placeholder: "Rating (1-5)",
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          label: "Terjual",
          name: "sold",
          type: "number",
          required: true,
          placeholder: "Jumlah terjual",
          min: 0,
        },
      ].map(({ label, name, type, required, placeholder, min, max, step }) => (
        <div key={name}>
          <label
            htmlFor={name}
            className="block mb-2 font-medium text-gray-900"
          >
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            required={required}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            value={form[name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      ))}

      <div>
        <label
          htmlFor="deskripsi"
          className="block mb-2 font-medium text-gray-900"
        >
          Deskripsi
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          placeholder="Deskripsi produk"
          value={form.deskripsi}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-600"
          rows={4}
        />
      </div>

      <div>
        <label
          htmlFor="kategori"
          className="block mb-2 font-medium text-gray-900"
        >
          Kategori
        </label>
        <select
          id="kategori"
          name="kategori"
          value={form.kategori}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">-- Pilih kategori --</option>
          {kategoriOptions.map((kat) => (
            <option key={kat} value={kat}>
              {kat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="gambar"
          className="block mb-2 font-medium text-gray-900"
        >
          Gambar Produk
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            id="gambar"
            name="gambar"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="block w-40 bg-white border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
          />
          <span className="text-gray-700 max-w-xs break-words">
            {fileName ||
              (isEdit && selected?.gambar
                ? "Tetap pakai gambar lama"
                : "Belum ada file dipilih")}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition text-sm"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 text-sm"
        >
          {loading ? "Menyimpan..." : isEdit ? "Update" : "Tambah"}
        </button>
      </div>
    </form>
  );
}

/* =================== LIST & ACTIONS =================== */
export default function KelolaProduk() {
  const [liquors, setLiquors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  async function fetchLiquors() {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(productsCol, orderBy("createdAt", "desc"))
      );
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLiquors(rows);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLiquors();
  }, []);

  const handleEdit = (liq) => {
    setSelected(liq);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus produk ini?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      // Catatan: hapus gambar di Cloudinary perlu endpoint server (signed destroy).
      fetchLiquors();
    } catch (err) {
      console.error(err);
      alert("Gagal hapus data!");
    }
  };

  const handleFormSuccess = () => {
    setFormVisible(false);
    setSelected(null);
    fetchLiquors();
  };
  const handleFormCancel = () => {
    setFormVisible(false);
    setSelected(null);
  };

  if (loading)
    return (
      <div className="p-6 text-center font-semibold text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
      <h2 className="text-3xl font-bold mb-8 text-blue-800">
        Kelola Produk
      </h2>

      {!formVisible && (
        <button
          onClick={() => setFormVisible(true)}
          className="mb-8 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Tambah Produk
        </button>
      )}

      {formVisible && (
        <LiquorForm
          selected={selected}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-yellow-100">
              {[
                "No",
                "Nama Produk",
                "Kategori",
                "Harga",
                "Diskon",
                "Stok",
                "Deskripsi",
                "Rating",
                "Terjual",
                "Gambar",
                "Aksi",
              ].map((h) => (
                <th
                  key={h}
                  className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {liquors.map((liq, i) => (
              <tr
                key={liq.id}
                className="border-b border-gray-200 hover:bg-yellow-50 transition-colors"
              >
                <td className="border border-gray-300 px-6 py-3 font-semibold">
                  {i + 1}
                </td>
                <td className="border border-gray-300 px-6 py-3">{liq.nama}</td>
                <td className="border border-gray-300 px-6 py-3">
                  {liq.kategori}
                </td>
                <td className="border border-gray-300 px-6 py-3 font-semibold">
                  Rp{Number(liq.harga || 0).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-center">
                  {Number(liq.diskon || 0) > 0
                    ? `${parseInt(liq.diskon, 10)}%`
                    : "-"}
                </td>
                <td className="border border-gray-300 px-6 py-3">
                  {liq.stok ?? 0}
                </td>
                <td className="border border-gray-300 px-6 py-3 truncate max-w-xs">
                  {liq.deskripsi}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-center">
                  {Number(liq.rating ?? 0).toFixed(1)}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-center">
                  {liq.sold ?? 0}
                </td>
                <td className="border border-gray-300 px-6 py-3">
                  {liq.gambar && (
                    <img
                      src={liq.gambar}
                      alt={liq.nama}
                      className="w-16 h-16 object-cover rounded-md shadow"
                    />
                  )}
                </td>
                <td className="border border-gray-300 px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(liq)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(liq.id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {liquors.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={11}>
                  Belum ada produk
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
