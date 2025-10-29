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

/* =================== FORM (Mobile-first) =================== */
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

  const inputBase =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-base";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-md space-y-5 mb-8 md:mb-10"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Produk Liquor" : "Tambah Produk Liquor"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold"
        >
          Batal
        </button>
      </div>

      {/* Grid 2 kolom di md+, 1 kolom di HP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
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
            placeholder: "Rating (0-5)",
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
        ].map(
          ({ label, name, type, required, placeholder, min, max, step }) => (
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
                inputMode={type === "number" ? "decimal" : undefined}
                className={inputBase}
                onWheel={(e) => e.currentTarget.blur()} // hindari scroll ubah angka
              />
            </div>
          )
        )}

        {/* Kategori full width di md:span-2 */}
        <div className="md:col-span-2">
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
            className={inputBase}
          >
            <option value="">-- Pilih kategori --</option>
            {kategoriOptions.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
        </div>

        {/* Deskripsi full width */}
        <div className="md:col-span-2">
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
            className={`${inputBase} resize-y`}
            rows={4}
          />
        </div>

        {/* Upload gambar full width */}
        <div className="md:col-span-2">
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
              className="block w-full sm:w-64 bg-white border border-gray-300 rounded-lg px-3 py-2 cursor-pointer"
            />
            <span className="text-gray-700 max-w-full sm:max-w-xs break-words text-sm">
              {fileName ||
                (isEdit && selected?.gambar
                  ? "Tetap pakai gambar lama"
                  : "Belum ada file dipilih")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-semibold"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 text-sm font-semibold"
        >
          {loading ? "Menyimpan..." : isEdit ? "Update" : "Tambah"}
        </button>
      </div>
    </form>
  );
}

/* =================== LIST & ACTIONS (Mobile-first) =================== */
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
      <div className="p-6 md:p-8 text-center font-semibold text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-dvh text-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800">
          Kelola Produk
        </h2>

        {!formVisible && (
          <button
            onClick={() => setFormVisible(true)}
            className="self-start sm:self-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base font-semibold shadow"
          >
            + Tambah Produk
          </button>
        )}
      </div>

      {formVisible && (
        <LiquorForm
          selected={selected}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* TABEL di layar >= md, KARTU di mobile */}
      <div className="rounded-xl shadow-lg bg-white">
        {/* TABLE (md+) */}
        <div className="hidden md:block rounded-xl">
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr className="bg-yellow-100">
                {[
                  "No",
                  "Nama Produk",
                  "Kategori",
                  "Harga",
                  "Diskon",
                  "Stok",
                  "Terjual",
                  "Gambar",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-sm font-semibold text-yellow-800 border-b border-yellow-200"
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
                  className="hover:bg-yellow-50/60 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold">{i + 1}</td>
                  <td
                    className="px-4 py-3 max-w-[18rem] truncate"
                    title={liq.nama}
                  >
                    {liq.nama}
                  </td>
                  <td className="px-4 py-3">{liq.kategori}</td>
                  <td className="px-4 py-3 font-semibold">
                    Rp{Number(liq.harga || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {Number(liq.diskon || 0) > 0
                      ? `${parseInt(liq.diskon, 10)}%`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{liq.stok ?? 0}</td>
                  <td className="px-4 py-3">{liq.sold ?? 0}</td>
                  <td className="px-4 py-3">
                    {liq.gambar && (
                      <img
                        src={liq.gambar}
                        alt={liq.nama}
                        className="w-14 h-14 object-cover rounded-md shadow"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(liq)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(liq.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {liquors.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={9}>
                    Belum ada produk
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CARDS (mobile) */}
        <div className="md:hidden divide-y divide-gray-100">
          {liquors.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              Belum ada produk
            </div>
          )}
          {liquors.map((liq, i) => (
            <div key={liq.id} className="p-4 flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {liq.gambar ? (
                  <img
                    src={liq.gambar}
                    alt={liq.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3
                      className="text-base font-semibold text-gray-900 leading-tight truncate"
                      title={liq.nama}
                    >
                      {i + 1}. {liq.nama}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {liq.kategori}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      Rp{Number(liq.harga || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Number(liq.diskon || 0) > 0
                        ? `${parseInt(liq.diskon, 10)}%`
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Deskripsi & Rating dihilangkan dari tampilan mobile */}

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                  <span className="px-2 py-1 rounded bg-gray-100">
                    Stok: {liq.stok ?? 0}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-100">
                    Terjual: {liq.sold ?? 0}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(liq)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(liq.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
