export function renderMediaPreview(mediaList, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="media-grid">
      ${mediaList
        .map(
          (m) => `
        <video src="${m.src}" controls poster="${m.thumbnail}"></video>
      `
        )
        .join("")}
    </div>
  `;
}
