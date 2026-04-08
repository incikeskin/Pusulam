import {useEffect, useState} from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
    fetchStudentResult,
    fetchStudentAnswers
} from "@/store/assignmentResult/assignmentResultThunks";

import {
    fetchAssignmentFull
} from "@/store/assignmentDetail/assignmentDetailThunks";

import axiosInstance from "@/utils/axiosInstance";

export default function StudentAssignmentResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const assignmentId = params.assignmentID as string;


    const dispatch = useAppDispatch();

    const { user } = useAppSelector((state) => state.auth);
    const { studentResult, studentAnswers, loading, error } =
        useAppSelector((state) => state.assignmentResult);
    const { assignment } =
        useAppSelector((state) => state.assignmentDetail);

    const studentId = user?._id;

    const [classRanking, setClassRanking] = useState<any>(null);

    /* ---------------- FETCH DATA ---------------- */
    useEffect(() => {
        if (!assignmentId || !studentId) return;

        dispatch(fetchStudentResult({ assignmentId, studentId }));
        dispatch(fetchStudentAnswers({ assignmentId, studentId }));
        dispatch(fetchAssignmentFull(assignmentId));
    }, [assignmentId, studentId]);

    /* ---------------- FETCH CLASS RANKING ---------------- */
    useEffect(() => {
        const fetchRanking = async () => {
            if (!assignment?.class?._id || !assignmentId || !studentId) return;

            try {
                const res = await axiosInstance.get(
                    `/api/studentAnswers/class-ranking/${assignmentId}/${assignment.class._id}/${studentId}`
                );
                setClassRanking(res.data.data);
            } catch (err) {
                console.log("Ranking error:", err);
            }
        };

        fetchRanking();
    }, [assignment, assignmentId, studentId]);

    /* ---------------- LOADING / ERROR ---------------- */
    if (!studentId) {
        return <Text style={styles.centerText}>Öğrenci bulunamadı</Text>;
    }

    if (loading) {
        return <Text style={styles.centerText}>Yükleniyor...</Text>;
    }

    if (error) {
        return <Text style={styles.centerText}>{error}</Text>;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("/student")}
            >
                <Text style={styles.backText}>← Geri</Text>
            </TouchableOpacity>
            {/* 🔹 HEADER */}
            <Text style={styles.header}>Ödev Sonucu</Text>

            {/* 🔹 RESULT */}
            {studentResult && (
                <View style={styles.card}>
                    <View style={styles.resultRow}>
                        <View style={styles.resultItem}>
                            <Text style={styles.resultNumber}>{studentResult.total}</Text>
                            <Text style={styles.resultLabel}>Toplam</Text>
                        </View>
                        <View style={styles.resultItem}>
                            <Text style={[styles.resultNumber, { color: "green" }]}>
                                {studentResult.correct}
                            </Text>
                            <Text style={styles.resultLabel}>Doğru</Text>
                        </View>
                        <View style={styles.resultItem}>
                            <Text style={[styles.resultNumber, { color: "red" }]}>
                                {studentResult.incorrect}
                            </Text>
                            <Text style={styles.resultLabel}>Yanlış</Text>
                        </View>
                        <View style={styles.resultItem}>
                            <Text style={[styles.resultNumber, { color: "#1087BB" }]}>
                                %{studentResult.score_percent}
                            </Text>
                            <Text style={styles.resultLabel}>Başarı</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* 🔹 CLASS RANKING */}
            {classRanking && (
                <>
                    <Text style={[styles.header, { marginTop: 24 }]}>
                        Sınıf Sıralaması
                    </Text>

                    <View style={styles.card}>
                        <View style={styles.resultRow}>
                            <View style={styles.resultItem}>
                                <Text style={styles.resultNumber}>
                                    {classRanking.studentScore}
                                </Text>
                                <Text style={styles.resultLabel}>Sen</Text>
                            </View>
                            <View style={styles.resultItem}>
                                <Text style={styles.resultNumber}>
                                    {classRanking.classAverage}
                                </Text>
                                <Text style={styles.resultLabel}>Ortalama</Text>
                            </View>
                            <View style={styles.resultItem}>
                                <Text style={styles.resultNumber}>
                                    {classRanking.rank}
                                </Text>
                                <Text style={styles.resultLabel}>Sıra</Text>
                            </View>
                            <View style={styles.resultItem}>
                                <Text style={styles.resultNumber}>
                                    {classRanking.totalStudents}
                                </Text>
                                <Text style={styles.resultLabel}>Toplam</Text>
                            </View>
                        </View>
                    </View>
                </>
            )}

            {/* 🔹 ANSWERS */}
            <Text style={[styles.header, { marginTop: 24 }]}>
                Soru Detayları
            </Text>

            {studentAnswers?.length > 0 ? (
                studentAnswers.map((answer, index) => (
                    <View key={answer._id} style={styles.answerCard}>
                        <Text style={{ fontSize: 20 }}>
                            {answer.is_correct ? "✅" : "❌"}
                        </Text>

                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={{ fontWeight: "600" }}>
                                {index + 1}. {answer.question?.text}
                            </Text>

                            <Text
                                style={{
                                    color: answer.is_correct ? "green" : "red"
                                }}
                            >
                                Seçilen cevap: {answer.selected_option?.text}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={{ color: "#666" }}>
                    Cevap bulunamadı
                </Text>
            )}

            {/* 🔹 BUTTON */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/(tabs)/student")}
            >
                <Text style={styles.buttonText}>Sınıflara Dön</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 15,
        paddingTop: 20, // üst boşluk ekledik
    },
    backButton: { marginBottom: 10 },
    backText: { color: "#1087BB", fontSize: 14 },
    header: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    resultRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    resultItem: {
        alignItems: "center",
        flex: 1,
    },
    resultNumber: {
        fontSize: 20,
        fontWeight: "600",
        color: "#0F172A",
    },
    resultLabel: {
        fontSize: 12,
        color: "#94A3B8",
        marginTop: 2,
    },
    answerCard: {
        flexDirection: "row",
        backgroundColor: "#f9fafb",
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#1087BB",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    centerText: {
        textAlign: "center",
        marginTop: 50,
        color: "#64748B",
    },
});