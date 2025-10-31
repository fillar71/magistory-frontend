const API_URL = "https://magistory-app-production.up.railway.app";

// Sembunyikan modal render saat awal
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

  data.adegan.forEach((a) => {
    const div = document.createElement("div");
    div.className = "adegan";
    div.draggable = true;
    div.innerHTML = `
      <h3>Adegan ${a.nomor_adegan} (${a.durasi})</h3>
      <p><b>Visual:</b> ${a.deskripsi_visual.join(", ")}</p>
      <div class="duration-control">
        <label>Durasi (detik): </label>
        <input type="number" min="1" max="30" value="5" class="durasiInput" />
      </div>
      <textarea>${a.narasi}</textarea>
    `;
    list.appendChild(div);
  });

  enableDragSort();
};

// 🔹 Fitur drag & drop urutan adegan
function enableDragSort() {
  const list = document.querySelector(".timeline-list");
  let dragItem = null;

  list.querySelectorAll(".adegan").forEach((item) => {
    item.addEventListener("dragstart", () => {
      dragItem = item;
      item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      dragItem = null;
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingOver = e.target.closest(".adegan");
      if (draggingOver && draggingOver !== dragItem) {
        list.insertBefore(dragItem, draggingOver.nextSibling);
      }
    });
  });
}

// 🔹 Simpan project
document.getElementById("saveProjectBtn").onclick = async () => {
  const project = {
    judul: document.getElementById("judulVideo").textContent,
    adegan: Array.from(document.querySelectorAll(".adegan")).map((div, index) => ({
      nomor_adegan: index + 1,
      durasi: div.querySelector(".durasiInput").value,
      narasi: div.querySelector("textarea").value,
    })),
  };

  const res = await fetch(`${API_URL}/api/save-project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });

  const data = await res.json();
  if (data.success) alert("✅ Project berhasil disimpan!");
  else alert("❌ Gagal menyimpan project.");
};

// 🔹 Popup Render
const modal = document.getElementById("renderModal");
const renderBtn = document.getElementById("renderBtn");
const cancelBtn = document.getElementById("renderCancelBtn");
const renderNowBtn = document.getElementById("renderNowBtn");
const statusBox = document.getElementById("renderStatus");

renderBtn.onclick = () => modal.classList.remove("hidden");
cancelBtn.onclick = () => modal.classList.add("hidden");

renderNowBtn.onclick = () => {
  const resolution = document.getElementById("renderResolution").value;
  statusBox.textContent = `Rendering video (${resolution})...`;
  setTimeout(() => {
    statusBox.textContent = "✅ Render selesai (simulasi)";
  }, 2000);
};
