import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function SolveAssignmentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const assignmentId = params.assignmentId;

    // 🔹 Statik demo veriler
    const [assignment] = useState({
        title: "Matematik Ödevi 1",
        description: "Bu ödevde toplama ve çıkarma soruları bulunmaktadır."
    });

    const [questions, setQuestions] = useState([
        {
            _id: "q1",
            question: { text: "1 + 1 kaçtır?", options: [{ _id: "o1", text: "2" }, { _id: "o2", text: "3" }] },
        },
        {
            _id: "q2",
            question: { text: "13+3-5", options: [{ _id: "o1", text: "12" }, { _id: "o2", text: "11" }] },
        },
    ]);

    const [studentAnswers, setStudentAnswers] = useState<{ questionId: string; selectedOptionId: string }[]>([]);

    /* ---------------- HELPERS ---------------- */
    const getSelectedOptionId = (questionId: string) => {
        return studentAnswers.find(a => a.questionId === questionId)?.selectedOptionId;
    };

    const handleSelectOption = (questionId: string, optionId: string) => {
        setStudentAnswers(prev => {
            const existing = prev.find(a => a.questionId === questionId);
            if (existing) {
                return prev.map(a => a.questionId === questionId ? { ...a, selectedOptionId: optionId } : a);
            } else {
                return [...prev, { questionId, selectedOptionId: optionId }];
            }
        });
    };

    const totalQuestions = questions.length;
    const solvedCount = studentAnswers.length;
    const progressPercent = totalQuestions === 0 ? 0 : Math.round((solvedCount / totalQuestions) * 100);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            {/* 🔹 HEADER */}
            <Text style={styles.header}>{assignment.title}</Text>
            {assignment.description && (
                <Text style={styles.description}>{assignment.description}</Text>
            )}

            {/* 🔹 PROGRESS */}
            <View style={styles.progressCard}>
                <View style={styles.progressRow}>
                    <Text>{solvedCount} / {totalQuestions} soru çözüldü</Text>
                    <Text>%{progressPercent} tamamlandı</Text>
                </View>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>
            </View>

            {/* 🔹 SORULAR */}
            {questions.map((q, index) => {
                const selectedOptionId = getSelectedOptionId(q._id);
                return (
                    <View key={q._id} style={styles.card}>
                        <Text style={styles.questionTitle}>{index + 1}. {q.question.text}</Text>
                        {q.question.options?.map(option => (
                            <TouchableOpacity
                                key={option._id}
                                style={[
                                    styles.optionButton,
                                    selectedOptionId === option._id && styles.optionSelected
                                ]}
                                onPress={() => handleSelectOption(q._id, option._id)}
                            >
                                <Text style={styles.optionText}>{option.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            })}

            {/* 🔹 ACTION BUTTON */}
            <TouchableOpacity
                style={styles.finishButton}
                onPress={() => router.push(`..//(tabs)/student/assignment/[assignmentID]/result/index`)}
            >
                <Text style={styles.finishButtonText}>Ödevi Bitir ve Sonuçları Gör</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    header: { fontSize: 22, fontWeight: "bold", color: "#1087BB", marginBottom: 8 },
    description: { fontSize: 14, color: "#555", marginBottom: 16 },
    progressCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    progressBarBackground: { width: "100%", height: 8, backgroundColor: "#e2e8f0", borderRadius: 4 },
    progressBarFill: { height: "100%", backgroundColor: "#1087BB", borderRadius: 4 },
    card: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
    questionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
    optionButton: { padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 6 },
    optionSelected: { borderColor: "#1087BB", backgroundColor: "#1087BB20" },
    optionText: { fontSize: 14, color: "#111" },
    finishButton: { marginTop: 24, backgroundColor: "#1087BB", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
    finishButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});