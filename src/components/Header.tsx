import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';

export function Header() {
    return (
        <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors">
                    <LinkIcon className="w-6 h-6" />
                    <span>TinyLink</span>
                </Link>
                <nav className="flex gap-4">
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        Dashboard
                    </Link>
                    <Link href="/healthz" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        System Status
                    </Link>
                </nav>
            </div>
        </header>
    );
}
