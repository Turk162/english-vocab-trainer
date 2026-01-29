import Link from 'next/link';

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md transition-colors"
    >
      <svg
        className="w-8 h-8 text-primary-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
      <span className="hidden sm:inline">English Vocab Trainer</span>
      <span className="sm:hidden">EVT</span>
    </Link>
  );
}
