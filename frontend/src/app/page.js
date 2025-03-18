"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Motorsport Database Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage and view motorsport data
        </p>
      </header>

      <main className="w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Insert Data Card */}
          <Link href="/insert" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-4">Insert Data</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Add new records to the database including sponsors, teams, and more.
              </p>
              <div className="text-blue-600 font-medium">Manage Records →</div>
            </div>
          </Link>

          {/* View Data Card */}
          <Link href="/view" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-4">View Data</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Browse and search existing records in the database.
              </p>
              <div className="text-blue-600 font-medium">Explore Data →</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
