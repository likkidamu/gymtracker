'use client';

import { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface ImageUploadProps {
  image: string | null;
  isProcessing: boolean;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  error?: string | null;
}

export function ImageUpload({ image, isProcessing, onFileSelect, onClear, error }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (isProcessing) {
    return (
      <div className="bg-zinc-800 border border-card-border rounded-2xl p-8">
        <LoadingSpinner text="Processing image..." />
      </div>
    );
  }

  if (image) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-card-border">
        <img src={image} alt="Upload preview" className="w-full max-h-64 object-cover" />
        <button
          onClick={onClear}
          className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-colors
        ${isDragging ? 'border-accent bg-accent/5' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800/50'}`}
    >
      <div className="flex gap-3">
        <div className="p-3 rounded-xl bg-zinc-700">
          <Upload size={24} className="text-muted" />
        </div>
        <div className="p-3 rounded-xl bg-zinc-700">
          <Camera size={24} className="text-muted" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Upload or take a photo</p>
        <p className="text-xs text-muted mt-1">Drag & drop or tap to select</p>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
