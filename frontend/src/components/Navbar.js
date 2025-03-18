"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">Motorsport DB</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/insert"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/insert" ? "bg-gray-900" : "hover:bg-gray-700"
              }`}
            >
              Insert Data
            </Link>
            <Link
              href="/view"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/view" ? "bg-gray-900" : "hover:bg-gray-700"
              }`}
            >
              View Data
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
