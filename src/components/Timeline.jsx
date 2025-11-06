"use client";
import { useState } from "react";
import MediaPreview from "./MediaPreview.jsx";
import MainPreview from "./MainPreview.jsx";

export default function Timeline({ scriptData, onSave, onRender }) {
  const [selectedScene, setSelectedScene] = useState(0);

  const scenes = scriptData?.adegan || [];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🎞️ Timeline Project
      </h1>

      {/* 🟢 Pratinjau Utama */}
      <MainPreview scriptData={scriptData} />

      {/* 🧩 Daftar Adegan */}
      <div className="mt-6 space-y-4">
        {scenes.map((scene, index) => (
          <div
            key={index}
            className={`border p-4 rounded-lg cursor-pointer ${
              index === selectedScene
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setSelectedScene(index)}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                Adegan {scene.nomor_adegan || index + 1}
              </h2>
              <p className="text-sm text-gray-500">{scene.durasi}</p>
            </div>

            <p className="text-sm text-gray-700 mb-3">
              {scene.narasi || "Narasi tidak tersedia"}
            </p>

            {/* 🔹 Pratinjau Media Tiap Adegan */}
            <MediaPreview media={scene.media || []} />
          </div>
        ))}
      </div>

      {/* 🧰 Tombol Aksi */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => onSave(scriptData)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          💾 Simpan Project
        </button>

        <button
          onClick={onRender}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          🎬 Render Video
        </button>
      </div>
    </div>
  );
}
