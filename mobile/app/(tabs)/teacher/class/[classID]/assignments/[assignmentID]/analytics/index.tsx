import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
    fetchMostWrongQuestions,
    fetchCompletionRate
} from "@/store/analytics/analyticsThunks";

export default function QuestionsScreen() {

    const { classID, assignmentID } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { mostWrongQuestions, completionRate } = useAppSelector(
        state => state.analytics
    );

    useEffect(() => {
        if (!assignmentID || !classID) return;

        dispatch(fetchMostWrongQuestions(assignmentID as string));

        dispatch(fetchCompletionRate({
            assignmentId: assignmentID as string,
            classId: classID as string
        }));
    }, [assignmentID, classID]);

    const data = mostWrongQuestions || [];
    const totalStudents = completionRate?.totalStudents || 0;

    return (
        <View style={styles.page}>

            {/* HEADER */}
            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backBtn}
                >
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>

                <View>
                    <Text style={styles.headerTitle}>Wrong Questions</Text>
                    <Text style={styles.headerSub}>Assignment analysis</Text>
                </View>

            </View>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >

                {data.length === 0 && (
                    <Text style={styles.emptyText}>
                        No data found for this assignment
                    </Text>
                )}

                {data.map((item, index) => {

                    const wrongRate =
                        totalStudents > 0
                            ? item.wrongCount / totalStudents
                            : 0;

                    const riskColor =
                        wrongRate >= 0.55
                            ? "#EF4444"   // HIGH RISK
                            : wrongRate <= 0.45
                                ? "#22C55E" // LOW RISK
                                : "#F59E0B"; // MEDIUM RISK

                    return (
                        <View key={item.questionId} style={styles.card}>

                            {/* TOP */}
                            <View style={styles.row}>

                                <View style={[styles.badge, { backgroundColor: riskColor }]}>
                                    <Text style={styles.badgeText}>
                                        {index + 1}
                                    </Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.questionText}>
                                        {item.text}
                                    </Text>
                                </View>

                            </View>

                            {/* INFO ROW */}
                            <View style={styles.infoRow}>
                                <Text style={styles.meta}>
                                    Difficulty: {item.difficulty}
                                </Text>

                                <Text style={[styles.meta, { color: riskColor, fontWeight: "600" }]}>
                                    Wrong: {item.wrongCount} ({Math.round(wrongRate * 100)}%)
                                </Text>
                            </View>

                            {/* PROGRESS */}
                            <View style={styles.progressBg}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        {
                                            width: `${Math.min(wrongRate * 100, 100)}%`,
                                            backgroundColor: riskColor
                                        }
                                    ]}
                                />
                            </View>

                        </View>
                    );
                })}

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

    emptyText: {
        color: "#64748B",
        textAlign: "center",
        marginTop: 30
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

    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10
    },

    badge: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },

    badgeText: {
        color: "white",
        fontWeight: "bold"
    },

    questionText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0F172A"
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },

    meta: {
        fontSize: 12,
        color: "#64748B"
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