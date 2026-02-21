const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Hunting', value: 'hunting' },
  { label: 'Fishing', value: 'fishing' },
]

export default function FilterBar({ filter, onFilterChange }) {
  return (
    <div className="flex gap-2 mb-6">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
