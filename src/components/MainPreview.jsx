"use client";
import { useEffect, useRef, useState } from "react";

/**
 * 🎬 MainPreview
 * - Menampilkan seluruh adegan secara berurutan
 * - Menghitung total durasi semua klip
 * - User bisa memotong video (trim)
 */
export default function MainPreview({ scenes }) {
  const videoRef = useRef(null);
  const [clips, setClips] = useState([]);
  const [currentClip, setCurrentClip] = useState(0);
  const [trimRanges, setTrimRanges] = useState({}); // { index: {start, end} }

  // Hitung total durasi dari semua klip
  const totalDuration = scenes?.reduce(
    (acc, sc) => acc + (sc?.media?.[0]?.duration || 0),
    0
  );

  useEffect(() => {
    // Ambil URL media utama dari tiap adegan
    if (scenes && scenes.length > 0) {
      const urls = scenes
        .map((s) => s.media?.[0]?.video_files?.[0]?.link)
        .filter(Boolean);
      setClips(urls);
    }
  }, [scenes]);

  // Saat video satu selesai, lanjut ke klip berikutnya
  const handleEnded = () => {
    if (currentClip < clips.length - 1) {
      setCurrentClip((prev) => prev + 1);
    } else {
      setCurrentClip(0); // ulang dari awal
    }
  };

  // Handle perubahan trim (start / end)
  const handleTrimChange = (index, field, value) => {
    setTrimRanges((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: Number(value),
      },
    }));
  };

  const currentTrim = trimRanges[currentClip] || { start: 0, end: null };

  // Atur waktu awal ketika video berubah
  useEffect(() => {
    const video = videoRef.current;
    if (video && currentTrim.start > 0) {
      video.currentTime = currentTrim.start;
    }
  }, [currentClip]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const { end } = currentTrim;
    if (end && video.currentTime >= end) {
      handleEnded();
    }
  };

  return (
    <div className="w-full bg-black text-white rounded-xl shadow-lg p-4 space-y-3">
      <h2 className="text-lg font-semibold text-center mb-2">
        🎥 Pratinjau Media Utama
      </h2>

      {clips.length === 0 ? (
        <p className="text-center text-gray-400">Belum ada media untuk diputar</p>
      ) : (
        <div className="flex flex-col items-center">
          <video
            ref={videoRef}
            key={clips[currentClip]}
            src={clips[currentClip]}
            controls
            autoPlay
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            className="w-full max-w-3xl rounded-lg"
          />

          {/* Pengaturan trim */}
          <div className="mt-3 flex flex-col md:flex-row items-center justify-center gap-2">
            <label className="text-sm">
              Mulai (detik):
              <input
                type="number"
                min="0"
                className="ml-2 w-16 text-black p-1 rounded"
                value={currentTrim.start || 0}
                onChange={(e) =>
                  handleTrimChange(currentClip, "start", e.target.value)
                }
              />
            </label>

            <label className="text-sm">
              Selesai (detik):
              <input
                type="number"
                min="0"
                className="ml-2 w-16 text-black p-1 rounded"
                value={currentTrim.end || ""}
                onChange={(e) =>
                  handleTrimChange(currentClip, "end", e.target.value)
                }
              />
            </label>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Klip ke-{currentClip + 1} dari {clips.length} |
            Total durasi: {Math.round(totalDuration)} detik
          </p>
        </div>
      )}
    </div>
  );
}
