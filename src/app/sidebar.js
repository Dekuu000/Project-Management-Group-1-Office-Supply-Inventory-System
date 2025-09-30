"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`block px-4 py-3 mb-2 rounded font-bold text-lg transition
        ${isActive ? 'bg-blue-700 text-white shadow' : 'text-blue-800 hover:bg-blue-100 hover:text-blue-900'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col py-10 px-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-8 px-2">Office Inventory</h2>
      <nav>
        <NavLink href="/">Dashboard</NavLink>
        <NavLink href="/supplies">Supplies</NavLink>
        <NavLink href="/users">Users</NavLink>
        <NavLink href="/transactions">Transactions</NavLink>
        <NavLink href="/reports">Reports</NavLink>
        <NavLink href="/suppliers">Suppliers</NavLink>
      </nav>
    </aside>
  );
}