import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { fetchGeneralLeaderboard } from "@/store/analytics/analyticsThunks";

export default function LeaderboardScreen() {

    const { classID } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { generalLeaderboard } = useAppSelector(
        state => state.analytics
    );

    useEffect(() => {
        if (!classID) return;
        dispatch(fetchGeneralLeaderboard(classID as string));
    }, [classID]);

    const data = generalLeaderboard?.leaderboard || [];

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
                    <Text style={styles.headerTitle}>Leaderboard</Text>
                    <Text style={styles.headerSub}>Sınıf sıralaması</Text>
                </View>

            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* CLASS AVERAGE */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Class Average</Text>
                    <Text style={styles.cardValue}>
                        {generalLeaderboard?.classAverage ?? 0}%
                    </Text>
                </View>

                {/* LIST */}
                <View style={{ marginTop: 16 }}>

                    {data.map((item) => {

                        const rankColor =
                            item.rank === 1
                                ? "#FACC15"
                                : item.rank === 2
                                    ? "#CBD5E1"
                                    : item.rank === 3
                                        ? "#CD7F32"
                                        : "#E2E8F0";

                        const progressColor =
                            item.score > 70
                                ? "#22C55E"
                                : item.score > 40
                                    ? "#F59E0B"
                                    : "#EF4444";

                        return (
                            <View key={item.studentId} style={styles.card}>

                                {/* TOP ROW */}
                                <View style={styles.row}>
                                    <View style={[styles.rankBadge, { backgroundColor: rankColor }]}>
                                        <Text style={styles.rankText}>{item.rank}</Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.name}>
                                            {item.first_name} {item.last_name}
                                        </Text>
                                        <Text style={styles.scoreText}>
                                            Score: {item.score}%
                                        </Text>
                                    </View>
                                </View>

                                {/* PROGRESS */}
                                <View style={styles.progressBg}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${item.score}%`,
                                                backgroundColor: progressColor
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

    /* CARD */
    card: {
        backgroundColor: "white",
        padding: 14,
        borderRadius: 16,
        marginBottom: 12,
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

    /* ROW */
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },

    /* RANK BADGE */
    rankBadge: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    rankText: {
        fontWeight: "bold",
        color: "#0F172A"
    },

    name: {
        fontSize: 15,
        fontWeight: "600",
        color: "#0F172A"
    },

    scoreText: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 2
    },

    /* PROGRESS */
    progressBg: {
        height: 8,
        backgroundColor: "#E2E8F0",
        borderRadius: 10,
        overflow: "hidden"
    },

    progressFill: {
        height: 8,
        borderRadius: 10
    }
});