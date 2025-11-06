export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track your learning progress and retention metrics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Completion</h2>
          <div className="text-center py-8">
            <p className="text-gray-500">No data available yet</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Retention Trends</h2>
          <div className="text-center py-8">
            <p className="text-gray-500">No data available yet</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Sources</h2>
          <div className="text-center py-8">
            <p className="text-gray-500">No data available yet</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reading Activity</h2>
          <div className="text-center py-8">
            <p className="text-gray-500">No data available yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
