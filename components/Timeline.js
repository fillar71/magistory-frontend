import { renderMediaPreview } from "./MediaPreview.js";

export function renderTimeline(scriptData) {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = `
    <h2>${scriptData.judul}</h2>
    ${scriptData.adegan
      .map(
        (scene) => `
      <div class="scene">
        <h3>Adegan ${scene.nomor_adegan}</h3>
        <p><strong>Durasi:</strong> ${scene.durasi}</p>
        <p><strong>Narasi:</strong> ${scene.narasi}</p>
        <div id="media-${scene.nomor_adegan}"></div>
      </div>
    `
      )
      .join("")}
  `;

  scriptData.adegan.forEach((scene) => {
    renderMediaPreview(scene.media, `media-${scene.nomor_adegan}`);
  });
}
