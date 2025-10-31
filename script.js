// GANTI INI ke URL backend Railway mu
const API_BASE = "https://magistory-app-production.up.railway.app";

const ideaInput = document.getElementById("ideaInput");
const durationInput = document.getElementById("durationInput");
const aspectInput = document.getElementById("aspectInput");
const styleInput = document.getElementById("styleInput");
const generateBtn = document.getElementById("generateBtn");

const timelineSection = document.getElementById("timelineSection");
const videoTitle = document.getElementById("videoTitle");
const adeganList = document.getElementById("adeganList");
const previewMedia = document.getElementById("previewMedia");

const saveProjectBtn = document.getElementById("saveProjectBtn");
const renderBtn = document.getElementById("renderBtn");

const renderModal = document.getElementById("renderModal");
const renderResolution = document.getElementById("renderResolution");
const renderNowBtn = document.getElementById("renderNowBtn");
const renderCancelBtn = document.getElementById("renderCancelBtn");
const renderStatus = document.getElementById("renderStatus");

let currentProject = { id: null, judul: "", adegan: [] };

// helper: POST JSON
async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}

// Generate flow
generateBtn.addEventListener("click", async () => {
  const idea = ideaInput.value.trim();
  if (!idea) return alert("Masukkan ide video.");

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";

  const payload = {
    idea,
    duration: durationInput.value || "60",
    aspectRatio: aspectInput.value || "16:9",
    style: styleInput.value || "edukatif"
  };

  try {
    const data = await postJSON(`${API_BASE}/api/generate-script`, payload);

    if (data.error) {
      console.error("generate error:", data);
      alert("Generate gagal: " + (data.error || data.detail || JSON.stringify(data)));
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate";
      return;
    }

    // expected response: { id, judul, adegan: [...] }
    currentProject.id = data.id || null;
    currentProject.judul = data.judul || payload.idea;
    currentProject.adegan = data.adegan || [];

    renderTimeline(currentProject);
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat generate.");
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate";
  }
});

function renderTimeline(project) {
  timelineSection.classList.remove("hidden");
  videoTitle.textContent = project.judul || "Untitled";
  adeganList.innerHTML = "";
  previewMedia.innerHTML = "";

  // Build preview: show all first clips (by default first clip of each adegan)
  project.adegan.forEach((a, idx) => {
    const div = document.createElement("div");
    div.className = "adegan";
    div.dataset.index = idx;

    const meta = document.createElement("div");
    meta.className = "meta";

    const h = document.createElement("h3");
    h.textContent = `Adegan ${a.nomor_adegan}  (${a.durasi})`;
    meta.appendChild(h);

    const visual = document.createElement("p");
    visual.innerHTML = `<b>Visual:</b> ${Array.isArray(a.deskripsi_visual) ? a.deskripsi_visual.join(", ") : a.deskripsi_visual}`;
    meta.appendChild(visual);

    const ta = document.createElement("textarea");
    ta.value = a.narasi || "";
    ta.addEventListener("input", (e) => {
      project.adegan[idx].narasi = e.target.value;
    });
    meta.appendChild(ta);

    // controls: duration per-clip (seconds) and upload/replace
    const controls = document.createElement("div");
    controls.className = "adegan-controls";

    const durLabel = document.createElement("label");
    durLabel.innerHTML = `Default clip(s) durasi (s): <input class="small-input" type="number" min="1" value="5" data-idx="${idx}">`;
    controls.appendChild(durLabel);

    const replaceBtn = document.createElement("button");
    replaceBtn.textContent = "Ganti Media / Cari Stok";
    replaceBtn.addEventListener("click", () => openReplaceDialog(idx));
    controls.appendChild(replaceBtn);

    // preview container
    const previewContainer = document.createElement("div");
    previewContainer.className = "preview-container";

    div.appendChild(meta);
    div.appendChild(controls);
    div.appendChild(previewContainer);

    adeganList.appendChild(div);

    // load preview media (Pexels) for this adegan
    loadPreviewForAdegan(a, previewContainer);
  });

  // Build global preview (carousel) showing first media per adegan
  buildGlobalPreview(project.adegan);
}

