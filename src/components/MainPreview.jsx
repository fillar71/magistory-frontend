"use client";
import { useState, useRef } from "react";

export default function MainPreview({ scriptData, backendURL }) {
  const [isRendering, setIsRendering] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef();

  async function handleRender() {
    setIsRendering(true);
    try {
      const res = await fetch(`${backendURL}/api/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scriptData),
      });
      if (!res.ok) throw new Error("Gagal merender video.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
    } catch (e) {
      alert(e.message);
    } finally {
      setIsRendering(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-3">🎥 Pratinjau Utama</h2>
      {videoURL ? (
        <video ref={videoRef} controls className="w-full rounded-lg" src={videoURL}></video>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
          Belum ada hasil render
        </div>
      )}
      <button
        onClick={handleRender}
        disabled={isRendering}
        className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg"
      >
        {isRendering ? "⏳ Merender..." : "🚀 Render Video"}
      </button>
    </div>
  );
}
