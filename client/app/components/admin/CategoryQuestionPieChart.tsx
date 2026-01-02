"use client";

import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from "recharts";

interface Props {
    data: {
        _id: string;
        name: string;
        questionCount: number;
    }[];
}

const COLORS = [
    "#6366f1", // indigo
    "#22c55e", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#06b6d4", // cyan
    "#a855f7", // purple
];

export default function CategoryQuestionPie({ data }: Props) {
    const chartData = data
        .filter((c) => c.questionCount > 0)
        .map((c) => ({
            name: c.name,
            value: c.questionCount,
        }));

    if (chartData.length === 0) {
        return (
            <p className="text-sm text-gray-500">
                Henüz kategorilere bağlı soru yok
            </p>
        );
    }

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {chartData.map((_, index) => (
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
        </div>
    );
}
