"use client";
import { motion } from "framer-motion";
import MediaPreview from "./MediaPreview.jsx";

export default function Timeline({ scriptData, onSave, onRender }) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6 p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {scriptData.judul}
      </h2>
      {scriptData.adegan.map((scene) => (
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-xl p-4 mb-4 bg-gray-50"
        >
          <p className="font-semibold mb-1">🎬 Adegan {scene.id}</p>
          <p className="text-sm text-gray-600 mb-1">Durasi: {scene.durasi}</p>
          <p className="mb-2">{scene.narasi}</p>
          <MediaPreview media={scene.media || []} />
        </motion.div>
      ))}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => onSave(scriptData)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          💾 Simpan
        </button>
        <button
          onClick={onRender}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          🎬 Render
        </button>
      </div>
    </div>
  );
}
