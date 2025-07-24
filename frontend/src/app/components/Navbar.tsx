'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">플랫폼 이름</div>
      <div className="space-x-4">
        <Link href="/" className="hover:underline">
          링크 1
        </Link>
        <Link href="/assets" className="hover:underline">
          링크 2
        </Link>
        <Link href="/profile" className="hover:underline">
          링크 3
        </Link>
      </div>
    </nav>
  );
}
