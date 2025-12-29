"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b"]; // blue, green, amber

interface Props {
    studentCount: number;
    teacherCount: number;
    adminCount: number;
}

export default function UserRolePieChart({
                                             studentCount,
                                             teacherCount,
                                             adminCount,
                                         }: Props) {
    const data = [
        { name: "Öğrenci", value: studentCount },
        { name: "Öğretmen", value: teacherCount },
        { name: "Admin", value: adminCount },
    ];

    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                >
                    {data.map((_, index) => (
                        <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
