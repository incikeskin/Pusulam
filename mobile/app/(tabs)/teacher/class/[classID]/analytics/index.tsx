import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { StyleSheet } from "react-native";
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
        classPerformanceTrend,
        loading
    } = useAppSelector(state => state.analytics);

    useEffect(() => {

        if (!classID) return;

        dispatch(fetchGeneralLeaderboard(classID as string));
        dispatch(fetchClassPerformanceTrend(classID as string));

    }, [classID]);

    const topStudents = generalLeaderboard?.leaderboard?.slice(0, 3) || [];

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>

            {/* HEADER */}
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                📊 Class Analytics
            </Text>

            {/* CLASS AVERAGE */}
            <View style={{
                marginTop: 20,
                padding: 16,
                backgroundColor: "#f2f2f2",
                borderRadius: 12
            }}>
                <Text style={{ fontSize: 14 }}>Class Average</Text>
                <Text style={{ fontSize: 32, fontWeight: "bold" }}>
                    {generalLeaderboard?.classAverage ?? 0}%
                </Text>
            </View>

            {/* TOP 3 STUDENTS */}
            <View style={{ marginTop: 20 }}>

                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    🏆 Top Students
                </Text>

                {topStudents.map((item, index) => (
                    <View
                        key={item.studentId}
                        style={{
                            marginTop: 10,
                            padding: 12,
                            backgroundColor: "white",
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "#eee"
                        }}
                    >
                        <Text>
                            {item.rank}. {item.first_name} {item.last_name}
                        </Text>

                        <Text style={{ fontWeight: "bold" }}>
                            Score: {item.score}%
                        </Text>
                    </View>
                ))}
            </View>

            {/* TREND PREVIEW */}
            <View style={{ marginTop: 20 }}>

                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    📈 Class Trend (Last 5 Assignments)
                </Text>

                {classPerformanceTrend?.assignments?.map((item) => (
                    <View
                        key={item.assignmentId}
                        style={{
                            marginTop: 8,
                            padding: 10,
                            backgroundColor: "#fff",
                            borderRadius: 8
                        }}
                    >
                        <Text>{item.title}</Text>
                        <Text>Average: {item.averageScore}%</Text>
                    </View>
                ))}
            </View>

            {/* NAVIGATION BUTTONS */}
            <View style={{ marginTop: 30 }}>

                <TouchableOpacity
                    onPress={() =>
                        router.push(`/teacher/class/${classID}/analytics/leaderboard`)
                    }
                    style={styles.btn}
                >
                    <Text style={styles.btnText}>View Full Leaderboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push(`/teacher/class/${classID}/analytics/performance`)
                    }
                    style={styles.btn}
                >
                    <Text style={styles.btnText}>Performance Analysis</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push(`/teacher/class/${classID}/analytics/questions`)
                    }
                    style={styles.btn}
                >
                    <Text style={styles.btnText}>Wrong Questions</Text>
                </TouchableOpacity>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    btn: {
        marginTop: 10,
        padding: 14,
        backgroundColor: "#1e88e5",
        borderRadius: 10,
        alignItems: "center"
    },

    btnText: {
        color: "white",
        fontWeight: "bold"
    }

});