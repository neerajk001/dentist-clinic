import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getTreatments } from '@/actions/treatments';
import { Card } from '@/components/ui/card';

export default async function TreatmentsPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const treatments = await getTreatments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Treatments</h1>
        <p className="text-gray-600 mt-1">View available treatments and pricing.</p>
      </div>

      <Card>
        {treatments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-4xl mb-4">💊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No treatments yet</h3>
            <p className="text-gray-600">Add treatments in the database to see them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {treatments.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-md">{t.description || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{t.duration} min</td>
                    <td className="px-6 py-4 text-gray-900">₹{t.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
