import ClipUploader from "../../components/clips/ClipUploader";

export default function UploadClip() {
  const handleUploaded = () => {
    alert("Clip subido correctamente.");
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-6">Subir nuevo Clip</h1>

        <ClipUploader onUploaded={handleUploaded} />
      </div>
    </div>
  );
}
