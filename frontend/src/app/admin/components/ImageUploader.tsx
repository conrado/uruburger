'use client';

import { useState, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

interface ImageUploaderProps {
  initialImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
}

export const ImageUploader = ({
  initialImageUrl,
  onImageUploaded,
}: ImageUploaderProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialImageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create a FormData object for the file
      const formData = new FormData();
      formData.append('image', file);

      // Generate a unique name for the image
      const uniqueName = `uruburger_${uuidv4()}_${file.name.replace(
        /\s+/g,
        '_'
      )}`;
      formData.append('name', uniqueName);

      // Upload to Imgur API
      const response = await axios.post(
        'https://api.imgur.com/3/image',
        formData,
        {
          headers: {
            Authorization: 'Client-ID YOUR_IMGUR_CLIENT_ID', // Replace with your actual Imgur client ID
          },
        }
      );

      const uploadedImageUrl = response.data.data.link;
      setImageUrl(uploadedImageUrl);
      onImageUploaded(uploadedImageUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Item Image
      </label>

      <div
        onClick={triggerFileInput}
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div className="space-y-1 text-center">
          {imageUrl ? (
            <div className="relative h-48 w-full mb-4">
              <Image
                src={imageUrl}
                alt="Menu item preview"
                className="rounded-md object-cover"
                fill
              />
            </div>
          ) : (
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          <div className="flex text-sm text-gray-600 dark:text-gray-400">
            <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
              <span>{imageUrl ? 'Replace image' : 'Upload an image'}</span>
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      </div>

      {isUploading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Uploading image...
        </p>
      )}

      {uploadError && (
        <p className="text-sm text-red-600 dark:text-red-500 mt-2">
          {uploadError}
        </p>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        *Images are uploaded to Imgur. By uploading, you confirm you have rights
        to share this image.
      </p>
    </div>
  );
};
