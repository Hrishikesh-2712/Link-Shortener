'use client';

import useSWR from 'swr';
import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, MousePointer2, Clock, Copy, Check } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StatsPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = use(params);
    const { data: link, error } = useSWR(`/api/links/${code}`, fetcher, { refreshInterval: 5000 });
    const [copied, setCopied] = useState(false);

    if (error) return <div className="text-center py-12 text-red-500">Link not found</div>;
    if (!link) return <div className="text-center py-12 text-gray-500">Loading stats...</div>;

    const shortUrl = typeof window !== 'undefined' ? `${window.location.origin}/${link.code}` : `/${link.code}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">/{link.code}</h1>
                            <a
                                href={link.originalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm break-all"
                            >
                                {link.originalUrl}
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy Link'}
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <MousePointer2 className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-blue-900">Total Clicks</span>
                            </div>
                            <p className="text-3xl font-bold text-blue-700">{link.clicks}</p>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Created</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-700">
                                {new Date(link.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Last Clicked</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-700">
                                {link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleDateString() : 'Never'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
