'use client';

import { ItemForm } from '../../components/ItemForm';

export default function NewItemPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Add New Menu Item
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create a new item that will appear on the menu.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
        <ItemForm />
      </div>
    </div>
  );
}
