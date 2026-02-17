'use client';

import { useState, useCallback } from 'react';
import { compressImage, createThumbnail } from '@/lib/utils/image';

interface UseImageUploadReturn {
  image: string | null;
  thumbnail: string | null;
  isProcessing: boolean;
  error: string | null;
  handleFileSelect: (file: File) => Promise<void>;
  reset: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [image, setImage] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const [compressed, thumb] = await Promise.all([
        compressImage(file),
        createThumbnail(file),
      ]);
      setImage(compressed);
      setThumbnail(thumb);
    } catch {
      setError('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setImage(null);
    setThumbnail(null);
    setError(null);
  }, []);

  return { image, thumbnail, isProcessing, error, handleFileSelect, reset };
}
