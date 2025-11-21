
import { api } from "./api.config";

// =============================
// 🔥 Obtener todos los clips
// =============================
export async function getAllClips() {
  try {
    const res = await api.get("/api/clips");
    return res.data || [];
  } catch (err) {
    console.error("❌ Error obteniendo todos los clips:", err);
    return [];
  }
}

// =============================
// 🔥 Obtener un clip por ID
// =============================
export async function getClipById(id: string) {
  try {
    const res = await api.get(`/api/clips/${id}`);
    return res.data || null;
  } catch (err) {
    console.error(`❌ Error obteniendo clip con id ${id}:`, err);
    return null;
  }
}

// =============================
// 🔥 Obtener clips de un usuario
// =============================
export async function getClipsByUser(userId: string) {
  try {
    const res = await api.get(`/api/users/${userId}/clips`);
    return res.data || [];
  } catch (err) {
    console.error(`❌ Error obteniendo clips del usuario ${userId}:`, err);
    return [];
  }
}

// =============================
// 🔥 Subir un clip (si luego lo necesitas)
// =============================
export async function uploadClip(formData: FormData) {
  try {
    const res = await api.post("/api/clips", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data || null;
  } catch (err) {
    console.error("❌ Error subiendo clip:", err);
    return null;
  }
}

// =============================
// 🔥 Eliminar un clip (si lo agregas después)
// =============================
export async function deleteClip(id: string) {
  try {
    const res = await api.delete(`/api/clips/${id}`);
    return res.data || null;
  } catch (err) {
    console.error("❌ Error eliminando clip:", err);
    return null;
  }
}
