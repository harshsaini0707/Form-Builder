import { useState } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file) => {
    if (!file) return null;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data.url;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (files) => {
    if (!files || files.length === 0) return [];

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data.map(file => file.url);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
    isUploading
  };
}

