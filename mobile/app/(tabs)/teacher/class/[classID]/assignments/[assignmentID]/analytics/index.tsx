import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { fetchMostWrongQuestions } from "@/store/analytics/analyticsThunks";

export default function QuestionsScreen() {

    const { classID, assignmentID } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const classId = classID as string;
    const assignmentId = assignmentID as string;

    const { mostWrongQuestions } = useAppSelector(
        state => state.analytics
    );

    useEffect(() => {

        if (!assignmentId) return;

        dispatch(fetchMostWrongQuestions(assignmentId));

    }, [assignmentId]);

    const data = mostWrongQuestions || [];

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>

            {/* HEADER */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                    ❌ Wrong Questions
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        router.back()
                    }
                >
                    <Text style={{ color: "#1e88e5", fontWeight: "bold" }}>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={{ color: "gray", marginTop: 6 }}>
                Assignment-based question analysis
            </Text>

            {/* LIST */}
            <View style={{ marginTop: 20 }}>

                {data.length === 0 && (
                    <Text style={{ color: "gray" }}>
                        No data found for this assignment
                    </Text>
                )}

                {data.map((item, index) => {

                    const riskColor =
                        item.wrongCount > 10
                            ? "#d32f2f"
                            : item.wrongCount > 5
                                ? "#f57c00"
                                : "#388e3c";

                    return (
                        <View
                            key={item.questionId}
                            style={{
                                marginBottom: 12,
                                padding: 14,
                                backgroundColor: "white",
                                borderRadius: 12,
                                borderLeftWidth: 6,
                                borderLeftColor: riskColor
                            }}
                        >

                            <Text style={{ fontWeight: "bold" }}>
                                #{index + 1}
                            </Text>

                            <Text style={{ marginTop: 6 }}>
                                {item.text}
                            </Text>

                            <View style={{
                                marginTop: 8,
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <Text>
                                    Difficulty: {item.difficulty}
                                </Text>

                                <Text style={{
                                    fontWeight: "bold",
                                    color: riskColor
                                }}>
                                    Wrong: {item.wrongCount}
                                </Text>
                            </View>

                            {/* BAR */}
                            <View
                                style={{
                                    height: 6,
                                    backgroundColor: "#eee",
                                    borderRadius: 5,
                                    marginTop: 10
                                }}
                            >
                                <View
                                    style={{
                                        width: `${Math.min(item.wrongCount * 10, 100)}%`,
                                        height: 6,
                                        backgroundColor: riskColor,
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