import React, { useEffect } from "react";
import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { fetchGeneralLeaderboard } from "@/store/analytics/analyticsThunks";

export default function LeaderboardScreen() {

    const { classID } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const classId = classID as string;

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
        <ScrollView style={{ flex: 1, padding: 16 }}>

            {/* HEADER */}
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                🏆 Class Leaderboard
            </Text>
            <TouchableOpacity
                onPress={() =>
                    router.push(`/teacher/class/${classId}/analytics`)
                }
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Geri</Text>
            </TouchableOpacity>

            {/* CLASS AVERAGE */}
            <View style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: "#f2f2f2",
                borderRadius: 10
            }}>
                <Text>Class Average</Text>
                <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                    {generalLeaderboard?.classAverage ?? 0}%
                </Text>
            </View>

            {/* LIST */}
            <View style={{ marginTop: 20 }}>

                {data.map((item) => {

                    // rank color logic
                    const rankColor =
                        item.rank === 1
                            ? "#ffd700"
                            : item.rank === 2
                                ? "#c0c0c0"
                                : item.rank === 3
                                    ? "#cd7f32"
                                    : "#eee";

                    return (
                        <View
                            key={item.studentId}
                            style={{
                                padding: 14,
                                marginBottom: 10,
                                backgroundColor: "white",
                                borderRadius: 12,
                                borderLeftWidth: 6,
                                borderLeftColor: rankColor
                            }}
                        >

                            {/* NAME */}
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                                {item.rank}. {item.first_name} {item.last_name}
                            </Text>

                            {/* SCORE */}
                            <Text style={{ marginTop: 4 }}>
                                Score: {item.score}%
                            </Text>

                            {/* PROGRESS BAR */}
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
                                        width: `${item.score}%`,
                                        height: 6,
                                        backgroundColor:
                                            item.score > 70
                                                ? "green"
                                                : item.score > 40
                                                    ? "orange"
                                                    : "red",
                                        borderRadius: 5
                                    }}
                                />
                            </View>

                        </View>
                    );
                })}

            </View>

        </ScrollView>
    );
}