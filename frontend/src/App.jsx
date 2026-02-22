import { useEffect, useState, useRef } from "react";
import { getCatches, getStats } from "./api/catches.js";
import CatchForm from "./components/CatchForm.jsx";
import CatchList from "./components/CatchList.jsx";
import FilterBar from "./components/FilterBar.jsx";
import StatsCard from "./components/StatsCard.jsx";

export default function App() {
  const [catches, setCatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCatch, setEditingCatch] = useState(null);

  const formRef = useRef(null);

  async function fetchData(currentFilter) {
    setLoading(true);
    setError(null);
    try {
      const [catchData, statsData] = await Promise.all([
        getCatches(currentFilter === "all" ? null : currentFilter),
        getStats(),
      ]);
      setCatches(catchData);
      setStats(statsData);
    } catch (err) {
      setError(
        "Failed to load data. Is the backend running on http://localhost:8000?",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  function handleFilterChange(value) {
    setFilter(value);
  }

  function handleCatchCreated() {
    setEditingCatch(null);
    fetchData(filter);
  }

  function handleCatchDeleted() {
    setEditingCatch(null);
    fetchData(filter);
  }

  function handleEditCatch(catchRecord) {
    setEditingCatch(catchRecord);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleCancelEdit() {
    setEditingCatch(null);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🎣 Hunting &amp; Fishing Database
      </h1>
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}
      <StatsCard stats={stats} />
      <FilterBar filter={filter} onFilterChange={handleFilterChange} />
      <div ref={formRef}>
        <CatchForm
          onCatchCreated={handleCatchCreated}
          editingCatch={editingCatch}
          onCancelEdit={handleCancelEdit}
        />
      </div>
      <CatchList
        catches={catches}
        loading={loading}
        onCatchDeleted={handleCatchDeleted}
        onEditCatch={handleEditCatch}
      />
    </div>
  );
}
