// src/utils/pexelsApi.js
const PEXELS_API_KEY =
  process.env.NEXT_PUBLIC_PEXELS_KEY ||
  "ISI_FALLBACK_KEY_DI_SINI_JIKA_INGIN"; // optional fallback key

// 🔹 Fungsi utama pencarian media (video atau gambar)
export async function searchMedia(query, limit = 3) {
  if (!PEXELS_API_KEY) {
    console.error("❌ PEXELS_API_KEY tidak ditemukan! Pastikan sudah diatur di Vercel Environment Variables.");
    return [];
  }

  try {
    // Pencarian video terlebih dahulu
    const videoRes = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(
        query
      )}&per_page=${limit}`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );

    if (videoRes.status === 401) {
      console.error("⚠️ Unauthorized: API key Pexels salah atau belum diatur.");
      return [];
    }

    const videoJson = await videoRes.json();
    if (videoJson.videos && videoJson.videos.length > 0) {
      return videoJson.videos.map((v) => ({
        type: "video",
        src: v.video_files?.[0]?.link || "",
        thumbnail: v.image,
        duration: v.duration,
      }));
    }

    // Jika video tidak ada, cari gambar
    const
