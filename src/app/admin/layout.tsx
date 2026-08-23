"use client";

import { AdminLanguageProvider } from "./AdminLanguageContext";
import AdminNavbar from "@/components/admin/AdminNavbar"; // Adjust path to match your structure

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLanguageProvider>
      <div  >
        <AdminNavbar />
        <main  >{children}</main>
      </div>
    </AdminLanguageProvider>
  );
}