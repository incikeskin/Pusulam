import { useEffect, useState, useCallback } from "react";
import {useFocusEffect, useLocalSearchParams, useRouter} from "expo-router";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

/* thunks */
import {
    fetchAssignmentFull,
    addQuestionToAssignment,
    removeQuestionFromAssignment,
} from "@/store/assignmentDetail/assignmentDetailThunks";

import { fetchCategories, fetchQuestionsByCategory, setSelectedCategory, setSelectedDifficulty } from "@/store/questionPool";

import {
    fetchStudentResult,
    fetchStudentAnswers,
    fetchClassRankingList,
} from "@/store/assignmentResult/assignmentResultThunks";
import { Picker } from "@react-native-picker/picker";
import { fetchClassStudents } from "@/store/classDetail/classDetailThunks";

export default function AssignmentDetailScreen() {
    const dispatch = useAppDispatch();

    const { assignmentID, classID } = useLocalSearchParams();
    const classId = classID as string;
    const assignmentIdStr = assignmentID as string;

    const [selectedStudentId, setSelectedStudentId] = useState("");

    const { assignment, questions, loading } = useAppSelector(
        (state) => state.assignmentDetail
    );
    const router = useRouter();

    const { students } = useAppSelector((state) => state.classDetail);

    const {
        categories,
        questions: poolQuestions,
        selectedCategoryId,
        selectedDifficulty,
    } = useAppSelector((state) => state.questionPool);

    const {
        studentResult,
        studentAnswers,
        classRankingList,
        loading: resultLoading,
    } = useAppSelector((state) => state.assignmentResult);

    /* ---------------- FETCH ---------------- */

    useEffect(() => {
        if (assignmentIdStr) {
            dispatch(fetchAssignmentFull(assignmentIdStr));
            dispatch(fetchCategories());
        }
    }, [assignmentIdStr]);

    useEffect(() => {
        if (classId) {
            dispatch(fetchClassStudents(classId));
        }
    }, [classId]);

    useEffect(() => {
        if (assignment?.class?._id) {
            dispatch(
                fetchClassRankingList({
                    assignmentId: assignmentIdStr,
                    classId: assignment.class._id,
                })
            );
        }
    }, [assignment]);

    useEffect(() => {
        if (selectedCategoryId) {
            dispatch(
                fetchQuestionsByCategory({
                    categoryId: selectedCategoryId,
                    difficulty: selectedDifficulty || undefined,
                })
            );
        }
    }, [selectedCategoryId, selectedDifficulty]);

    useEffect(() => {
        if (assignmentIdStr && selectedStudentId) {
            dispatch(
                fetchStudentResult({
                    assignmentId: assignmentIdStr,
                    studentId: selectedStudentId,
                })
            );
            dispatch(
                fetchStudentAnswers({
                    assignmentId: assignmentIdStr,
                    studentId: selectedStudentId,
                })
            );
        }
    }, [selectedStudentId]);

    const assignedQuestionIds = questions.map((q) => q.question._id);

    const handleAddQuestion = (questionId: string) => {
        dispatch(addQuestionToAssignment({ assignmentId: assignmentIdStr, questionId }))
            .unwrap()
            .then(() => dispatch(fetchAssignmentFull(assignmentIdStr)));
    };

    const handleRemoveQuestion = (id: string) => {
        dispatch(removeQuestionFromAssignment(id))
            .unwrap()
            .then(() => dispatch(fetchAssignmentFull(assignmentIdStr)));
    };

    if (loading || !assignment) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Yükleniyor...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                        router.push(`/teacher/class/${classId}`)
                    }
                >
                    <Text>Geri</Text>
                </TouchableOpacity>

                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{assignment.title}</Text>
                    <Text style={styles.headerSub}>{assignment.description}</Text>
                    <Text style={styles.headerClass}>
                        Sınıf: {assignment.class?.name}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.analyticsButton}
                    onPress={() =>
                        router.push(`/teacher/class/${classId}/assignments/${assignmentIdStr}/analytics`)
                    }
                >
                    <Text style={styles.analyticsButtonText}>
                        📊 Soru Analitikleri
                    </Text>
                </TouchableOpacity>

                {/* STUDENTS */}
                <View style={styles.card}>
                    <Text style={styles.title}>Öğrenciler</Text>

                    {students.map((s) => (
                        <TouchableOpacity
                            key={s.student._id}
                            style={[
                                styles.studentBtn,
                                selectedStudentId === s.student._id && styles.activeStudent,
                            ]}
                            onPress={() => setSelectedStudentId(s.student._id)}
                        >
                            <Text>
                                {s.student.first_name} {s.student.last_name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* RESULT */}
                {selectedStudentId && (
                    <View style={styles.card}>
                        <Text style={styles.title}>Sonuç</Text>

                        {resultLoading ? (
                            <ActivityIndicator />
                        ) : (
                            studentResult && (
                                <>
                                    <Text>Doğru: {studentResult.correct}</Text>
                                    <Text>Yanlış: {studentResult.incorrect}</Text>
                                    <Text>Puan: %{studentResult.score_percent}</Text>
                                </>
                            )
                        )}
                    </View>
                )}

                {/* ANSWERS */}
                {selectedStudentId && (
                    <View style={styles.card}>
                        <Text style={styles.title}>Cevaplar</Text>

                        {studentAnswers.map((a) => (
                            <View key={a._id} style={styles.answerBox}>
                                <Text>{a.question.text}</Text>
                                <Text style={{ color: a.is_correct ? "green" : "red" }}>
                                    {a.selected_option.text}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* QUESTIONS */}
                <View style={styles.card}>
                    <Text style={styles.title}>Ödev Soruları</Text>

                    {questions.map((q) => (
                        <View key={q._id} style={styles.row}>
                            <Text style={{ flex: 1 }}>{q.question.text}</Text>

                            <TouchableOpacity
                                onPress={() => handleRemoveQuestion(q._id)}
                                style={styles.deleteBtn}
                            >
                                <Text style={{ color: "white" }}>Sil</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={{ marginBottom: 10 }}>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {categories.map((c) => (
                            <TouchableOpacity
                                key={c._id}
                                onPress={() => dispatch(setSelectedCategory(c._id))}
                                style={{
                                    padding: 10,
                                    backgroundColor:
                                        selectedCategoryId === c._id ? "#1087BB" : "#eee",
                                    marginRight: 8,
                                    borderRadius: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            selectedCategoryId === c._id ? "white" : "black",
                                    }}
                                >
                                    {c.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                </View>

                {/* QUESTION POOL */}
                <View style={styles.card}>
                    <Text style={styles.title}>Soru Ekle</Text>

                    {poolQuestions.map((q) => {
                        const added = assignedQuestionIds.includes(q._id);

                        return (
                            <TouchableOpacity
                                key={q._id}
                                style={styles.poolItem}
                                onPress={() => !added && handleAddQuestion(q._id)}
                            >
                                <Text style={{ fontWeight: "600" }}>{q.text}</Text>
                                <Text style={{ color: "gray" }}>
                                    {q.category?.name} - {q.difficulty}
                                </Text>

                                {added && <Text style={{ color: "green" }}>Eklendi</Text>}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* RANKING */}
                {classRankingList && (
                    <View style={styles.card}>
                        <Text style={styles.title}>Sınıf Sıralaması</Text>

                        <Text>Ortalama: %{classRankingList.classAverage}</Text>

                        {classRankingList.ranking.map((r) => (
                            <View key={r.studentId} style={styles.row}>
                                <Text>
                                    {r.rank}. {r.first_name} {r.last_name}
                                </Text>
                                <Text>%{r.score}</Text>
                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f2f4f7" },
    container: { padding: 12 },

    filterContainer: {
        marginBottom: 12,
    },

    filterLabel: {
        fontWeight: "600",
        marginBottom: 4,
        marginTop: 8,
    },

    pickerWrapper: {
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        height: 50,
        overflow: "hidden",
    },
    header: {
        backgroundColor: "#1087BB",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
    headerSub: { color: "#e0f2fe" },
    headerClass: { color: "#e0f2fe", marginTop: 4 },
    backButton: { marginBottom: 10 },
    backText: { color: "#1087BB", fontSize: 14 },
    card: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },

    title: {
        fontWeight: "bold",
        marginBottom: 8,
    },

    studentBtn: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#f3f4f6",
        marginBottom: 6,
    },

    activeStudent: {
        backgroundColor: "#bae6fd",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },

    deleteBtn: {
        backgroundColor: "#ef4444",
        padding: 6,
        borderRadius: 6,
    },

    answerBox: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },

    poolItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    analyticsButton: {
        marginTop: 12,
        padding: 12,
        backgroundColor: "#6a1b9a",
        borderRadius: 10,
        alignItems: "center"
    },

    analyticsButtonText: {
        color: "white",
        fontWeight: "bold"
    }
});