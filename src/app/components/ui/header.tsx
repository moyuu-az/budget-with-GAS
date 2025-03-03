import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="w-full px-4 md:px-8 lg:px-16 max-w-[1600px] mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
            <path d="M13 14a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2Z" />
          </svg>
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            家計簿アプリ
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              ダッシュボード
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              設定
            </Link>
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
