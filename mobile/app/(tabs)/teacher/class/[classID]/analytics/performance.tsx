import React, { useEffect } from "react";
import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { fetchClassPerformanceTrend } from "@/store/analytics/analyticsThunks";

export default function PerformanceScreen() {

    const { classID } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const classId = classID as string;
    const { classPerformanceTrend } = useAppSelector(
        state => state.analytics
    );

    useEffect(() => {
        if (!classID) return;
        dispatch(fetchClassPerformanceTrend(classID as string));
    }, [classID]);
    const router = useRouter();
    const data = classPerformanceTrend?.assignments || [];
    const trend = classPerformanceTrend?.trend;

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>

            {/* HEADER */}
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                📈 Class Performance Trend
            </Text>
            <TouchableOpacity
                onPress={() =>
                    router.push(`/teacher/class/${classId}/analytics`)
                }
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Geri</Text>
            </TouchableOpacity>
            {/* TREND STATUS */}
            <View style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 10,
                backgroundColor:
                    trend === "up"
                        ? "#e8f5e9"
                        : trend === "down"
                            ? "#ffebee"
                            : "#f5f5f5"
            }}>
                <Text style={{ fontSize: 16 }}>
                    Overall Trend:
                </Text>

                <Text style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color:
                        trend === "up"
                            ? "green"
                            : trend === "down"
                                ? "red"
                                : "gray"
                }}>
                    {trend === "up"
                        ? "📈 Improving"
                        : trend === "down"
                            ? "📉 Declining"
                            : "➡️ Stable"}
                </Text>
            </View>

            {/* LIST OF ASSIGNMENTS */}
            <View style={{ marginTop: 20 }}>

                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    Last 5 Assignments
                </Text>

                {data.map((item) => (
                    <View
                        key={item.assignmentId}
                        style={{
                            marginTop: 10,
                            padding: 14,
                            backgroundColor: "white",
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "#eee"
                        }}
                    >

                        <Text style={{ fontWeight: "bold" }}>
                            {item.title}
                        </Text>

                        <Text style={{ marginTop: 5 }}>
                            Average Score: {item.averageScore}%
                        </Text>

                        <Text style={{ fontSize: 12, color: "gray" }}>
                            Participants: {item.participantCount}
                        </Text>

                        {/* BAR VISUAL */}
                        <View
                            style={{
                                height: 6,
                                backgroundColor: "#eee",
                                borderRadius: 5,
                                marginTop: 8
                            }}
                        >
                            <View
                                style={{
                                    width: `${item.averageScore}%`,
                                    height: 6,
                                    backgroundColor:
                                        item.averageScore > 70
                                            ? "green"
                                            : item.averageScore > 40
                                                ? "orange"
                                                : "red",
                                    borderRadius: 5
                                }}
                            />
                        </View>

                    </View>
                ))}

            </View>

        </ScrollView>
    );
}