import { useState } from 'react'
import { createCatch } from '../api/catches.js'

const INITIAL_FORM = {
  species: '',
  catch_type: 'fishing',
  weight: '',
  location: '',
  date_caught: '',
  equipment: '',
  notes: '',
}

export default function CatchForm({ onCatchCreated }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const data = {
        ...form,
        weight: form.weight !== '' ? parseFloat(form.weight) : null,
      }
      await createCatch(data)
      setForm(INITIAL_FORM)
      onCatchCreated()
    } catch (err) {
      setError('Failed to save catch. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Log a New Catch</h2>
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-2 mb-4 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Species *</label>
          <input
            type="text"
            name="species"
            value={form.species}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="e.g. Rainbow Trout"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Type *</label>
          <select
            name="catch_type"
            value={form.catch_type}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="fishing">Fishing</option>
            <option value="hunting">Hunting</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Weight (optional)</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={inputClass}
            placeholder="lbs / kg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Location *</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="e.g. Mountain River"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Date Caught *</label>
          <input
            type="datetime-local"
            name="date_caught"
            value={form.date_caught}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Equipment *</label>
          <input
            type="text"
            name="equipment"
            value={form.equipment}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="e.g. Fly rod with size 12 fly"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className={inputClass}
            placeholder="Additional details..."
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Saving…' : 'Log Catch'}
          </button>
        </div>
      </form>
    </div>
  )
}
