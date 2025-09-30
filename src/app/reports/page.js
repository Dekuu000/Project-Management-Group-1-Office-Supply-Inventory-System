
"use client";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({ Title: "", CreatedDate: "", CreatorId: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports").then(res => res.json()).then(setReports).catch(() => setError("Fetch failed")).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReport)
    });
    const result = await res.json();
    if (res.ok) {
      setReports((prev) => [...prev, { ...newReport, ReportId: result.id }]);
      setNewReport({ Title: "", CreatedDate: "", CreatorId: "" });
    } else {
      setError(result.error || "Create failed");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Reports</h1>
      <section>
        <p className="text-lg text-blue-700 mb-6">
          View and create inventory reports.
        </p>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-200 rounded px-4 py-2">{error}</div>
        )}
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            className="border rounded px-3 py-2"
            placeholder="Title"
            value={newReport.Title}
            onChange={e => setNewReport(r => ({ ...r, Title: e.target.value }))}
            required
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="CreatedDate (YYYY-MM-DD HH:mm:ss)"
            value={newReport.CreatedDate}
            onChange={e => setNewReport(r => ({ ...r, CreatedDate: e.target.value }))}
            required
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="CreatorId"
            type="number"
            value={newReport.CreatorId}
            onChange={e => setNewReport(r => ({ ...r, CreatorId: e.target.value }))}
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-5 py-2 mt-2 transition"
          >
            Add Report
          </button>
        </form>
        {loading ? (
          <div className="text-blue-600 font-medium">Loading...</div>
        ) : (
          <div className="overflow-auto max-w-full">
            <table className="min-w-full border bg-white rounded-xl shadow text-left">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">CreatedDate</th>
                  <th className="py-3 px-4">CreatorId</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.ReportId} className="border-t">
                    <td className="py-2 px-4">{r.Title}</td>
                    <td className="py-2 px-4">{r.CreatedDate}</td>
                    <td className="py-2 px-4">{r.CreatorId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}