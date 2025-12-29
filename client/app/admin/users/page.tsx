"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUsersByRole } from "@/redux/admin-store/adminThunks";
import { deleteUser } from "@/redux/admin-store/adminThunks";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";


type RoleTab = "student" | "teacher" | "Admin";

export default function AdminUsersPage() {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<RoleTab>("student");

    const { students, teachers, admins, loading, error } = useAppSelector(
        (state) => state.adminUsers
    );

    useEffect(() => {
        dispatch(fetchUsersByRole("student"));
        dispatch(fetchUsersByRole("teacher"));
        dispatch(fetchUsersByRole("Admin"));
    }, [dispatch]);
    const [search, setSearch] = useState("");

    const users =
        activeTab === "student"
            ? students
            : activeTab === "teacher"
                ? teachers
                : admins;
    const filteredUsers = users.filter((user) => {
        const text = `${user.first_name} ${user.last_name} ${user.email} ${user.phone_number || ""}`
            .toLowerCase();

        return text.includes(search.toLowerCase());
    });

    const handleDelete = (userId: string) => {
        if (confirm("Kullanıcı silinsin mi?")) {
            dispatch(deleteUser(userId));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Kullanıcı Yönetimi</h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <TabButton
                    active={activeTab === "student"}
                    onClick={() => setActiveTab("student")}
                >
                    Öğrenciler
                </TabButton>
                <TabButton
                    active={activeTab === "teacher"}
                    onClick={() => setActiveTab("teacher")}
                >
                    Öğretmenler
                </TabButton>
                <TabButton
                    active={activeTab === "Admin"}
                    onClick={() => setActiveTab("Admin")}
                >
                    Adminler
                </TabButton>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="İsim, email veya telefon ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {activeTab === "student"
                            ? "Öğrenciler"
                            : activeTab === "teacher"
                                ? "Öğretmenler"
                                : "Adminler"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading && <p>Yükleniyor...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!loading && filteredUsers.length === 0 && (
                        <p className="text-gray-500">Kullanıcı bulunamadı.</p>
                    )}

                    {!loading && filteredUsers.length > 0 && (
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Ad Soyad</th>
                                <th className="text-left py-2">Email</th>
                                <th className="text-left py-2">Telefon</th>
                                <th className="text-left py-2">Durum</th>
                                <th className="text-right py-2">İşlem</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-b last:border-0"
                                >
                                    <td className="py-2">
                                        {user.first_name} {user.last_name}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.phone_number || "-"}</td>
                                    <td>
                                        {user.is_active ? (
                                            <span className="text-green-600">
                                                    Aktif
                                                </span>
                                        ) : (
                                            <span className="text-red-600">
                                                    Pasif
                                                </span>
                                        )}
                                    </td>
                                    <td className="text-right">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(user._id)
                                            }
                                        >
                                            Sil
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function TabButton({
                       children,
                       active,
                       onClick,
                   }: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <Button
            variant={active ? "default" : "outline"}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}
