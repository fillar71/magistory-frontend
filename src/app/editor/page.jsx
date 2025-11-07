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
}
  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://magistory-app-production.up.railway.app";

  async function handleGenerate() {
  if (!idea) {
    alert("Masukkan ide video terlebih dahulu!");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    // ✅ Wake up Railway server
    await fetch(`${backendURL}/ping`).catch(() => {});

    // ✅ Request ke backend
    const res = await fetch(`${backendURL}/api/generate-script`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ide: idea,
        durasi_total: duration,
        aspect_ratio: aspect,
        style: style,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Gagal generate script (status ${res.status}): ${msg}`);
    }

    const data = await res.json();
    if (!data.adegan || !Array.isArray(data.adegan)) {
      throw new Error("Format respons dari server tidak sesuai.");
    }

    const enrichedScenes = await Promise.all(
      data.adegan.map(async (scene) => {
        if (!scene.deskripsi_visual) return { ...scene, media: [] };
        const visuals = await Promise.all(
          scene.deskripsi_visual.map((kw) => searchMedia(kw, 1))
        );
        return { ...scene, media: visuals.flat() };
      })
    );

    setScript({ ...data, adegan: enrichedScenes });
  } catch (err) {
    console.error("🔥 Error:", err);
    setError(err.message || "Terjadi kesalahan di sisi frontend.");
  } finally {
    setLoading(false);
  }
  }
