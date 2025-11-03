// components/MainPreview.js

export function renderMainPreview(scenes, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("❌ Container pratinjau utama tidak ditemukan:", containerId);
    return;
  }

  // Buat template UI utama
  container.innerHTML = `
    <h2 style="text-align:center;margin:20px 0;">🎬 Pratinjau Media Utama</h2>
    <video id="mainPreview" width="100%" controls style="
      border-radius:12px;
      box-shadow:0 3px 10px rgba(0,0,0,0.3);
      display:block;
      margin:auto;">
    </video>
    <div id="mainPreviewStatus" style="text-align:center;margin-top:10px;font-size:14px;color:#555"></div>
  `;

  const videoEl = document.getElementById("mainPreview");
  const status = document.getElementById("mainPreviewStatus");

  // Gabungkan semua klip media dari semua adegan
  const allClips = [];
  scenes.forEach((scene) => {
    if (Array.isArray(scene.media)) {
      scene.media.forEach((m) => {
        if (m && m.src) allClips.push(m.src);
      });
    }
  });

  if (allClips.length === 0) {
    status.innerText = "⚠️ Tidak ada media ditemukan untuk diputar.";
    return;
  }

  let currentIndex = 0;

  function playNext() {
    if (currentIndex >= allClips.length) {
      status.innerText = "✅ Semua klip selesai diputar.";
      return;
    }

    const clipSrc = allClips[currentIndex];
    videoEl.src = clipSrc;
    videoEl.play();
    status.innerText = `Memutar klip ${currentIndex + 1}/${allClips.length}`;

    videoEl.onended = () => {
      currentIndex++;
      playNext();
    };
  }

  // Mulai putar otomatis saat load
  playNext();
}
