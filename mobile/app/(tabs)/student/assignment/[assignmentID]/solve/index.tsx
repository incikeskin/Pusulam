import { useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { fetchAssignmentFull } from "@/store/assignmentDetail/assignmentDetailThunks";
import {
    fetchStudentAnswers,
    addStudentAnswer
} from "@/store/assignmentResult/assignmentResultThunks";

export default function SolveAssignmentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // 🔥 PARAM DİKKAT (case!)
    const assignmentId = params.assignmentID as string;

    const dispatch = useAppDispatch();

    const { assignment, questions } =
        useAppSelector((state) => state.assignmentDetail);

    const { studentAnswers } =
        useAppSelector((state) => state.assignmentResult);

    const { user } = useAppSelector((state) => state.auth);

    const studentId = user?._id;

    /* ---------------- FETCH DATA ---------------- */
    useEffect(() => {
        if (!assignmentId || !studentId) return;

        dispatch(fetchAssignmentFull(assignmentId));
        dispatch(fetchStudentAnswers({ assignmentId, studentId }));
    }, [assignmentId, studentId]);

    /* ---------------- HELPERS ---------------- */
    const getSelectedOptionId = (questionId: string) => {
        return studentAnswers.find(
            (a: any) => a.question._id === questionId
        )?.selected_option?._id;
    };

    const handleSelectOption = (questionId: string, optionId: string) => {
        if (!studentId) return;

        dispatch(
            addStudentAnswer({
                studentId,
                assignmentId,
                questionId,
                selectedOptionId: optionId
            })
        ).then(() => {
            dispatch(fetchStudentAnswers({ assignmentId, studentId }));
        });
    };

    const totalQuestions = questions.length;
    const solvedCount = studentAnswers.length;

    const progressPercent =
        totalQuestions === 0
            ? 0
            : Math.round((solvedCount / totalQuestions) * 100);

    if (!assignment) return <Text style={styles.centerText}>Yükleniyor...</Text>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>

            {/* 🔹 HEADER */}
            <Text style={styles.header}>{assignment.title}</Text>

            {assignment.description && (
                <Text style={styles.description}>
                    {assignment.description}
                </Text>
            )}

            {/* 🔹 PROGRESS */}
            <View style={styles.progressCard}>
                <View style={styles.progressRow}>
                    <Text>{solvedCount} / {totalQuestions} soru çözüldü</Text>
                    <Text>%{progressPercent}</Text>
                </View>

                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${progressPercent}%` }
                        ]}
                    />
                </View>
            </View>

            {/* 🔹 QUESTIONS */}
            {questions.map((q: any, index: number) => {
                const selectedOptionId = getSelectedOptionId(q.question._id);

                return (
                    <View key={q._id} style={styles.card}>
                        <Text style={styles.questionTitle}>
                            {index + 1}. {q.question.text}
                        </Text>

                        {q.question.options?.map((option: any) => (
                            <TouchableOpacity
                                key={option._id}
                                style={[
                                    styles.optionButton,
                                    selectedOptionId === option._id &&
                                    styles.optionSelected
                                ]}
                                onPress={() =>
                                    handleSelectOption(
                                        q.question._id,
                                        option._id
                                    )
                                }
                            >
                                <Text style={styles.optionText}>
                                    {option.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            })}

            {/* 🔹 FINISH BUTTON */}
            <TouchableOpacity
                style={styles.finishButton}
                onPress={() =>
                    router.push(`/student/assignment/${assignmentId}/result`)
                }
            >
                <Text style={styles.finishButtonText}>
                    Ödevi Bitir ve Sonuçları Gör
                </Text>
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
    header: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 8,
    },
    description: {
        color: "#64748B",
        marginBottom: 16,
        fontSize: 14,
    },
    progressCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: "#e5e7eb",
        borderRadius: 4,
    },
    progressBarFill: {
        height: 8,
        backgroundColor: "#1087BB",
        borderRadius: 4,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    questionTitle: {
        fontWeight: "600",
        marginBottom: 8,
        color: "#0F172A",
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: "#f9fafb",
    },
    optionSelected: {
        borderColor: "#1087BB",
        backgroundColor: "#1087BB20",
    },
    optionText: {
        color: "#0F172A",
        fontSize: 14,
    },
    finishButton: {
        marginTop: 24,
        backgroundColor: "#1087BB",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    finishButtonText: {
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