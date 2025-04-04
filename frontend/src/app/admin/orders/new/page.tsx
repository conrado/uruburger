'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItem, MenuItemsService, MenuOrdersService } from '@/lib/api';
import Image from 'next/image';

export default function NewOrderPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [id: number]: number }>(
    {}
  );
  const [customerId, setCustomerId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const itemsService = new MenuItemsService();
        const data = await itemsService.getAll();
        setItems(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch menu items:', err);
        setError('Failed to load menu items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleItemQuantityChange = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      const newSelectedItems = { ...selectedItems };
      delete newSelectedItems[itemId];
      setSelectedItems(newSelectedItems);
    } else {
      setSelectedItems({
        ...selectedItems,
        [itemId]: quantity,
      });
    }
  };

  const getTotalItems = (): number => {
    return Object.values(selectedItems).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
  };

  const getTotalPrice = (): number => {
    return items.reduce((sum, item) => {
      const quantity = selectedItems[item.id] || 0;
      return sum + Number(item.value) * quantity;
    }, 0);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(selectedItems).length === 0) {
      setError('Please select at least one item for the order.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const ordersService = new MenuOrdersService();

      // Convert selected items to array of item IDs with quantities
      const itemIds = Object.entries(selectedItems).flatMap(([id, quantity]) =>
        Array(quantity).fill(parseInt(id))
      );

      // Create the order with customer ID and items
      await ordersService.create({
        customerName: customerId,
        itemIds,
      });

      // Navigate back to orders list
      router.push('/admin/orders');
    } catch (err) {
      console.error('Failed to create order:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Create New Order
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select items to add to the order.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleCreateOrder}>
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="customerId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Customer Identifier (Optional)
              </label>
              <input
                type="text"
                name="customerId"
                id="customerId"
                placeholder="e.g., Table 5 - John"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Identify the customer or table for this order.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                Menu Items
              </h3>

              {loading ? (
                <div className="flex justify-center py-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading menu items...
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    No menu items available.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/admin/items/new')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Menu Items First
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col"
                    >
                      <div className="flex items-center mb-4">
                        <div className="h-16 w-16 relative flex-shrink-0">
                          <Image
                            src={item.imageLink || '/placeholder-food.png'}
                            alt={item.name}
                            fill
                            className="rounded-md object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-food.png';
                            }}
                          />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            ${Number(item.value).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleItemQuantityChange(
                                item.id,
                                (selectedItems[item.id] || 0) - 1
                              )
                            }
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            -
                          </button>
                          <span className="mx-3 text-gray-700 dark:text-gray-300">
                            {selectedItems[item.id] || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleItemQuantityChange(
                                item.id,
                                (selectedItems[item.id] || 0) + 1
                              )
                            }
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                        {selectedItems[item.id] > 0 && (
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            $
                            {(
                              Number(item.value) * selectedItems[item.id]
                            ).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                <p>Items</p>
                <p>{getTotalItems()}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mt-2">
                <p>Total</p>
                <p>${getTotalPrice().toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/orders')}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || Object.keys(selectedItems).length === 0}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
