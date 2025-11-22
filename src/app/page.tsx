import { CreateLinkForm } from '@/components/CreateLinkForm';
import { LinksTable } from '@/components/LinksTable';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shorten Your Links</h1>
        <p className="text-gray-600">
          Create short, memorable links and track their performance.
        </p>
      </div>

      <CreateLinkForm />

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Links</h2>
      </div>

      <LinksTable />
    </div>
  );
}
