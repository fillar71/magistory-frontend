"use client";
import { useState } from "react";
import Timeline from "../../components/Timeline";
import { searchMedia } from "../../utils/pexelsApi";

export default function EditorPage() {
  const [idea, setIdea] = useState("");
  const [duration, setDuration] = useState(30);
  const [aspect, setAspect] = useState("16:9");
  const [style, setStyle] = useState("Edukasi");
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://magistory-app-production.up.railway.app";

  async function handleGenerate() {
    if (!idea) return alert("Masukkan ide video dulu!");

    setLoading(true);
    setError(null);
    try {
    
      const res = await fetch(`${backendURL}/api/generate-script`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",      // 🧠 cegah cache di network
    Pragma: "no-cache",               // 🧠 cegah cache di HTTP 1.0
  },
  body: JSON.stringify({
    ide: idea,
    durasi_total: duration,
    aspect_ratio: aspect,
    style: style,
  }),
  cache: "no-store",                  // 🚫 cegah cache di Next.js/fetch
});
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // ambil media dari pexels
      const enriched = await Promise.all(
        data.adegan.map(async (sc) => {
          const visuals = await Promise.all(
            sc.deskripsi_visual.map((kw) => searchMedia(kw, 1))
          );
          return { ...sc, media: visuals.flat() };
        })
      );

      setScript({ ...data, adegan: enriched });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      {!script ? (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h1 className="text-3xl font-bold text-center text-blue-700">
            Magistory Editor
          </h1>
          {error && <p className="text-red-600">{error}</p>}
          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Masukkan ide video..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Menghasilkan..." : "✨ Generate Script"}
          </button>
        </div>
      ) : (
        <Timeline
          scriptData={script}
          onSave={(d) => console.log("Disimpan:", d)}
          onRender={() => alert("Render Coming Soon")}
        />
      )}
    </main>
  );
}
