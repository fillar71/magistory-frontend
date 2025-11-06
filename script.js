import { renderTimeline } from "./components/Timeline.js";

const backendURL = "https://magistory-app-production.up.railway.app"; // ganti kalau domain backend berbeda

const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", async () => {
  const idea = document.getElementById("idea").value;
  const duration = parseInt(document.getElementById("duration").value);
  const aspect = document.getElementById("aspect").value;
  const style = document.getElementById("style").value;

  if (!idea || !duration || !aspect) {
    alert("Mohon isi semua kolom input!");
    return;
  }

  try {
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";

    // Request ke backend
    const res = await fetch(`${backendURL}/api/generate-script`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ide: idea,
        durasi_total: duration,
        aspect_ratio: aspect,
        style: style,
      }),
    });

    const data = await res.json();

    if (!data.adegan) {
      alert("Gagal mendapatkan skrip dari backend.");
      console.error(data);
      return;
    }

    // Setelah script dari Gemini didapat, ambil media dari Pexels
    const enhancedScenes = await fetchPexelsVideos(data.adegan);

    // Kirim hasil lengkap ke timeline
    renderTimeline({
      judul: data.judul,
      adegan: enhancedScenes,
      konfigurasi: data.konfigurasi,
    });
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat generate script.");
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerText = "Generate Script";
  }
});

// Fungsi untuk ambil video dari Pexels berdasarkan deskripsi visual
async function fetchPexelsVideos(scenes) {
  const pexelsKey = "ISI_API_KEY_PEXELS_KAMU"; // isi dengan Pexels API Key
  const enhanced = [];

  for (const scene of scenes) {
    const keywords = (scene.deskripsi_visual || []).join(" ");
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(keywords)}&per_page=5`,
      { headers: { Authorization: pexelsKey } }
    );

    const json = await res.json();
    const media = json.videos.map((v) => ({
      src: v.video_files[0]?.link,
      thumbnail: v.image,
    }));

    enhanced.push({ ...scene, media });
  }

  return enhanced;
}
