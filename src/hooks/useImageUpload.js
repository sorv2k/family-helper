import { useState } from 'react';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file) {
    try {
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;
      
      const result = await uploadData({
        path: `public/${fileName}`,
        data: file,
        options: {
          contentType: file.type
        }
      }).result;
      
      return fileName;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  }

  async function getImageUrl(imageKey) {
    try {
      if (!imageKey) return null;
      const url = await getUrl({ path: `public/${imageKey}` });
      return url.url.toString();
    } catch (err) {
      console.error('Error getting image URL:', err);
      return null;
    }
  }

  async function deleteImage(imageKey) {
    try {
      await remove({ path: `public/${imageKey}` });
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  }

  return { uploadImage, getImageUrl, deleteImage, uploading };
}