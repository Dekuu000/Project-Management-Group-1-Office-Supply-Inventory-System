"use client";
import { useEffect, useState } from "react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({ Name: "", Contact: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/suppliers").then(res => res.json()).then(setSuppliers).catch(() => setError("Fetch failed")).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSupplier)
    });
    const result = await res.json();
    if (res.ok) {
      setSuppliers(prev => [...prev, { ...newSupplier, SupplierId: result.id }]);
      setNewSupplier({ Name: "", Contact: "" });
    } else {
      setError(result.error || "Create failed");
    }
  };

  return (
    <main className="min-h-screen bg-purple-50 px-8 py-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">Suppliers</h1>
      <section>
        <p className="text-lg text-purple-700 mb-6">Manage all suppliers.</p>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-200 rounded px-4 py-2">{error}</div>
        )}
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-xl shadow mb-8 flex flex-col gap-4 md:flex-row md:items-end"
        >
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={newSupplier.Name}
            onChange={e => setNewSupplier(u => ({ ...u, Name: e.target.value }))}
            required
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Contact"
            value={newSupplier.Contact}
            onChange={e => setNewSupplier(u => ({ ...u, Contact: e.target.value }))}
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded px-6 py-2 transition"
          >
            Add Supplier
          </button>
        </form>
        {loading ? (
          <div className="text-purple-600 font-medium">Loading...</div>
        ) : (
          <div className="overflow-auto max-w-full">
            <table className="min-w-full border bg-white rounded-xl shadow text-left">
              <thead className="bg-purple-100">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Contact</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(s => (
                  <tr key={s.SupplierId || s.Name} className="border-t">
                    <td className="py-2 px-4">{s.Name}</td>
                    <td className="py-2 px-4">{s.Contact}</td>
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