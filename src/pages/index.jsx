// src/pages/index.jsx
import { useState } from "react";
import Timeline from "../components/Timeline";
import { searchMedia } from "../utils/pexelsApi";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [duration, setDuration] = useState(30);
  const [aspect, setAspect] = useState("16:9");
  const [style, setStyle] = useState("Edukasi");
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch("https://magistory-app-production.up.railway.app/api/generate-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, duration, aspectRatio: aspect, style }),
    });
    const data = await res.json();

    // tambahkan media otomatis dari Pexels
    const enrichedScenes = await Promise.all(
      data.adegan.map(async (scene) => {
        const visuals = await Promise.all(scene.deskripsi_visual.map((kw) => searchMedia(kw, 1)));
        return { ...scene, media: visuals.flat() };
      })
    );

    setScript({ ...data, adegan: enrichedScenes });
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {!script ? (
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-3xl font-bold text-center">Magistory Instant Video</h1>
          <input className="border p-2 rounded w-full" placeholder="Masukkan ide video..." value={idea} onChange={(e) => setIdea(e.target.value)} />
          <input className="border p-2 rounded w-full" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Durasi (detik)" />
          <input className="border p-2 rounded w-full" value={aspect} onChange={(e) => setAspect(e.target.value)} placeholder="Aspect Ratio (misal 16:9)" />
          <input className="border p-2 rounded w-full" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Gaya video (edukatif, cinematic...)" />
          <button onClick={handleGenerate} disabled={loading} className="bg-blue-600 text-white w-full py-2 rounded-lg">
            {loading ? "Menghasilkan..." : "Generate"}
          </button>
        </div>
      ) : (
        <Timeline
          scriptData={script}
          onSave={(data) => console.log("Save Project:", data)}
          onRender={() => alert("Render popup akan muncul di versi berikutnya")}
        />
      )}
    </div>
  );
}