// load preview from backend/pexels
async function loadPreviewForAdegan(adegan, container) {
  container.innerHTML = "Mencari media...";
  const query = Array.isArray(adegan.deskripsi_visual) ? adegan.deskripsi_visual.join(" ") : adegan.deskripsi_visual;
  try {
    const res = await postJSON(`${API_BASE}/api/get-videos`, { query });
    container.innerHTML = "";
    const clips = document.createElement("div");
    clips.className = "preview-clips";
    if (res.videos && res.videos.length) {
      res.videos.slice(0,5).forEach(v => {
        if (v.url && v.url.endsWith(".mp4")) {
          const video = document.createElement("video");
          video.src = v.url;
          video.controls = true;
          video.width = 160;
          clips.appendChild(video);
        } else {
          const img = document.createElement("img");
          img.src = v.thumbnail || "";
          clips.appendChild(img);
        }
      });
      container.appendChild(clips);
    } else {
      container.textContent = "Tidak ada stok media ditemukan.";
    }
  } catch (err) {
    console.error("preview error", err);
    container.textContent = "Gagal memuat preview.";
  }
}

function buildGlobalPreview(adeganArr) {
  previewMedia.innerHTML = "";
  const gallery = document.createElement("div");
  gallery.className = "preview-clips";
  adeganArr.forEach((a, idx) => {
    const card = document.createElement("div");
    card.style.textAlign = "center";
    card.style.minWidth = "140px";
    card.style.marginRight = "8px";
    const label = document.createElement("div");
    label.style.fontSize = "12px";
    label.style.color = "#333";
    label.textContent = `Adegan ${a.nomor_adegan}`;
    const thumb = document.createElement("div");
    thumb.style.width = "140px";
    thumb.style.height = "80px";
    thumb.style.background = "#eee";
    thumb.style.borderRadius = "6px";
    thumb.style.display = "flex";
    thumb.style.alignItems = "center";
    thumb.style.justifyContent = "center";
    thumb.textContent = (a.deskripsi_visual && a.deskripsi_visual[0]) || "No media";
    card.appendChild(thumb);
    card.appendChild(label);
    gallery.appendChild(card);
  });
  previewMedia.appendChild(gallery);
}

// Replace dialog (upload local or search)
function openReplaceDialog(idx) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "video/*,image/*";
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // replace by creating objectURL and show in adegan preview
    const url = URL.createObjectURL(file);
    // Find preview container and append
    const adeganDiv = adeganList.querySelector(`.adegan[data-index="${idx}"]`);
    const previewContainer = adeganDiv.querySelector(".preview-container");
    previewContainer.innerHTML = "";
    if (file.type.startsWith("video")) {
      const v = document.createElement("video");
      v.src = url;
      v.controls = true;
      v.width = 320;
      previewContainer.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = url;
      img.style.width = "320px";
      previewContainer.appendChild(img);
    }
    // mark project to use local override
    currentProject.adegan[idx].localMedia = { url, name: file.name, type: file.type };
  };
  fileInput.click();
}

// Save project to backend
saveProjectBtn.addEventListener("click", async () => {
  const project = {
    id: currentProject.id || null,
    judul: videoTitle.textContent,
    adegan: currentProject.adegan
  };
  try {
    const res = await postJSON(`${API_BASE}/api/save-project`, project);
    if (res.ok) {
      alert("Project saved. ID: " + (res.id || project.id));
      currentProject.id = res.id || project.id;
    } else {
      alert("Save failed");
    }
  } catch (err) {
    console.error(err);
    alert("Save error");
  }
});

// Render modal open
renderBtn.addEventListener("click", () => {
  renderModal.classList.remove("hidden");
  renderStatus.innerHTML = "";
});

// Cancel render modal
renderCancelBtn.addEventListener("click", () => renderModal.classList.add("hidden"));

// Render now -> call /api/render
renderNowBtn.addEventListener("click", async () => {
  if (!currentProject.id) {
    alert("Simpan project dulu sebelum render.");
    return;
  }
  renderNowBtn.disabled = true;
  renderStatus.textContent = "Mengantri render...";
  try {
    const res = await postJSON(`${API_BASE}/api/render`, { projectId: currentProject.id, resolution: renderResolution.value });
    if (res.jobId) {
      renderStatus.textContent = `Job queued: ${res.jobId}. Mengecek status...`;
      // poll
      const poll = setInterval(async () => {
        const s = await (await fetch(`${API_BASE}/api/render-status/${res.jobId}`)).json();
        renderStatus.textContent = `Status: ${s.status}`;
        if (s.status === "completed") {
          clearInterval(poll);
          renderStatus.innerHTML = `Selesai. Download: <a href="${s.outputUrl}" target="_blank">${s.outputUrl}</a>`;
          renderNowBtn.disabled = false;
        }
      }, 2000);
    } else {
      renderStatus.textContent = "Render request failed.";
      renderNowBtn.disabled = false;
    }
  } catch (err) {
    console.error(err);
    renderStatus.textContent = "Render error";
    renderNowBtn.disabled = false;
  }
});
