import { IMAGE_MAX_WIDTH, IMAGE_QUALITY, THUMBNAIL_MAX_WIDTH, THUMBNAIL_QUALITY } from './constants';

function resizeImage(file: File, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function compressImage(file: File): Promise<string> {
  return resizeImage(file, IMAGE_MAX_WIDTH, IMAGE_QUALITY);
}

export async function createThumbnail(file: File): Promise<string> {
  return resizeImage(file, THUMBNAIL_MAX_WIDTH, THUMBNAIL_QUALITY);
}

export function base64ToBlob(base64: string): string {
  // Strip data URI prefix for API calls
  return base64.replace(/^data:image\/\w+;base64,/, '');
}
