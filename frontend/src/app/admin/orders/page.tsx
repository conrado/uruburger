'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MenuOrder, MenuOrdersService, OrderStatus } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function OrdersList() {
  const [orders, setOrders] = useState<MenuOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Helper function to get creation timestamp from event log
  const getCreationTime = (order: MenuOrder): Date => {
    // Find the ORDER_CREATED event, which should be the first event
    const creationEvent = order.eventLog.find(
      (event) => event.event === OrderStatus.ORDER_CREATED
    );

    // Return the timestamp of the creation event, or current date as fallback
    return creationEvent ? new Date(creationEvent.timestamp) : new Date();
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersService = new MenuOrdersService();
        const data = await ordersService.getAll();

        // Sort orders by status (active orders first) and then by creation time (newest first)
        const sortedOrders = data.sort((a, b) => {
          // First sort by active vs. completed status
          const aIsActive = !['COMPLETED', 'CANCELLED'].includes(a.status);
          const bIsActive = !['COMPLETED', 'CANCELLED'].includes(b.status);

          if (aIsActive && !bIsActive) return -1;
          if (!aIsActive && bIsActive) return 1;

          // Then sort by creation time (newest first)
          return getCreationTime(b).getTime() - getCreationTime(a).getTime();
        });

        setOrders(sortedOrders);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case OrderStatus.ORDER_CREATED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case OrderStatus.PREPARING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case OrderStatus.READY_FOR_PICKUP:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case OrderStatus.DELIVERED:
      case OrderStatus.COMPLETED:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Orders
        </h1>
        <button
          onClick={() => router.push('/admin/orders/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create New Order
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
        </div>
      ) : error ? (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
          <button
            onClick={() => router.push('/admin/orders/new')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Your First Order
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders
            .filter(
              (order) => !['COMPLETED', 'CANCELLED'].includes(order.status)
            )
            .map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Order #{order.id}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {order.customerId || 'No customer name'}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                        order.status || ''
                      )}`}
                    >
                      {order.status
                        ? order.status.replace(/_/g, ' ')
                        : 'UNKNOWN'}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Items: {order.items.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total: ${Number(order.total).toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(getCreationTime(order), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {orders.some((order) =>
        ['COMPLETED', 'CANCELLED'].includes(order.status)
      ) && (
        <div className="mt-10">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Completed & Cancelled Orders
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-75">
            {orders
              .filter((order) =>
                ['COMPLETED', 'CANCELLED'].includes(order.status)
              )
              .map((order) => (
                <div
                  key={order.id}
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                  className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
                          Order #{order.id}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                          {order.customerId || 'No customer name'}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                          order.status || ''
                        )}`}
                      >
                        {order.status
                          ? order.status.replace(/_/g, ' ')
                          : 'UNKNOWN'}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Items: {order.items.length}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        Total: ${Number(order.total).toFixed(2)}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDistanceToNow(getCreationTime(order), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
