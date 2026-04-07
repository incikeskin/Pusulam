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
        backgroundColor: "#f5f5f5"
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8
    },
    description: {
        color: "#666",
        marginBottom: 16
    },
    progressCard: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 16
    },
    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: "#ddd",
        borderRadius: 10
    },
    progressBarFill: {
        height: 8,
        backgroundColor: "#1087BB",
        borderRadius: 10
    },
    card: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10
    },
    questionTitle: {
        fontWeight: "600",
        marginBottom: 8
    },
    optionButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 6
    },
    optionSelected: {
        borderColor: "#1087BB",
        backgroundColor: "#1087BB20"
    },
    optionText: {
        color: "#333"
    },
    finishButton: {
        marginTop: 20,
        backgroundColor: "#1087BB",
        padding: 14,
        borderRadius: 10,
        alignItems: "center"
    },
    finishButtonText: {
        color: "#fff",
        fontWeight: "bold"
    },
    centerText: {
        textAlign: "center",
        marginTop: 50
    }
});