"use client";
import { useState } from "react";
import Timeline from "../../components/Timeline";
import MainPreview from "../../components/MainPreview";
import { searchMedia } from "../../utils/pexelsApi";

export default function EditorPage() {
  const [idea, setIdea] = useState("");
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "https://magistory-app-production.up.railway.app";

  async function generate() {
    if (!idea) return alert("Masukkan ide dulu!");
    setLoading(true);
    try {
      const r = await fetch(`${backend}/api/generate-script`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ide: idea, durasi_total: 60, style: "Edukasi" }),
      });
      const data = await r.json();

      const enriched = await Promise.all(
        data.adegan.map(async a => ({
          ...a,
          media: (await searchMedia(a.kata_kunci_video?.[0] || "nature", 1)) || [],
        }))
      );

      setScript({ ...data, adegan: enriched });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {!script ? (
        <div className="max-w-md bg-white shadow-lg p-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">Magistory Editor</h1>
          <input
            className="border p-3 w-full rounded-lg mb-3"
            placeholder="Masukkan ide video..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <button
            onClick={generate}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-3 rounded-lg"
          >
            {loading ? "⏳ Menghasilkan..." : "✨ Generate Script"}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          <MainPreview scriptData={script} backendURL={backend} />
          <Timeline scriptData={script} />
        </div>
      )}
    </main>
  );
}
