// src/components/ImageUpload.tsx
"use client";

import React, { useState } from "react";

export interface ImageUploadProps {
  folder: "banners" | "candle-templates" | "candles" | "categories" | "hero-popup" | "offers" | "promotions";
  currentImageUrl?: string;
  onUploadComplete?: (result: { url: string }) => void; // ✅ ahora acepta esta prop
}

const ImageUpload: React.FC<ImageUploadProps> = ({ folder, currentImageUrl, onUploadComplete }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setLoading(true);

    try {
      // 🔹 Aquí deberías integrar Firebase, Supabase o tu backend.
      // Por ahora simulamos con un "upload" local:
      const uploadedUrl = URL.createObjectURL(file);

      setPreviewUrl(uploadedUrl);

      // ✅ disparamos el callback si existe
      if (onUploadComplete) {
        onUploadComplete({ url: uploadedUrl });
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Vista previa"
          className="w-32 h-32 object-cover rounded border"
        />
      )}

      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
        {loading ? "Subiendo..." : "Subir imagen"}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
        />
      </label>
    </div>
  );
};

export default ImageUpload;