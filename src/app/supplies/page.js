"use client";
import { useEffect, useState } from "react";
export default function SuppliesPage() {
  const [supplies, setSupplies] = useState([]);
  const [newSupply, setNewSupply] = useState({
    Name: '', Description: '', Quantity: '', Category: '', Location: '', SupplierId: ''
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/supplies")
      .then(res => res.json()).then(setSupplies)
      .catch(() => setError("Fetch failed")).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/supplies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSupply)
    });
    const result = await res.json();
    if (res.ok) {
      setSupplies((prev) => [...prev, { ...newSupply, SupplyId: result.id }]);
      setNewSupply({ Name: '', Description: '', Quantity: '', Category: '', Location: '', SupplierId: '' });
    } else {
      setError(result.error || "Create failed");
    }
  };

  return (
    <main className="min-h-screen bg-blue-50 px-8 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Supplies</h1>
      <section>
        <p className="text-lg text-blue-700 mb-6">
          List of all office supplies available.
        </p>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-200 rounded px-4 py-2">{error}</div>
        )}
        <form onSubmit={handleCreate}
          className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input className="border rounded px-3 py-2" placeholder="Name" value={newSupply.Name}
            onChange={e => setNewSupply(s => ({ ...s, Name: e.target.value }))} required />
          <input className="border rounded px-3 py-2" placeholder="Description" value={newSupply.Description}
            onChange={e => setNewSupply(s => ({ ...s, Description: e.target.value }))} />
          <input className="border rounded px-3 py-2" placeholder="Quantity" type="number" value={newSupply.Quantity}
            onChange={e => setNewSupply(s => ({ ...s, Quantity: e.target.value }))} required />
          <input className="border rounded px-3 py-2" placeholder="Category" value={newSupply.Category}
            onChange={e => setNewSupply(s => ({ ...s, Category: e.target.value }))} />
          <input className="border rounded px-3 py-2" placeholder="Location" value={newSupply.Location}
            onChange={e => setNewSupply(s => ({ ...s, Location: e.target.value }))} />
          <input className="border rounded px-3 py-2" placeholder="SupplierId" type="number" value={newSupply.SupplierId}
            onChange={e => setNewSupply(s => ({ ...s, SupplierId: e.target.value }))} />
          <button type="submit"
            className="col-span-1 md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-5 py-2 mt-2 transition">
            Add Supply
          </button>
        </form>
        {loading ? (
          <div className="text-blue-600 font-medium">Loading...</div>
        ) : (
          <div className="overflow-auto max-w-full">
            <table className="min-w-full border bg-white rounded-xl shadow text-left">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">SupplierId</th>
                </tr>
              </thead>
              <tbody>
                {supplies.map(s => (
                  <tr key={s.SupplyId || s.Name} className="border-t">
                    <td className="py-2 px-4">{s.Name}</td>
                    <td className="py-2 px-4">{s.Description}</td>
                    <td className="py-2 px-4">{s.Quantity}</td>
                    <td className="py-2 px-4">{s.Category}</td>
                    <td className="py-2 px-4">{s.Location}</td>
                    <td className="py-2 px-4">{s.SupplierId}</td>
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