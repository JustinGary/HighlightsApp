export default function Library() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Library</h1>
        <p className="text-gray-600">Browse and manage your highlights</p>
      </header>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your library is empty.</p>
          <p className="text-sm text-gray-400">Import your highlights to see them here.</p>
        </div>
      </div>
    </div>
  );
}
