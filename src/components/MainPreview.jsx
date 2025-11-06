"use client";
import { useState, useEffect, useRef } from "react";

export default function MainPreview({ scriptData }) {
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const scenes = scriptData?.adegan || [];

  // Gabungkan semua media dari setiap adegan
  const allClips = scenes.flatMap((scene) => scene.media || []);
  const totalClips = allClips.length;
  const currentClip = allClips[currentClipIndex];

  // Hitung progress
  const progress = ((currentClipIndex + 1) / totalClips) * 100;

  // Mainkan otomatis saat klip berubah
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.load();
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentClipIndex, isPlaying]);

  // Fungsi next clip
  const nextClip = () => {
    if (currentClipIndex < totalClips - 1) {
      setCurrentClipIndex(currentClipIndex + 1);
    } else {
      setCurrentClipIndex(0); // ulang dari awal
    }
  };

  // Jika video selesai, lanjut ke klip berikut
  const handleEnded = () => {
    if (isPlaying) nextClip();
  };

  // Fungsi play/pause
  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-center mb-3">
        🎬 Pratinjau Video Utama
      </h2>

      <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-3">
        {currentClip ? (
          currentClip.type === "video" ? (
            <video
              ref={videoRef}
              src={currentClip.src}
              className="w-full h-full object-cover"
              onEnded={handleEnded}
              controls={false}
              muted
              autoPlay
            />
          ) : (
            <img
              src={currentClip.thumbnail || currentClip.src}
              alt="preview"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex items-center justify-center text-gray-400 h-full">
            Tidak ada media untuk diputar
          </div>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full bg-gray-700 h-2">
          <div
            className="bg-blue-500 h-2 transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Tombol kontrol */}
      <div className="flex justify-center gap-4 mt-2">
        <button
          onClick={() =>
            setCurrentClipIndex(
              currentClipIndex > 0 ? currentClipIndex - 1 : totalClips - 1
            )
          }
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          ⏮️ Sebelumnya
        </button>

        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg text-white ${
            isPlaying ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {isPlaying ? "⏸️ Pause" : "▶️ Play"}
        </button>

        <button
          onClick={nextClip}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          ⏭️ Berikutnya
        </button>
      </div>

      {/* Thumbnail navigator */}
      <div className="flex overflow-x-auto gap-2 mt-4">
        {allClips.map((clip, idx) => (
          <img
            key={idx}
            src={clip.thumbnail || clip.src}
            alt={`clip-${idx}`}
            className={`w-20 h-14 object-cover cursor-pointer rounded-md ${
              idx === currentClipIndex ? "ring-2 ring-blue-600" : ""
            }`}
            onClick={() => setCurrentClipIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
          }
