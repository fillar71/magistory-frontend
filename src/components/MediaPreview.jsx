"use client";
import { useState, useRef, useEffect } from "react";

export default function MediaPreview({ media }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef(null);

  if (!media || media.length === 0) {
    return (
      <div className="text-gray-500 italic text-center py-2">
        Tidak ada media ditemukan.
      </div>
    );
  }

  const current = media[activeIndex];

  // Otomatis play video ketika berubah
  useEffect(() => {
    if (videoRef.current && current?.type === "video") {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-100">
      {/* 🎥 Media Aktif */}
      <div className="relative aspect-video bg-black">
        {current?.type === "video" ? (
          <video
            ref={videoRef}
            src={current.src}
            className="w-full h-full object-cover"
            muted
            controls
          />
        ) : (
          <img
            src={current.thumbnail || current.src}
            alt="media-preview"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 📸 Thumbnail Carousel */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-gray-200">
        {media.map((clip, idx) => (
          <img
            key={idx}
            src={clip.thumbnail || clip.src}
            alt={`thumb-${idx}`}
            onClick={() => setActiveIndex(idx)}
            className={`w-20 h-14 rounded-md cursor-pointer object-cover transition-all ${
              idx === activeIndex
                ? "ring-2 ring-blue-600 scale-105"
                : "opacity-80 hover:opacity-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
