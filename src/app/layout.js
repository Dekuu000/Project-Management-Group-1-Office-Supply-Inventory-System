import './globals.css';
import Sidebar from './sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex">
        <Sidebar />
        <main className="flex-1 px-10 py-8">{children}</main>
      </body>
    </html>
  );
}