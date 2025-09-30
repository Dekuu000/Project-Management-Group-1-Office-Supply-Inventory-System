"use client";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    SupplyId: '', UserId: '', Date: '', Time: '', Type: 'Issued', Quantity: '', Remarks: ''
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/transactions")
      .then(res => res.json()).then(setTransactions)
      .catch(() => setError("Fetch failed")).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    // Combine date & time into a single datetime string
    const datetime = `${newTransaction.Date} ${newTransaction.Time}:00`;
    const submitData = {
      ...newTransaction,
      Date: datetime
    };
    delete submitData.Time; // remove Time if backend does not use it
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData)
    });
    const result = await res.json();
    if (res.ok) {
      setTransactions((prev) => [...prev, { ...newTransaction, Date: datetime, TransactionId: result.id }]);
      setNewTransaction({
        SupplyId: '', UserId: '', Date: '', Time: '', Type: 'Issued', Quantity: '', Remarks: ''
      });
    } else {
      setError(result.error || "Create failed");
    }
  };

  return (
    <main className="min-h-screen bg-yellow-50 px-8 py-8">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">Transactions</h1>
      <section>
        <p className="text-lg text-yellow-700 mb-6">
          Track all inventory transactions here.
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
            placeholder="SupplyId"
            type="number"
            value={newTransaction.SupplyId}
            onChange={e => setNewTransaction(t => ({ ...t, SupplyId: e.target.value }))}
            required
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="UserId"
            type="number"
            value={newTransaction.UserId}
            onChange={e => setNewTransaction(t => ({ ...t, UserId: e.target.value }))}
            required
          />
          {/* Date Picker */}
          <input
            className="border rounded px-3 py-2"
            type="date"
            value={newTransaction.Date}
            onChange={e => setNewTransaction(t => ({ ...t, Date: e.target.value }))}
            required
          />
          {/* Time Picker */}
          <input
            className="border rounded px-3 py-2"
            type="time"
            value={newTransaction.Time}
            onChange={e => setNewTransaction(t => ({ ...t, Time: e.target.value }))}
            required
          />
          <select
            className="border rounded px-3 py-2"
            value={newTransaction.Type}
            onChange={e => setNewTransaction(t => ({ ...t, Type: e.target.value }))}
          >
            <option value="Issued">Issued</option>
            <option value="Returned">Returned</option>
            <option value="Disposed">Disposed</option>
            <option value="Received">Received</option>
          </select>
          <input
            className="border rounded px-3 py-2"
            placeholder="Quantity"
            type="number"
            value={newTransaction.Quantity}
            onChange={e => setNewTransaction(t => ({ ...t, Quantity: e.target.value }))}
            required
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Remarks"
            value={newTransaction.Remarks}
            onChange={e => setNewTransaction(t => ({ ...t, Remarks: e.target.value }))}
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded px-5 py-2 mt-2 transition"
          >
            Add Transaction
          </button>
        </form>
        {loading ? (
          <div className="text-yellow-600 font-medium">Loading...</div>
        ) : (
          <div className="overflow-auto max-w-full">
            <table className="min-w-full border bg-white rounded-xl shadow text-left">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="py-3 px-4">SupplyId</th>
                  <th className="py-3 px-4">UserId</th>
                  <th className="py-3 px-4">Date/Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.TransactionId} className="border-t">
                    <td className="py-2 px-4">{t.SupplyId}</td>
                    <td className="py-2 px-4">{t.UserId}</td>
                    <td className="py-2 px-4">{t.Date}</td>
                    <td className="py-2 px-4">{t.Type}</td>
                    <td className="py-2 px-4">{t.Quantity}</td>
                    <td className="py-2 px-4">{t.Remarks}</td>
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