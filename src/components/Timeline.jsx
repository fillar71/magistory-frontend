// src/components/Timeline.jsx
import MediaPreview from "./MediaPreview";
import SceneEditor from "./SceneEditor";

export default function Timeline({ scriptData, onSave, onRender }) {
  const handleSceneUpdate = (updatedScene) => {
    const updatedScenes = scriptData.adegan.map((s) =>
      s.nomor_adegan === updatedScene.nomor_adegan ? updatedScene : s
    );
    onSave({ ...scriptData, adegan: updatedScenes });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-center text-2xl font-bold mb-4">{scriptData.judul}</h2>
      <MediaPreview scenes={scriptData.adegan} />
      {scriptData.adegan.map((scene) => (
        <SceneEditor key={scene.nomor_adegan} scene={scene} onUpdate={handleSceneUpdate} />
      ))}
      <div className="flex justify-between mt-4">
        <button onClick={() => onSave(scriptData)} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow">
          💾 Save Project
        </button>
        <button onClick={onRender} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
          🎬 Render
        </button>
      </div>
    </div>
  );
}
