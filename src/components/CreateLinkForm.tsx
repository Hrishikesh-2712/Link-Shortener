'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { Loader2, Link as LinkIcon, ArrowRight } from 'lucide-react';

export function CreateLinkForm() {
    const { mutate } = useSWRConfig();
    const [url, setUrl] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, code: code || undefined }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setUrl('');
            setCode('');
            setSuccess(`Link created! Code: ${data.code}`);
            mutate('/api/links'); // Refresh list
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-blue-500" />
                Shorten a new link
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                            Destination URL
                        </label>
                        <input
                            id="url"
                            type="url"
                            required
                            placeholder="https://example.com/very-long-url..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                            Custom Code (Optional)
                        </label>
                        <div className="relative">
                            <input
                                id="code"
                                type="text"
                                placeholder="e.g. my-link"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            Shorten URL
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
