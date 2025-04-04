'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MenuItem,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuItemsService,
} from '@/lib/api';
import { ImageUploader } from './ImageUploader';

interface ItemFormProps {
  item?: MenuItem;
  isEditing?: boolean;
}

export const ItemForm = ({ item, isEditing = false }: ItemFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<
    CreateMenuItemDto | UpdateMenuItemDto
  >({
    name: item?.name || '',
    description: item?.description || '',
    price: item ? Number(item.value) : 0,
    imageUrl: item?.imageLink || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    });
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData({
      ...formData,
      imageUrl,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const itemsService = new MenuItemsService();

      // Generate a QR code link (in a real app, this would be handled by the backend)
      const qrCodeLink = `https://uruburger.com/item/${
        isEditing ? item?.id : 'new'
      }`;

      if (isEditing && item) {
        // Update existing item - the backend service will map fields correctly
        await itemsService.update(item.id, {
          name: formData.name as string,
          description: formData.description as string,
          price: formData.price as number,
          imageUrl: formData.imageUrl as string,
        });
      } else {
        // Create new item - the backend service will map fields correctly
        await itemsService.create({
          name: formData.name as string,
          description: formData.description as string,
          price: formData.price as number,
          imageUrl: formData.imageUrl as string,
        });
      }

      // Navigate back to items list
      router.push('/admin/items');
    } catch (err) {
      console.error('Failed to save item:', err);
      setError('Failed to save item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Price ($)
        </label>
        <input
          type="number"
          name="price"
          id="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        />
      </div>

      <ImageUploader
        initialImageUrl={formData.imageUrl as string}
        onImageUploaded={handleImageUploaded}
      />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Saving...'
            : isEditing
            ? 'Update Item'
            : 'Create Item'}
        </button>
      </div>
    </form>
  );
};
