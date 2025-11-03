import { renderTimeline } from "./components/Timeline.js";

const backendURL = "https://magistory-app-production.up.railway.app";

document.getElementById("generateBtn").addEventListener("click", async () => {
  const idea = document.getElementById("idea").value.trim();
  if (!idea) return alert("Masukkan ide terlebih dahulu!");

  const res = await fetch(`${backendURL}/api/generate-script`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea }),
  });

  const data = await res.json();

  if (data.error) return alert(data.error);
  console.log("🎬 Script:", data);

  // Ambil video dari Pexels berdasarkan deskripsi_visual
  const keywords = data.adegan.flatMap((a) => a.deskripsi_visual);
  const videoRes = await fetch(`${backendURL}/api/get-videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keywords }),
  });
  const videoData = await videoRes.json();

  if (videoData.error) return alert(videoData.error);
  console.log("🎥 Video:", videoData.videos);

  // Gabungkan video ke dalam adegan
  data.adegan = data.adegan.map((a) => ({
    ...a,
    media: videoData.videos.filter((v) => a.deskripsi_visual.includes(v.keyword)),
  }));

  renderTimeline(data);
});
