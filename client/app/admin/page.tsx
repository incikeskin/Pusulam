"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAdminDashboardStats } from "@/redux/admin-store/adminThunks";
import UserRolePieChart from "@/app/components/admin/UserRolePieChart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
    const dispatch = useAppDispatch();

    const { stats, loading, error } = useAppSelector(
        (state) => state.adminDashboard
    );

    useEffect(() => {
        dispatch(fetchAdminDashboardStats());
    }, [dispatch]);

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard title="Toplam Sınıf" value={stats?.classCount} />
                <StatCard title="Toplam Öğrenci" value={stats?.studentCount} />
                <StatCard title="Toplam Öğretmen" value={stats?.teacherCount} />
                <StatCard title="Toplam Ödev" value={stats?.assignmentCount} />
                <StatCard title="Toplam Soru" value={stats?.questionCount} />
            </div>

            {/* Chart Area */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Kullanıcı Rol Dağılımı</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <UserRolePieChart
                                studentCount={stats.studentCount}
                                teacherCount={stats.teacherCount}
                                adminCount={stats.adminCount}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({
                      title,
                      value,
                  }: {
    title: string;
    value?: number;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{value ?? "-"}</p>
            </CardContent>
        </Card>
    );
}

