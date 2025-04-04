'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MenuItem, MenuItemsService } from '@/lib/api';
import { ItemForm } from '../../components/ItemForm';

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const itemId = parseInt(params.id as string, 10);
        const itemsService = new MenuItemsService();
        const data = await itemsService.getById(itemId);
        setItem(data);
      } catch (err) {
        console.error('Failed to fetch item:', err);
        setError('Failed to load item details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [params.id]);

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0 flex justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading item details...
        </p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error || 'Item not found'}</span>
          <div className="mt-4">
            <button
              onClick={() => router.push('/admin/items')}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Return to item list
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Edit Menu Item
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update the details for {item.name}.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
        <ItemForm item={item} isEditing={true} />
      </div>
    </div>
  );
}
