import { useState, useEffect } from "react";
import { createCatch, updateCatch } from "../api/catches.js";

const INITIAL_FORM = {
  species: "",
  catch_type: "fishing",
  weight: "",
  location: "",
  date_caught: "",
  equipment: "",
  notes: "",
};

function toLocalDatetimeString(isoString) {
  if (!isoString) return "";
  const dt = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

export default function CatchForm({
  onCatchCreated,
  editingCatch,
  onCancelEdit,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = editingCatch != null;

  useEffect(() => {
    if (editingCatch) {
      setForm({
        species: editingCatch.species || "",
        catch_type: editingCatch.catch_type || "fishing",
        weight: editingCatch.weight != null ? String(editingCatch.weight) : "",
        location: editingCatch.location || "",
        date_caught: toLocalDatetimeString(editingCatch.date_caught),
        equipment: editingCatch.equipment || "",
        notes: editingCatch.notes || "",
      });
      setError(null);
    } else {
      setForm(INITIAL_FORM);
      setError(null);
    }
  }, [editingCatch]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = {
        ...form,
        weight: form.weight !== "" ? parseFloat(form.weight) : null,
      };

      if (isEditing) {
        await updateCatch(editingCatch.id, data);
      } else {
        await createCatch(data);
      }

      setForm(INITIAL_FORM);
      onCatchCreated();
    } catch (err) {
      setError(
        isEditing
          ? "Failed to update catch. Please try again."
          : "Failed to save catch. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    setForm(INITIAL_FORM);
    setError(null);
    if (onCancelEdit) onCancelEdit();
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div
      className={`rounded-lg shadow p-6 mb-6 ${
        isEditing ? "bg-yellow-50 border-2 border-yellow-400" : "bg-white"
      }`}
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {isEditing ? "✏️ Edit Catch" : "Log a New Catch"}
      </h2>
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-2 mb-4 text-sm">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Species *
          </label>
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
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Type *
          </label>
          <select
            name="catch_type"
            value={form.catch_type}
            onChange={handleChange}
            required
            className={inputClass}
            disabled={isEditing}
          >
            <option value="fishing">Fishing</option>
            <option value="hunting">Hunting</option>
          </select>
          {isEditing && (
            <p className="text-xs text-gray-400 mt-1">
              Type cannot be changed after creation.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Weight (optional)
          </label>
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
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Location *
          </label>
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
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Date Caught *
          </label>
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
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Equipment *
          </label>
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
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className={inputClass}
            placeholder="Additional details..."
          />
        </div>

        <div className="sm:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              isEditing
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting
              ? isEditing
                ? "Updating…"
                : "Saving…"
              : isEditing
                ? "Update Catch"
                : "Log Catch"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
