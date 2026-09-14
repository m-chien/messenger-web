"use client";

import { X } from "lucide-react";

interface ImagePreviewModalProps {
  src: string | null;
  onClose: () => void;
}

export function ImagePreviewModal({ src, onClose }: ImagePreviewModalProps) {
  if (!src) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
      >
        <X size={24} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl"
      >
        <img
          src={src}
          alt="Preview"
          className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
        />
      </div>
    </div>
  );
}

export default ImagePreviewModal;
