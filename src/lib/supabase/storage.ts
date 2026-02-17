'use client';

import { createClient } from './client';

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], filename, { type: mime });
}

export async function uploadPhoto(base64: string, folder: 'food' | 'progress'): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const filename = `${user.id}/${folder}/${Date.now()}.jpg`;
  const file = base64ToFile(base64, filename);

  const { error } = await supabase.storage
    .from('photos')
    .upload(filename, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from('photos')
    .getPublicUrl(filename);

  return data.publicUrl;
}

export async function uploadPhotoWithThumbnail(
  photo: string,
  thumbnail: string,
  folder: 'food' | 'progress'
): Promise<{ photoUrl: string; thumbnailUrl: string }> {
  const [photoUrl, thumbnailUrl] = await Promise.all([
    uploadPhoto(photo, folder),
    uploadPhoto(thumbnail, folder),
  ]);
  return { photoUrl, thumbnailUrl };
}
