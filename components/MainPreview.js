// components/MainPreview.js
export function renderMainPreview(scenes, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="main-preview-wrapper">
      <h2 class="main-preview-title">🎬 Pratinjau Media Utama</h2>
      <video id="mainPreviewVideo" controls class="main-preview-video"></video>

      <div class="progress-container" id="progressContainer"></div>
      <div class="thumbnail-container" id="thumbnailContainer"></div>

      <div id="mainPreviewStatus" class="main-preview-status"></div>
    </div>
  `;

  const videoEl = document.getElementById("mainPreviewVideo");
  const status = document.getElementById("mainPreviewStatus");
  const progressContainer = document.getElementById("progressContainer");
  const thumbnailContainer = document.getElementById("thumbnailContainer");

  // Ambil semua klip dari semua adegan
  const allClips = [];
  scenes.forEach((scene) => {
    if (Array.isArray(scene.media)) {
      scene.media.forEach((m) => {
        if (m && m.src) allClips.push({ src: m.src, thumb: m.thumbnail });
      });
    }
  });

  if (allClips.length === 0) {
    status.innerText = "⚠️ Tidak ada media ditemukan.";
    return;
  }

  let currentIndex = 0;

  // 🔹 Render Progress Bar
  progressContainer.innerHTML = allClips
    .map(
      (_, i) => `
      <div class="progress-bar" id="progress-${i}">
        <div class="progress-fill" id="progress-fill-${i}"></div>
      </div>
    `
    )
    .join("");

  // 🔹 Render Thumbnails
  thumbnailContainer.innerHTML = allClips
    .map(
      (clip, i) => `
      <img
        src="${clip.thumb || "https://via.placeholder.com/100x60?text=No+Image"}"
        class="thumbnail ${i === 0 ? "active" : ""}"
        data-index="${i}"
      />
    `
    )
    .join("");

  const thumbnails = document.querySelectorAll(".thumbnail");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const index = parseInt(thumb.dataset.index);
      currentIndex = index;
      playClip(currentIndex);
    });
  });

  // 🔹 Fungsi utama untuk memutar video
  function playClip(index) {
    if (index >= allClips.length) {
      status.innerText = "✅ Semua klip selesai.";
      return;
    }

    videoEl.src = allClips[index].src;
    videoEl.play();
    updateActiveThumbnail(index);
    updateProgress(index);

    status.innerText = `▶️ Memutar klip ${index + 1} dari ${allClips.length}`;

    videoEl.onended = () => {
      currentIndex++;
      playClip(currentIndex);
    };
  }

  // 🔹 Update progress visual
  function updateProgress(index) {
    const fills = document.querySelectorAll(".progress-fill");
    fills.forEach((fill, i) => {
      if (i < index) fill.style.width = "100%";
      else if (i === index) fill.style.width = "0%";
      else fill.style.width = "0%";
    });

    // animasi progres saat video berjalan
    let interval;
    videoEl.ontimeupdate = () => {
      const progress = (videoEl.currentTime / videoEl.duration) * 100;
      const fill = document.getElementById(`progress-fill-${index}`);
      if (fill) fill.style.width = `${progress}%`;
    };
  }

  // 🔹 Highlight thumbnail aktif
  function updateActiveThumbnail(index) {
    thumbnails.forEach((t, i) => {
      t.classList.toggle("active", i === index);
    });
  }

  // 🔹 Mulai pemutaran
  playClip(currentIndex);
}
