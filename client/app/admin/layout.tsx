"use client";

import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r px-6 py-8">
                <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

                <nav className="flex flex-col gap-4">
                    <Link href="/admin" className="text-gray-700 hover:text-black">
                        Dashboard
                    </Link>
                    <Link href="/admin/users" className="text-gray-700 hover:text-black">
                        Kullanıcılar
                    </Link>
                    <Link
                        href="/admin/classes"
                        className="text-gray-700 hover:text-black"
                    >
                        Sınıflar
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="text-gray-700 hover:text-black"
                    >
                        Kategoriler
                    </Link>
                    <Link
                        href="/admin/questions"
                        className="text-gray-700 hover:text-black"
                    >
                        Sorular
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
