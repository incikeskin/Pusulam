import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { fetchClassPerformanceTrend } from "@/store/analytics/analyticsThunks";

export default function PerformanceScreen() {

    const { classID } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { classPerformanceTrend } = useAppSelector(
        state => state.analytics
    );

    useEffect(() => {
        if (!classID) return;
        dispatch(fetchClassPerformanceTrend(classID as string));
    }, [classID]);

    const data = classPerformanceTrend?.assignments || [];
    const trend = classPerformanceTrend?.trend;

    return (
        <View style={styles.page}>

            {/* HEADER */}
            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => router.push(`/teacher/class/${classID}/analytics`)}
                    style={styles.backBtn}
                >
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>

                <View>
                    <Text style={styles.headerTitle}>Performance Trend</Text>
                    <Text style={styles.headerSub}>Sınıf zaman içi performansı</Text>
                </View>

            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* TREND STATUS */}
                <View style={[
                    styles.statusCard,
                    trend === "up"
                        ? { backgroundColor: "#E8F5E9" }
                        : trend === "down"
                            ? { backgroundColor: "#FEE2E2" }
                            : { backgroundColor: "#F1F5F9" }
                ]}>

                    <Text style={styles.statusLabel}>Overall Trend</Text>

                    <Text style={[
                        styles.statusValue,
                        trend === "up"
                            ? { color: "#16A34A" }
                            : trend === "down"
                                ? { color: "#DC2626" }
                                : { color: "#64748B" }
                    ]}>
                        {trend === "up"
                            ? "📈 Improving"
                            : trend === "down"
                                ? "📉 Declining"
                                : "➡️ Stable"}
                    </Text>

                </View>

                {/* ASSIGNMENTS */}
                <View style={{ marginTop: 16 }}>

                    <Text style={styles.sectionTitle}>
                        📊 Last 5 Assignments
                    </Text>

                    {data.map((item) => {

                        const barColor =
                            item.averageScore > 70
                                ? "#22C55E"
                                : item.averageScore > 40
                                    ? "#F59E0B"
                                    : "#EF4444";

                        return (
                            <View key={item.assignmentId} style={styles.card}>

                                <Text style={styles.title}>
                                    {item.title}
                                </Text>

                                <Text style={styles.subtitle}>
                                    Average Score: {item.averageScore}%
                                </Text>

                                <Text style={styles.meta}>
                                    Participants: {item.participantCount}
                                </Text>

                                {/* PROGRESS BAR */}
                                <View style={styles.progressBg}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${item.averageScore}%`,
                                                backgroundColor: barColor
                                            }
                                        ]}
                                    />
                                </View>

                            </View>
                        );
                    })}

                </View>

            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({

    page: {
        flex: 1,
        backgroundColor: "#F8FAFC"
    },

    /* HEADER */
    header: {
        backgroundColor: "#1087BB",
        paddingTop: 45,
        paddingBottom: 18,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },

    backBtn: {
        marginRight: 6
    },

    headerTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
    },

    headerSub: {
        color: "white",
        fontSize: 12,
        opacity: 0.9
    },

    container: {
        padding: 16,
        paddingBottom: 40
    },

    /* STATUS CARD */
    statusCard: {
        padding: 16,
        borderRadius: 16,
        marginTop: 16
    },

    statusLabel: {
        fontSize: 14,
        color: "#64748B"
    },

    statusValue: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 6
    },

    /* SECTION */
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 10
    },

    /* CARD */
    card: {
        backgroundColor: "white",
        padding: 14,
        borderRadius: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
    },

    title: {
        fontSize: 15,
        fontWeight: "600",
        color: "#0F172A"
    },

    subtitle: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 4
    },

    meta: {
        fontSize: 12,
        color: "#94A3B8",
        marginTop: 2
    },

    /* PROGRESS */
    progressBg: {
        height: 8,
        backgroundColor: "#E2E8F0",
        borderRadius: 10,
        marginTop: 10,
        overflow: "hidden"
    },

    progressFill: {
        height: 8,
        borderRadius: 10
    }
});