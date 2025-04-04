'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  MenuOrder,
  MenuItem,
  MenuOrdersService,
  MenuItemsService,
  OrderStatus,
} from '@/lib/api';
import Image from 'next/image';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<MenuOrder | null>(null);
  const [availableItems, setAvailableItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddItemsModal, setShowAddItemsModal] = useState(false);
  const [selectedItemsToAdd, setSelectedItemsToAdd] = useState<{
    [id: number]: number;
  }>({});
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);

  useEffect(() => {
    const fetchOrderAndItems = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const orderId = parseInt(params.id as string, 10);

        // Fetch order details
        const ordersService = new MenuOrdersService();
        const orderData = await ordersService.getById(orderId);
        setOrder(orderData);

        // Fetch all available menu items
        const itemsService = new MenuItemsService();
        const itemsData = await itemsService.getAll();
        setAvailableItems(itemsData);

        setError(null);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndItems();
  }, [params.id]);

  const handleAddItems = async () => {
    if (!order) return;

    // Convert selected items to array of item IDs with quantities
    const itemIds = Object.entries(selectedItemsToAdd).flatMap(
      ([id, quantity]) => Array(quantity).fill(parseInt(id))
    );

    if (itemIds.length === 0) {
      setShowAddItemsModal(false);
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const ordersService = new MenuOrdersService();
      const updatedOrder = await ordersService.addItems(order.id, { itemIds });

      // Update local state
      setOrder(updatedOrder);
      setShowAddItemsModal(false);
      setSelectedItemsToAdd({});
    } catch (err) {
      console.error('Failed to add items to order:', err);
      setError('Failed to update order. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateItemQuantity = async (
    itemId: number,
    newQuantity: number
  ) => {
    if (!order) return;

    try {
      setUpdating(true);
      setError(null);

      const ordersService = new MenuOrdersService();

      if (newQuantity === 0) {
        // Remove item from order
        const updatedOrder = await ordersService.cancelItems(order.id, {
          itemIds: [itemId],
        });
        setOrder(updatedOrder);
      } else if (newQuantity > 0) {
        // First calculate how many to add or remove
        const currentItem = order.items.find((item) => item.id === itemId);
        const currentQuantity = currentItem
          ? order.items.filter((item) => item.id === itemId).length
          : 0;

        if (newQuantity > currentQuantity) {
          // Add items
          const itemsToAdd = Array(newQuantity - currentQuantity).fill(itemId);
          const updatedOrder = await ordersService.addItems(order.id, {
            itemIds: itemsToAdd,
          });
          setOrder(updatedOrder);
        } else if (newQuantity < currentQuantity) {
          // Remove items
          const itemsToRemove = Array(currentQuantity - newQuantity).fill(
            itemId
          );
          const updatedOrder = await ordersService.cancelItems(order.id, {
            itemIds: itemsToRemove,
          });
          setOrder(updatedOrder);
        }
      }

      setEditingItemIndex(null);
    } catch (err) {
      console.error('Failed to update item quantity:', err);
      setError('Failed to update order. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!order) return;

    if (!confirm('Are you sure you want to complete this order?')) return;

    try {
      setUpdating(true);
      setError(null);

      const ordersService = new MenuOrdersService();
      const updatedOrder = await ordersService.updateStatus(
        order.id,
        OrderStatus.COMPLETED
      );

      setOrder(updatedOrder);
    } catch (err) {
      console.error('Failed to complete order:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Count occurrences of each item in the order
  const getItemCounts = () => {
    if (!order) return {};

    const counts: Record<number, { count: number; item: MenuItem }> = {};

    order.items.forEach((item) => {
      if (!counts[item.id]) {
        counts[item.id] = { count: 0, item };
      }
      counts[item.id].count += 1;
    });

    return counts;
  };

  // Check if the order can be modified (not completed or cancelled)
  const canModifyOrder = () => {
    if (!order) return false;
    return !['COMPLETED', 'CANCELLED'].includes(order.status);
  };

  // Handle changing the quantity in the add items modal
  const handleItemQuantityChangeInModal = (
    itemId: number,
    quantity: number
  ) => {
    if (quantity <= 0) {
      const newSelectedItems = { ...selectedItemsToAdd };
      delete newSelectedItems[itemId];
      setSelectedItemsToAdd(newSelectedItems);
    } else {
      setSelectedItemsToAdd({
        ...selectedItemsToAdd,
        [itemId]: quantity,
      });
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0 flex justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error || 'Order not found'}</span>
          <div className="mt-4">
            <button
              onClick={() => router.push('/admin/orders')}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Return to orders list
            </button>
          </div>
        </div>
      </div>
    );
  }

  const itemCounts = getItemCounts();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mr-3">
              Order #{order.id}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                order.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : order.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              }`}
            >
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Created{' '}
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
            })}
          </p>
          {order.customerId && (
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              Customer: {order.customerId}
            </p>
          )}
        </div>

        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.push('/admin/orders')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Back to Orders
          </button>

          {canModifyOrder() && (
            <>
              <button
                type="button"
                onClick={() => setShowAddItemsModal(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Items
              </button>
              <button
                type="button"
                onClick={handleCompleteOrder}
                disabled={updating || order.items.length === 0}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
              >
                Complete Order
              </button>
            </>
          )}
        </div>
      </div>

      {order.items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No items in this order.
          </p>
          {canModifyOrder() && (
            <button
              type="button"
              onClick={() => setShowAddItemsModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Items
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Order Items
            </h2>

            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.values(itemCounts).map(({ count, item }, index) => (
                <li
                  key={item.id}
                  className={`py-4 flex justify-between items-center ${
                    editingItemIndex === index
                      ? 'bg-gray-50 dark:bg-gray-700'
                      : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 relative flex-shrink-0">
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
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${Number(item.value).toFixed(2)} x {count} = $
                          {(Number(item.value) * count).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {canModifyOrder() && (
                    <div>
                      {editingItemIndex === index ? (
                        <div className="flex items-center">
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                            <button
                              type="button"
                              onClick={() =>
                                setItemQuantity(Math.max(0, itemQuantity - 1))
                              }
                              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              -
                            </button>
                            <span className="px-3 py-1">{itemQuantity}</span>
                            <button
                              type="button"
                              onClick={() => setItemQuantity(itemQuantity + 1)}
                              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex space-x-2 ml-3">
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateItemQuantity(item.id, itemQuantity);
                              }}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItemIndex(null);
                                setItemQuantity(1);
                              }}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemIndex(index);
                            setItemQuantity(count);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                <p>Subtotal</p>
                <p>${Number(order.total).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event log */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Order History
        </h2>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {order.eventLog.map((event, eventIdx) => (
                  <li key={eventIdx}>
                    <div className="relative pb-8">
                      {eventIdx !== order.eventLog.length - 1 ? (
                        <span
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <span className="text-gray-500 dark:text-gray-400">
                              {eventIdx + 1}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {event.event.replace(/_/g, ' ')}
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {event.details &&
                            Object.keys(event.details).length > 0 && (
                              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                <p>{JSON.stringify(event.details)}</p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add items modal */}
      {showAddItemsModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Add Items to Order
                </h3>

                {availableItems.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">
                    No menu items available.
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {availableItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 relative flex-shrink-0">
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
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ${Number(item.value).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleItemQuantityChangeInModal(
                                item.id,
                                (selectedItemsToAdd[item.id] || 0) - 1
                              )
                            }
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            -
                          </button>
                          <span className="mx-3 text-gray-700 dark:text-gray-300">
                            {selectedItemsToAdd[item.id] || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleItemQuantityChangeInModal(
                                item.id,
                                (selectedItemsToAdd[item.id] || 0) + 1
                              )
                            }
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddItems}
                  disabled={
                    updating || Object.keys(selectedItemsToAdd).length === 0
                  }
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-400"
                >
                  {updating ? 'Adding...' : 'Add to Order'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddItemsModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
