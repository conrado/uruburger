'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  Uruburger Admin
                </Link>
              </div>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin"
                  className={`${
                    pathname === '/admin'
                      ? 'border-blue-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/items"
                  className={`${
                    isActive('/admin/items')
                      ? 'border-blue-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Manage Items
                </Link>
                <Link
                  href="/admin/orders"
                  className={`${
                    isActive('/admin/orders')
                      ? 'border-blue-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Manage Orders
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                Return to Site
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/admin"
              className={`${
                pathname === '/admin'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-gray-700 dark:text-white'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/items"
              className={`${
                isActive('/admin/items')
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-gray-700 dark:text-white'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Manage Items
            </Link>
            <Link
              href="/admin/orders"
              className={`${
                isActive('/admin/orders')
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-gray-700 dark:text-white'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Manage Orders
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
