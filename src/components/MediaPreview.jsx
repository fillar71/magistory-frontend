// src/components/MediaPreview.jsx
import { useState, useEffect } from "react";

export default function MediaPreview({ scenes }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!scenes?.length) return;
    const totalClips = scenes.flatMap((s) => s.media || []);
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalClips.length);
    }, 5000); // 5 detik per klip
    return () => clearInterval(interval);
  }, [scenes]);

  if (!scenes?.length) return <p>Tidak ada media.</p>;

  const clips = scenes.flatMap((s) => s.media || []);
  const currentClip = clips[index];

  return (
    <div className="w-full flex flex-col items-center p-4">
      {currentClip?.type === "image" && (
        <img
          src={currentClip.src}
          alt="preview"
          className="rounded-2xl shadow-md w-full max-w-lg object-cover"
        />
      )}
      <p className="mt-2 text-sm text-gray-600 text-center">
        {currentClip?.narasi || ""}
      </p>
    </div>
  );
}
