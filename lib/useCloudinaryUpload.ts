import { useState } from 'react';

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, folder?: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) formData.append('folder', folder);

      const response = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      return await response.json();
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};