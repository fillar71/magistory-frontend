import MainPreview from "./MainPreview";

export default function Timeline({ scriptData, onSave, onRender }) {
  const { adegan } = scriptData;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {adegan.map((scene, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-blue-600 mb-2">
              Adegan {i + 1}
            </h3>
            <p className="text-sm mb-1">{scene.narasi}</p>
            <div className="flex gap-2 overflow-x-auto">
              {scene.media?.map((m, idx) => (
                <video
                  key={idx}
                  src={m.video_files?.[0]?.link}
                  className="w-32 h-20 object-cover rounded"
                  controls
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🎬 Tambahkan pratinjau utama */}
      <MainPreview scenes={adegan} />

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => onSave(scriptData)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          💾 Simpan
        </button>

        <button
          onClick={onRender}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          🎬 Render
        </button>
      </div>
    </div>
  );
}
