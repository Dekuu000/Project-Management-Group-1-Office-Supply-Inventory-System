export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Office Supply Inventory Dashboard</h1>
      <section>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to your dashboard. Here you'll see an overview of supplies, staff, and transactions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white px-5 py-7 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-600">Total Supplies</h2>
            <p className="mt-2 text-2xl font-bold text-gray-900">----</p>
          </div>
          <div className="bg-white px-5 py-7 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-green-600">Active Transactions</h2>
            <p className="mt-2 text-2xl font-bold text-gray-900">----</p>
          </div>
        </div>
      </section>
    </main>
  );
}