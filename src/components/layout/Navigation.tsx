'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationProps } from '@/lib/types/components';

export default function Navigation({ links, className = '' }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={`flex items-center gap-6 ${className}`}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1 ${
              isActive
                ? 'text-primary-600'
                : 'text-gray-700 hover:text-primary-600'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
