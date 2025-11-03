// components/MainPreview.js

/**
 * Menampilkan pratinjau video utama yang memutar semua klip dari setiap adegan secara berurutan.
 * @param {Object[]} scenes - daftar adegan dari script
 * @param {string} containerId - ID elemen container
 */
export function renderMainPreview(scenes, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <h2 style="text-align:center;margin-top:20px;">🎥 Pratinjau Video Utama</h2>
    <video id="mainPreview" width="100%" controls class="main-preview-video" style="border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.2)"></video>
    <div id="mainPreviewStatus" style="text-align:center;margin-top:10px;font-size:14px;color:#555"></div>
  `;

  const videoPlayer = document.getElementById("mainPreview");
  const status = document.getElementById("mainPreviewStatus");
container.innerHTML += `
  <div style="text-align:center;margin-top:10px;">
    <button id="replayAllBtn" style="padding:8px 16px;border:none;background:#007bff;color:#fff;border-radius:8px;cursor:pointer;">
      🔁 Putar Ulang Semua
    </button>
  </div>
`;
document.getElementById("replayAllBtn").onclick = () => {
  currentIndex = 0;
  playNextClip();
};

  // kumpulkan semua klip dari semua adegan
  const allClips = [];
  scenes.forEach((scene) => {
    if (scene.media && scene.media.length > 0) {
      scene.media.forEach((m) => allClips.push(m.src));
    }
  });

  if (allClips.length === 0) {
    container.innerHTML += `<p style="text-align:center;color:red;">Tidak ada media untuk diputar.</p>`;
    return;
  }

  let currentIndex = 0;

  function playNextClip() {
    if (currentIndex >= allClips.length) {
      status.innerText = "✅ Semua klip selesai diputar.";
      return;
    }

    const src = allClips[currentIndex];
    status.innerText = `Memutar klip ${currentIndex + 1} dari ${allClips.length}`;
    videoPlayer.src = src;
    videoPlayer.play();

    // Setelah selesai, lanjut ke klip berikutnya
    videoPlayer.onended = () => {
      currentIndex++;
      playNextClip();
    };
  }

  playNextClip();
}
