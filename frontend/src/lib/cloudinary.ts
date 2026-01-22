import { api } from "@/lib/axios";

export async function uploadProductImage(file: File, folder = "products") {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  const res = await api.post("/cloudinary/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return {
    secureUrl: res.data.secure_url as string,
    publicId: res.data.public_id as string,
  };
}
