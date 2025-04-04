'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MenuItemsService, MenuOrdersService } from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    activeOrders: 0,
    loading: true,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const itemsService = new MenuItemsService();
        const ordersService = new MenuOrdersService();

        const items = await itemsService.getAll();
        const orders = await ordersService.getAll();

        // Count orders that are not in a final state (COMPLETED or CANCELLED)
        const activeOrders = orders.filter(
          (order) => !['COMPLETED', 'CANCELLED'].includes(order.status)
        ).length;

        setStats({
          totalItems: items.length,
          activeOrders,
          loading: false,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="px-4 py-8 sm:px-0">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Uruburger Dashboard
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Quick overview of your restaurant operations.
          </p>
        </div>

        {stats.loading ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Loading statistics...
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Menu Items
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stats.totalItems}
                  </dd>
                  <div className="mt-4">
                    <Link
                      href="/admin/items"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Manage items →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Orders
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stats.activeOrders}
                  </dd>
                  <div className="mt-4">
                    <Link
                      href="/admin/orders"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Manage orders →
                    </Link>
                  </div>
                </div>
              </div>
            </dl>

            <div className="mt-8 flex">
              <button
                onClick={() => router.push('/admin/orders/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
