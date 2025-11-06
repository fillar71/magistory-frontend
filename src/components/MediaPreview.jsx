
// components/MediaPreview.js
export function renderMediaPreview(mediaList, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!mediaList || mediaList.length === 0) {
    container.innerHTML = "<p>Tidak ada media</p>";
    return;
  }

  container.innerHTML = `
    <div class="media-grid">
      ${mediaList
        .map(
          (m) => `
          <video src="${m.src}" controls poster="${m.thumbnail}" class="scene-video"></video>
        `
        )
        .join("")}
    </div>
  `;
}
