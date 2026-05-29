import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
    fetchGeneralLeaderboard,
    fetchClassPerformanceTrend
} from "@/store/analytics/analyticsThunks";

export default function AnalyticsDashboard() {

    const { classID } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        generalLeaderboard,
        classPerformanceTrend
    } = useAppSelector(state => state.analytics);

    useEffect(() => {
        if (!classID) return;

        dispatch(fetchGeneralLeaderboard(classID as string));
        dispatch(fetchClassPerformanceTrend(classID as string));

    }, [classID]);

    const topStudents = generalLeaderboard?.leaderboard?.slice(0, 3) || [];
    const trendData = classPerformanceTrend?.assignments || [];

    const maxValue = Math.max(...trendData.map(i => i.averageScore || 0), 1);

    return (
        <View style={styles.page}>

            {/* HEADER */}
            <View style={styles.header}>

                {/* BACK BUTTON */}
                <TouchableOpacity
                    onPress={() => router.push(`/teacher/class/${classID}`)}
                    style={styles.backBtn}
                >
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>

                <View>
                    <Text style={styles.headerTitle}>Analizler</Text>
                    <Text style={styles.headerSub}>Sınıf Performansı</Text>
                </View>

            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* CLASS AVERAGE */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Ortalama Sınıf Skoru</Text>
                    <Text style={styles.cardValue}>
                        {generalLeaderboard?.classAverage ?? 0}%
                    </Text>
                </View>

                {/* TREND CHART */}
                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>📈 Ödev Performans Eğilimi </Text>

                    <Text style={styles.legend}>
                        Her bir bar bir ödevin ortalama skorunu temsil eder.
                    </Text>

                    <View style={styles.chart}>

                        {trendData.map((item) => {
                            const heightPercent = (item.averageScore / maxValue) * 100;

                            return (
                                <View key={item.assignmentId} style={styles.barWrapper}>

                                    {/* SCORE LABEL */}
                                    <Text style={styles.barValue}>
                                        {item.averageScore}%
                                    </Text>

                                    {/* BAR */}
                                    <View
                                        style={[
                                            styles.bar,
                                            { height: `${heightPercent}%` }
                                        ]}
                                    />

                                    {/* TITLE */}
                                    <Text
                                        style={styles.barLabel}
                                        numberOfLines={2}
                                    >
                                        {item.title}
                                    </Text>

                                </View>
                            );
                        })}

                    </View>

                </View>

                {/* TOP STUDENTS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏆 Öğrenci İlk Üç</Text>

                    {topStudents.map((item) => (
                        <View key={item.studentId} style={styles.listCard}>
                            <Text style={styles.studentName}>
                                {item.rank}. {item.first_name} {item.last_name}
                            </Text>
                            <Text style={styles.studentScore}>
                                Score: {item.score}%
                            </Text>
                        </View>
                    ))}
                </View>

                {/* BUTTONS */}
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity
                        onPress={() =>
                            router.push(`/teacher/class/${classID}/analytics/leaderboard`)
                        }
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Sınıf Sıralamasını Görüntüle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            router.push(`/teacher/class/${classID}/analytics/performance`)
                        }
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Performans Analizi</Text>
                    </TouchableOpacity>


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

    /* CARD */
    card: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 16,
        marginTop: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3
    },

    cardLabel: {
        fontSize: 14,
        color: "#64748B"
    },

    cardValue: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#0F172A",
        marginTop: 6
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 6
    },

    legend: {
        fontSize: 12,
        color: "#64748B",
        marginBottom: 12,
        paddingBottom:12
    },

    /* CHART */
    chart: {
        height: 200,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginTop: 10
    },

    barWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 2
    },

    bar: {
        width: 14,
        backgroundColor: "#1087BB",
        borderRadius: 6,
        minHeight: 10
    },

    barValue: {
        fontSize: 10,
        color: "#0F172A",
        marginBottom: 4,
        fontWeight: "600"
    },

    barLabel: {
        fontSize: 10,
        color: "#64748B",
        marginTop: 6,
        textAlign: "center"
    },

    /* LIST */
    section: {
        marginTop: 20
    },

    listCard: {
        backgroundColor: "white",
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#EEF2F7"
    },

    studentName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0F172A"
    },

    studentScore: {
        marginTop: 4,
        fontSize: 13,
        color: "#64748B"
    },

    /* BUTTON */
    button: {
        backgroundColor: "#1087BB",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10
    },

    buttonText: {
        color: "white",
        fontWeight: "600"
    }
});