'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useState } from 'react';
import { Trash2, ExternalLink, BarChart2, Copy, Check } from 'lucide-react';

interface LinkData {
    id: number;
    code: string;
    originalUrl: string;
    clicks: number;
    createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LinksTable() {
    const { data: links, error, mutate } = useSWR<LinkData[]>('/api/links', fetcher);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const handleDelete = async (code: string) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        setDeleting(code);
        try {
            await fetch(`/api/links/${code}`, { method: 'DELETE' });
            mutate(); // Refresh
        } catch (e) {
            alert('Failed to delete');
        } finally {
            setDeleting(null);
        }
    };

    const copyToClipboard = (code: string) => {
        const url = `${window.location.origin}/${code}`;
        navigator.clipboard.writeText(url);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    if (error) return <div className="text-red-500">Failed to load links</div>;
    if (!links) return <div className="text-gray-500">Loading links...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Short Link</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Original URL</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Clicks</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {links.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No links yet. Create one above!
                                </td>
                            </tr>
                        ) : (
                            links.map((link) => (
                                <tr key={link.code} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/code/${link.code}`} className="font-medium text-blue-600 hover:underline">
                                                /{link.code}
                                            </Link>
                                            <button
                                                onClick={() => copyToClipboard(link.code)}
                                                className="text-gray-400 hover:text-gray-600"
                                                title="Copy link"
                                            >
                                                {copied === link.code ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs truncate text-gray-600" title={link.originalUrl}>
                                            {link.originalUrl}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {link.clicks} clicks
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/code/${link.code}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Stats"
                                            >
                                                <BarChart2 className="w-4 h-4" />
                                            </Link>
                                            <a
                                                href={`/${link.code}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Visit Link"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(link.code)}
                                                disabled={deleting === link.code}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
