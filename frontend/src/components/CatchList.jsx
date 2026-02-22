import { useState } from "react";
import { deleteCatch } from "../api/catches.js";

const TYPE_BADGE = {
  fishing: "bg-green-100 text-green-800",
  hunting: "bg-orange-100 text-orange-800",
};

export default function CatchList({
  catches,
  loading,
  onCatchDeleted,
  onEditCatch,
}) {
  const [deleteError, setDeleteError] = useState(null);

  if (loading) {
    return <p className="text-gray-500 text-center py-8">Loading…</p>;
  }

  if (catches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No catches found.
      </div>
    );
  }

  async function handleDelete(id) {
    setDeleteError(null);
    try {
      await deleteCatch(id);
      onCatchDeleted();
    } catch (err) {
      setDeleteError("Failed to delete catch. Please try again.");
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      {deleteError && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-t-lg px-4 py-2 text-sm">
          {deleteError}
        </div>
      )}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-600 uppercase text-xs tracking-wide">
            <th className="px-4 py-3">Species</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Weight</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Date Caught</th>
            <th className="px-4 py-3">Equipment</th>
            <th className="px-4 py-3">Notes</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {catches.map((c, i) => (
            <tr
              key={c.id}
              className={
                i % 2 === 0
                  ? "bg-white hover:bg-gray-50"
                  : "bg-gray-50 hover:bg-gray-100"
              }
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {c.species}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    TYPE_BADGE[c.catch_type] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {c.catch_type}
                </span>
              </td>
              <td className="px-4 py-3">{c.weight != null ? c.weight : "—"}</td>
              <td className="px-4 py-3">{c.location}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {new Date(c.date_caught).toLocaleString()}
              </td>
              <td className="px-4 py-3">{c.equipment}</td>
              <td className="px-4 py-3 text-gray-500">{c.notes || "—"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => onEditCatch(c)}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
