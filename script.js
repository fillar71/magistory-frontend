// Ganti URL ini dengan backend kamu di Railway
const API_BASE = "https://magistory-backend-production.up.railway.app";

const ideaInput = document.getElementById("ideaInput");
const generateBtn = document.getElementById("generateBtn");
const videoBtn = document.getElementById("videoBtn");
const scriptResult = document.getElementById("scriptResult");
const videoContainer = document.getElementById("videoContainer");

// Generate Script dari ide
generateBtn.addEventListener("click", async () => {
  const idea = ideaInput.value.trim();
  if (!idea) return alert("Masukkan ide video terlebih dahulu!");

  scriptResult.textContent = "⏳ Sedang memproses...";

  try {
    const res = await fetch(`${API_BASE}/api/generate-script`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });

    const data = await res.json();
    scriptResult.textContent = data.script || "Gagal membuat script.";
  } catch (err) {
    console.error(err);
    scriptResult.textContent = "❌ Terjadi kesalahan.";
  }
});

// Cari video dari Pexels
videoBtn.addEventListener("click", async () => {
  const query = ideaInput.value.trim();
  if (!query) return alert("Masukkan ide video terlebih dahulu!");

  videoContainer.innerHTML = "<p>⏳ Sedang mencari video...</p>";

  try {
    const res = await fetch(`${API_BASE}/api/get-videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    videoContainer.innerHTML = "";

    if (data.videos && data.videos.length > 0) {
      data.videos.forEach((v) => {
        const vid = document.createElement("video");
        vid.src = v.url;
        vid.controls = true;
        vid.poster = v.thumbnail;
        videoContainer.appendChild(vid);
      });
    } else {
      videoContainer.innerHTML = "<p>Tidak ada video ditemukan.</p>";
    }
  } catch (err) {
    console.error(err);
    videoContainer.innerHTML = "<p>❌ Gagal mengambil video.</p>";
  }
});
