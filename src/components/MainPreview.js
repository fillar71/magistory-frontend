export function renderMainPreview(scenes, containerId, totalDuration) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="main-preview-wrapper">
      <h2 class="main-preview-title">🎬 Pratinjau Media Utama</h2>
      <video id="mainPreviewVideo" controls class="main-preview-video"></video>
      <div id="mainPreviewStatus" class="main-preview-status"></div>
    </div>
  `;

  const videoEl = document.getElementById("mainPreviewVideo");
  const status = document.getElementById("mainPreviewStatus");

  const allClips = [];
  scenes.forEach((scene) => {
    if (Array.isArray(scene.media)) {
      scene.media.forEach((m) => {
        if (m && m.src) allClips.push(m);
      });
    }
  });

  if (allClips.length === 0) {
    status.innerText = "⚠️ Tidak ada media ditemukan.";
    return;
  }

  // Durasi total dan per-klip
  const perClipDuration = totalDuration / allClips.length;
  let currentIndex = 0;

  function playClip(index) {
    if (index >= allClips.length) {
      status.innerText = "✅ Semua klip selesai.";
      return;
    }

    videoEl.src = allClips[index].src;
    videoEl.play();
    status.innerText = `▶️ Memutar klip ${index + 1}/${allClips.length}`;

    setTimeout(() => {
      videoEl.pause();
      currentIndex++;
      playClip(currentIndex);
    }, perClipDuration * 1000);
  }

  playClip(currentIndex);
}
