"use client";
import { useEffect, useState } from "react";

// Toast Notification, centered and big!
function Toast({ message = "", type = "success", onClose }) {
  if (!message) return null;
  const icons = {
    success: "✓",
    error: "⚠️",
    info: "ℹ️",
    warning: "!",
  };
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500",
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div
        className={`pointer-events-auto flex items-center gap-3 text-white font-semibold ${colors[type] || colors.info} px-8 py-6 rounded-xl shadow-xl animate-fade-in-up`}
        style={{ minWidth: "320px", fontSize: "1.25rem", boxShadow: "0 8px 24px #0002" }}
      >
        <span className="text-2xl">{icons[type] || icons.info}</span>
        <span>{message}</span>
        {onClose && (
          <button
            className="ml-6 bg-white text-gray-800 px-3 py-1 text-md rounded-full shadow hover:bg-gray-200 duration-150"
            onClick={onClose}
          >
            ✕
          </button>
        )}
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-up { animation: fade-in-up 0.25s;}
      `}</style>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ Name: "", Role: "Admin" });
  const [editingId, setEditingId] = useState(null);
  const [editUser, setEditUser] = useState({});
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [loading, setLoading] = useState(true);

  const reloadUsers = () =>
    fetch("/api/users")
      .then(res => res.json())
      .then(setUsers);

  useEffect(() => {
    reloadUsers()
      .catch(() => setError("Fetch failed"))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 2500);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const result = await res.json();
    if (res.ok) {
      setNewUser({ Name: "", Role: "Admin" });
      showToast("User added!", "success");
      reloadUsers();
    } else {
      showToast(result.error || "Create failed", "error");
      setError(result.error || "Create failed");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    if (!id) {
      setError("Invalid UserId!");
      showToast("Invalid UserId!", "error");
      return;
    }
    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserId: id }),
    });
    if (res.ok) {
      showToast("User deleted!", "success");
      reloadUsers();
    } else {
      showToast("Delete failed", "error");
      setError("Delete failed");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.UserId);
    setEditUser({ ...user });
  };

  const handleEditChange = (field, value) => {
    setEditUser((eu) => ({ ...eu, [field]: value }));
  };

  const handleSave = async (id) => {
    setError("");
    if (!id) {
      setError("Invalid UserId!");
      showToast("Invalid UserId!", "error");
      return;
    }
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserId: id, ...editUser }),
    });
    const result = await res.json();
    if (res.ok) {
      setEditingId(null);
      showToast("Update successful!", "info");
      reloadUsers();
    } else {
      showToast(result.error || "Update failed", "error");
      setError(result.error || "Update failed");
    }
  };

  return (
    <main className="min-h-screen bg-green-50 px-8 py-8">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: toast.type })}
      />
      <h1 className="text-3xl font-bold text-green-700 mb-4">Users</h1>
      <section>
        <p className="text-lg text-green-700 mb-6">
          List of users who manage or access the inventory system.
        </p>
        {/* Error banner removed. Toast covers all errors now. */}
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-xl shadow mb-8 flex flex-col gap-4 md:flex-row md:items-end"
        >
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={newUser.Name}
            onChange={(e) => setNewUser((u) => ({ ...u, Name: e.target.value }))}
            required
          />
          <select
            className="border rounded px-3 py-2"
            value={newUser.Role}
            onChange={(e) => setNewUser((u) => ({ ...u, Role: e.target.value }))}
          >
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-6 py-2 text-lg transition"
          >
            Add User
          </button>
        </form>
        {loading ? (
          <div className="text-green-600 font-medium">Loading...</div>
        ) : (
          <div className="overflow-auto max-w-full">
            <table className="min-w-full border bg-white rounded-xl shadow text-left">
              <thead className="bg-green-100">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.UserId} className="border-t">
                    <td className="py-2 px-4">
                      {editingId === u.UserId ? (
                        <input
                          className="border rounded px-2 py-1"
                          value={editUser.Name}
                          onChange={(e) => handleEditChange("Name", e.target.value)}
                        />
                      ) : (
                        u.Name
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editingId === u.UserId ? (
                        <select
                          className="border rounded px-2 py-1"
                          value={editUser.Role}
                          onChange={(e) => handleEditChange("Role", e.target.value)}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Staff">Staff</option>
                        </select>
                      ) : (
                        u.Role
                      )}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      {editingId === u.UserId ? (
                        <button
                          type="button"
                          className="bg-green-600 text-white px-3 py-1 rounded"
                          onClick={() => handleSave(u.UserId)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => handleEdit(u)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        disabled={!u.UserId}
                        onClick={() => handleDelete(u.UserId)}
                      >
                        Delete
                      </button>
                    </td>
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