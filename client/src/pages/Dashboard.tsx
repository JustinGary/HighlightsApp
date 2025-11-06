import { useQuery } from '@tanstack/react-query';
import { highlightsApi } from '@/api/highlights';
import LoadingSpinner from '@/components/LoadingSpinner';
import logger from '@/utils/logger';

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dueHighlights'],
    queryFn: () => highlightsApi.getDueHighlights(),
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    logger.error('Failed to load due highlights:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load highlights. Please try again later.</p>
        </div>
      </div>
    );
  }

  const highlights = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to HighlightsApp - Your knowledge retention platform
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Due for Review</h3>
          <p className="text-3xl font-bold text-primary-600">{highlights.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Review Streak</h3>
          <p className="text-3xl font-bold text-green-600">7 days</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Highlights</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights Due for Review</h2>
        {highlights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No highlights due for review right now.</p>
            <p className="text-sm text-gray-400">Import your Kindle highlights to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {highlights.map((highlight) => (
              <div key={highlight.id} className="border border-gray-200 rounded-lg p-4">
                <p className="text-gray-900 mb-2">{highlight.text}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Mastery: {highlight.masteryScore}/5</span>
                  <span>Reviews: {highlight.reviewCount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
