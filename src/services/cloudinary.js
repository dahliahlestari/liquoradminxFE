// src/services/cloudinary.js
export async function uploadToCloudinary(file, opts = {}) {
  if (!file) throw new Error("File tidak ada");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const folder =
    opts.folder || import.meta.env.VITE_CLOUDINARY_FOLDER || "products";

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset); // unsigned preset
  form.append("folder", folder);

  // (opsional) set eager transform langsung di upload:
  // form.append("eager", "f_auto,q_auto");

  const res = await fetch(endpoint, { method: "POST", body: form });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Upload gagal: ${res.status} ${errText}`);
  }
  // hasil: { asset_id, public_id, secure_url, width, height, ... }
  return await res.json();
}

/** Helper URL transform saat render (hemat bandwidth) */
export function cldImageUrl(publicId, w = 600) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  // f_auto = format terbaik, q_auto = kompresi otomatis
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${w}/${publicId}.jpg`;
}
