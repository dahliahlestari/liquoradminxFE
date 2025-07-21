import React, { useEffect, useState } from "react";
import axios from "axios";

const kategoriOptions = [
  "Whiskey",
  "Vodka",
  "Gin",
  "Rum",
  "Tequila",
  "Wine",
  "Beer",
  "Liqueur",
  "Others",
];

function LiquorForm({ token, selected, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nama: selected?.nama || "",
    harga: selected?.harga || "",
    diskon: selected?.diskon ? String(parseInt(selected.diskon, 10)) : "",
    stok: selected?.stok || "",
    deskripsi: selected?.deskripsi || "",
    kategori: selected?.kategori || "",
    rating: selected?.rating ?? "5.0",
    sold: selected?.sold ?? "0",
    gambar: null,
  });
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(""); // Untuk menampilkan nama file gambar
  const isEdit = !!selected;

  useEffect(() => {
    setForm({
      nama: selected?.nama || "",
      harga: selected?.harga || "",
      diskon: selected?.diskon ? String(parseInt(selected.diskon, 10)) : "",
      stok: selected?.stok || "",
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
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (name === "gambar" && files && files.length > 0) {
      setFileName(files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("nama", form.nama);
    fd.append("harga", form.harga);
    fd.append("diskon", form.diskon);
    fd.append("stok", form.stok);
    fd.append("deskripsi", form.deskripsi);
    fd.append("kategori", form.kategori);
    fd.append("rating", form.rating);
    fd.append("sold", form.sold);
    if (form.gambar) fd.append("gambar", form.gambar);

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:3000/api/liquors/${selected.id}`,
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + token,
            },
          }
        );
      } else {
        await axios.post("http://localhost:3000/api/liquors", fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        });
      }
      onSuccess();
    } catch (err) {
      alert("Gagal simpan data!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md space-y-6 mb-10"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-5">
        {isEdit ? "Edit Produk Liquor" : "Tambah Produk Liquor"}
      </h2>

      {/* Input Fields */}
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
          required: false,
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
          min: 1,
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

      {/* Deskripsi */}
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

      {/* Kategori */}
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

      {/* Gambar */}
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
            {fileName || "Belum ada file dipilih"}
          </span>
        </div>
      </div>

      {/* Buttons */}
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
          {loading
            ? isEdit
              ? "Menyimpan..."
              : "Menyimpan..."
            : isEdit
            ? "Update"
            : "Tambah"}
        </button>
      </div>
    </form>
  );
}

export default function KelolaProduk({ token }) {
  const [liquors, setLiquors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchLiquors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/liquors", {
        headers: { Authorization: "Bearer " + token },
      });
      setLiquors(res.data);
    } catch (err) {
      alert("Gagal mengambil data!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      await axios.delete(`http://localhost:3000/api/liquors/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      fetchLiquors();
    } catch (err) {
      alert("Gagal hapus data!");
      console.error(err);
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-blue-800">
        Kelola Produk Liquor
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
          token={token}
          selected={selected}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-yellow-100">
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700">
                No
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700">
                Nama Produk
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700">
                Kategori
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700">
                Harga
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700">
                Diskon
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700">
                Stok
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700 max-w-xs">
                Deskripsi
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700">
                Rating
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700">
                Terjual
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700">
                Gambar
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-yellow-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {liquors.map((liq, i) => (
              <tr
                key={liq.id}
                className="border-b border-gray-200 hover:bg-yellow-50 transition-colors"
              >
                <td className="border border-gray-300 px-6 py-3 text-gray-900 font-semibold">
                  {i + 1}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-gray-900">
                  {liq.nama}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-gray-900">
                  {liq.kategori}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-gray-900 font-semibold">
                  Rp{Number(liq.harga).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-center text-gray-900">
                  {liq.diskon > 0 ? `${parseInt(liq.diskon, 10)}%` : "-"}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-gray-900">
                  {liq.stok}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-gray-900 truncate max-w-xs">
                  {liq.deskripsi}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-center text-gray-900">
                  {(liq.rating ?? 0).toFixed(1)}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-center text-gray-900">
                  {liq.sold || 0}
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
                <td className="border border-gray-300 px-6 py-3 flex gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
