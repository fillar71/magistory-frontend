const API_URL = "https://magistory-app-production.up.railway.app";

// pastikan modal hidden saat load
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("renderModal")?.classList.add("hidden");
});

document.getElementById("generateBtn").onclick = async () => {
  const idea = document.getElementById("idea").value;
  const duration = document.getElementById("duration").value;
  const aspectRatio = document.getElementById("aspect").value;
  const style = document.getElementById("style").value;

  const res = await fetch(`${API_URL}/api/generate-script`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, duration, aspectRatio, style }),
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  document.getElementById("timeline").classList.remove("hidden");
  document.getElementById("judulVideo").textContent = data.judul;

  const list = document.getElementById("adeganList");
  list.innerHTML = "";

  for (const a of data.adegan) {
    const div = document.createElement("div");
    div.className = "adegan";
    div.innerHTML = `
      <h3>Adegan ${a.nomor_adegan} (${a.durasi})</h3>
      <p><b>Visual:</b> ${a.deskripsi_visual.join(", ")}</p>
      <textarea>${a.narasi}</textarea>
    `;
    list.appendChild(div);
  }
};

// tombol render
const renderBtn = document.getElementById("renderBtn");
const modal = document.getElementById("renderModal");
const cancelBtn = document.getElementById("renderCancelBtn");
const renderNowBtn = document.getElementById("renderNowBtn");
const statusBox = document.getElementById("renderStatus");

renderBtn.onclick = () => modal.classList.remove("hidden");
cancelBtn.onclick = () => modal.classList.add("hidden");

renderNowBtn.onclick = () => {
  const resolution = document.getElementById("renderResolution").value;
  statusBox.textContent = `Rendering video (${resolution})...`;
  setTimeout(() => {
    statusBox.textContent = "✅ Render selesai (simulasi).";
  }, 2000);
};
