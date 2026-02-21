export default function StatsCard({ stats }) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-sm text-gray-500 uppercase tracking-wide">Total Catches</p>
        <p className="text-4xl font-bold text-gray-800 mt-1">{stats.total_catches}</p>
      </div>
      <div className="bg-orange-50 rounded-lg shadow p-4 text-center">
        <p className="text-sm text-orange-600 uppercase tracking-wide">🏹 Hunting</p>
        <p className="text-4xl font-bold text-orange-700 mt-1">{stats.hunting}</p>
      </div>
      <div className="bg-green-50 rounded-lg shadow p-4 text-center">
        <p className="text-sm text-green-600 uppercase tracking-wide">🎣 Fishing</p>
        <p className="text-4xl font-bold text-green-700 mt-1">{stats.fishing}</p>
      </div>
    </div>
  )
}
