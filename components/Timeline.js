// components/Timeline.js
import { renderMediaPreview } from "./MediaPreview.js";
import { renderMainPreview } from "./MainPreview.js";

export function renderTimeline(scriptData) {
  const timeline = document.getElementById("timeline");

  timeline.innerHTML = `
    <div id="main-preview-container"></div>
    <h2 style="text-align:center;margin:20px 0;">${scriptData.judul}</h2>
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

  // Pratinjau utama (dengan progress dan thumbnail)
  renderMainPreview(scriptData.adegan, "main-preview-container");

  // Pratinjau per adegan
  scriptData.adegan.forEach((scene) => {
    renderMediaPreview(scene.media, `media-${scene.nomor_adegan}`);
  });
}
