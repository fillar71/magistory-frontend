// src/components/SceneEditor.jsx
import { useState } from "react";

export default function SceneEditor({ scene, onUpdate }) {
  const [localScene, setLocalScene] = useState(scene);

  const handleMediaChange = (index, file) => {
    const updatedMedia = [...localScene.media];
    updatedMedia[index] = {
      type: "image",
      src: URL.createObjectURL(file),
      narasi: updatedMedia[index]?.narasi || "",
    };
    const updated = { ...localScene, media: updatedMedia };
    setLocalScene(updated);
    onUpdate(updated);
  };

  const handleNarrationChange = (value) => {
    const updated = { ...localScene, narasi: value };
    setLocalScene(updated);
    onUpdate(updated);
  };

  return (
    <div className="border p-4 rounded-xl mb-6 shadow-sm">
      <h3 className="font-bold text-lg mb-2">Adegan {scene.nomor_adegan}</h3>
      <div className="flex flex-wrap gap-2">
        {localScene.media.map((m, i) => (
          <div key={i} className="relative">
            <img src={m.src} alt="media" className="w-32 h-32 object-cover rounded-lg" />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handleMediaChange(i, e.target.files[0])}
              className="absolute bottom-1 left-1 bg-white rounded text-xs p-1"
            />
          </div>
        ))}
      </div>
      <textarea
        value={localScene.narasi}
        onChange={(e) => handleNarrationChange(e.target.value)}
        className="w-full mt-2 p-2 rounded-lg border"
        placeholder="Edit narasi adegan ini..."
      />
    </div>
  );
}
