import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
    createAssignment,
    setFormField,
    addSelectedQuestion,
    removeSelectedQuestion,
    addNewQuestion,
    removeNewQuestion,
} from "@/store/assignmentCreate";

import {
    fetchCategories,
    fetchQuestionsByCategory,
    setSelectedCategory,
    setSelectedDifficulty,
} from "@/store/questionPool";

export default function CreateAssignmentPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { classID } = useLocalSearchParams();

    const classId = classID as string;

    const teacherId = useAppSelector(
        (state) => state.auth.user?._id
    );

    const {
        form,
        selectedQuestionIds,
        newQuestions,
        loading,
    } = useAppSelector((state) => state.assignmentCreate);

    const {
        categories,
        questions,
        selectedCategoryId,
        selectedDifficulty,
    } = useAppSelector((state) => state.questionPool);

    const [questionText, setQuestionText] = useState("");
    const [difficulty, setDifficulty] = useState<
        "easy" | "medium" | "hard"
    >("medium");

    const [categoryId, setCategoryId] = useState<string | null>(
        null
    );

    const [options, setOptions] = useState([
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
    ]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);


    useEffect(() => {
        if (selectedCategoryId) {
            dispatch(
                fetchQuestionsByCategory({
                    categoryId: selectedCategoryId,
                    difficulty:
                        selectedDifficulty || undefined,
                })
            );
        }
    }, [
        dispatch,
        selectedCategoryId,
        selectedDifficulty,
    ]);

    const handleAddDraftQuestion = () => {
        if (!questionText.trim() || !categoryId) {
            Alert.alert(
                "Eksik Bilgi",
                "Soru metni ve kategori zorunludur."
            );
            return;
        }

        dispatch(
            addNewQuestion({
                text: questionText,
                difficulty,
                category: categoryId,
                options,
            })
        );

        setQuestionText("");
        setDifficulty("medium");
        setCategoryId(null);

        setOptions([
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
        ]);
    };

    const handleSubmit = () => {
        console.log("classId:", classId);
        console.log("teacherId:", teacherId);

        if (!classId || !teacherId) {
            Alert.alert("Hata", "classId veya teacherId yok");
            return;
        }

        dispatch(createAssignment({ classId, teacherId }))
            .unwrap()
            .then(() => {
                router.replace(`/teacher/class/${classId}`);
            })
            .catch((err) => {
                console.log("CREATE ERROR:", err);

                Alert.alert(
                    "Hata",
                    "Ödev oluşturulurken hata oluştu."
                );
            });
    };
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 40,
                }}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={26}
                            color="#0F172A"
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Yeni Ödev
                    </Text>
                </View>

                {/* ASSIGNMENT INFO */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Ödev Bilgileri
                    </Text>

                    <TextInput
                        placeholder="Ödev Başlığı"
                        placeholderTextColor="#6B7280"
                        style={styles.input}
                        value={form.title}
                        onChangeText={(text) =>
                            dispatch(
                                setFormField({
                                    field: "title",
                                    value: text,
                                })
                            )
                        }
                    />

                    <TextInput
                        placeholder="Ödev Açıklaması"
                        placeholderTextColor="#6B7280"
                        style={[
                            styles.input,
                            styles.textarea,
                        ]}
                        multiline
                        value={form.description}
                        onChangeText={(text) =>
                            dispatch(
                                setFormField({
                                    field: "description",
                                    value: text,
                                })
                            )
                        }
                    />

                    <TextInput
                        placeholder="Teslim Tarihi (2026-05-10)"
                        placeholderTextColor="#6B7280"
                        style={styles.input}
                        value={form.due_date}
                        onChangeText={(text) =>
                            dispatch(
                                setFormField({
                                    field: "due_date",
                                    value: text,
                                })
                            )
                        }
                    />
                </View>

                {/* QUESTION POOL */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Soru Havuzu
                    </Text>

                    {/* CATEGORY */}
                    {/* CATEGORY DROPDOWN */}
                    <View style={styles.dropdownWrapper}>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                        >
                            <Text style={styles.dropdownText}>
                                {selectedCategoryId
                                    ? categories.find(c => c._id === selectedCategoryId)?.name
                                    : "Kategori Seç"}
                            </Text>

                            <Ionicons name="chevron-down" size={20} color="#334155" />
                        </TouchableOpacity>

                        {categoryDropdownOpen && (
                            <View style={styles.dropdownList}>
                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat._id}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            dispatch(setSelectedCategory(cat._id));
                                            setCategoryDropdownOpen(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* DIFFICULTY */}
                    <View style={styles.difficultyRow}>
                        {["easy", "medium", "hard"].map(
                            (level) => (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() =>
                                        dispatch(
                                            setSelectedDifficulty(
                                                level as any
                                            )
                                        )
                                    }
                                    style={[
                                        styles.levelButton,
                                        selectedDifficulty ===
                                        level &&
                                        styles.levelButtonActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.levelText,
                                            selectedDifficulty ===
                                            level &&
                                            styles.levelTextActive,
                                        ]}
                                    >
                                        {level === "easy"
                                            ? "Kolay"
                                            : level ===
                                            "medium"
                                                ? "Orta"
                                                : "Zor"}
                                    </Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>

                    {/* QUESTIONS */}
                    {questions.map((q) => {
                        const selected =
                            selectedQuestionIds.includes(
                                q._id
                            );

                        return (
                            <TouchableOpacity
                                key={q._id}
                                style={[
                                    styles.questionCard,
                                    selected &&
                                    styles.questionSelected,
                                ]}
                                onPress={() =>
                                    selected
                                        ? dispatch(
                                            removeSelectedQuestion(
                                                q._id
                                            )
                                        )
                                        : dispatch(
                                            addSelectedQuestion(
                                                q._id
                                            )
                                        )
                                }
                            >
                                <View
                                    style={
                                        styles.questionTop
                                    }
                                >
                                    <Text
                                        style={
                                            styles.questionText
                                        }
                                    >
                                        {q.text}
                                    </Text>

                                    <Ionicons
                                        name={
                                            selected
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={24}
                                        color="#1087BB"
                                    />
                                </View>

                                <Text
                                    style={
                                        styles.questionMeta
                                    }
                                >
                                    {q.category?.name} ·{" "}
                                    {q.difficulty}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* NEW QUESTION */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Yeni Soru Ekle
                    </Text>

                    <TextInput
                        placeholder="Soru metni"
                        placeholderTextColor="#6B7280"
                        style={[
                            styles.input,
                            styles.textarea,
                        ]}
                        multiline
                        value={questionText}
                        onChangeText={setQuestionText}
                    />

                    {/* CATEGORY SELECT */}
                    {/* CATEGORY DROPDOWN (NEW QUESTION) */}
                    <View style={styles.dropdownWrapper}>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() =>
                                setCategoryDropdownOpen((prev) => !prev)
                            }
                        >
                            <Text style={styles.dropdownText}>
                                {categoryId
                                    ? categories.find(c => c._id === categoryId)?.name
                                    : "Kategori Seç"}
                            </Text>

                            <Ionicons name="chevron-down" size={20} color="#334155" />
                        </TouchableOpacity>

                        {categoryDropdownOpen && (
                            <View style={styles.dropdownList}>
                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat._id}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setCategoryId(cat._id); // 🔥 local state
                                            setCategoryDropdownOpen(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* DIFFICULTY */}
                    <View style={styles.difficultyRow}>
                        {["easy", "medium", "hard"].map(
                            (level) => (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() =>
                                        setDifficulty(
                                            level as any
                                        )
                                    }
                                    style={[
                                        styles.levelButton,
                                        difficulty ===
                                        level &&
                                        styles.levelButtonActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.levelText,
                                            difficulty ===
                                            level &&
                                            styles.levelTextActive,
                                        ]}
                                    >
                                        {level === "easy"
                                            ? "Kolay"
                                            : level ===
                                            "medium"
                                                ? "Orta"
                                                : "Zor"}
                                    </Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>

                    {/* OPTIONS */}
                    {options.map((opt, i) => (
                        <View
                            key={i}
                            style={styles.optionRow}
                        >
                            <TouchableOpacity
                                onPress={() =>
                                    setOptions((prev) =>
                                        prev.map(
                                            (
                                                o,
                                                idx
                                            ) => ({
                                                ...o,
                                                is_correct:
                                                    idx ===
                                                    i,
                                            })
                                        )
                                    )
                                }
                            >
                                <Ionicons
                                    name={
                                        opt.is_correct
                                            ? "radio-button-on"
                                            : "radio-button-off"
                                    }
                                    size={24}
                                    color="#1087BB"
                                />
                            </TouchableOpacity>

                            <TextInput
                                placeholder={`Şık ${String.fromCharCode(
                                    65 + i
                                )}`}
                                placeholderTextColor="#6B7280"
                                style={[
                                    styles.input,
                                    {
                                        flex: 1,
                                        marginBottom: 0,
                                    },
                                ]}
                                value={opt.text}
                                onChangeText={(
                                    text
                                ) =>
                                    setOptions((prev) =>
                                        prev.map(
                                            (
                                                o,
                                                idx
                                            ) =>
                                                idx === i
                                                    ? {
                                                        ...o,
                                                        text,
                                                    }
                                                    : o
                                        )
                                    )
                                }
                            />
                        </View>
                    ))}

                    <TouchableOpacity
                        style={styles.addDraftButton}
                        onPress={
                            handleAddDraftQuestion
                        }
                    >
                        <Text
                            style={
                                styles.addDraftText
                            }
                        >
                            Soruyu Taslağa Ekle
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* DRAFT QUESTIONS */}
                {newQuestions.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            Taslak Sorular
                        </Text>

                        {newQuestions.map(
                            (q, index) => (
                                <View
                                    key={index}
                                    style={
                                        styles.draftCard
                                    }
                                >
                                    <View
                                        style={
                                            styles.draftTop
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.draftQuestion
                                            }
                                        >
                                            {q.text}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() =>
                                                dispatch(
                                                    removeNewQuestion(
                                                        index
                                                    )
                                                )
                                            }
                                        >
                                            <Ionicons
                                                name="trash"
                                                size={
                                                    22
                                                }
                                                color="red"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <Text
                                        style={
                                            styles.questionMeta
                                        }
                                    >
                                        {
                                            categories.find(
                                                (
                                                    c
                                                ) =>
                                                    c._id ===
                                                    q.category
                                            )?.name
                                        }{" "}
                                        ·{" "}
                                        {
                                            q.difficulty
                                        }
                                    </Text>

                                    {q.options?.map(
                                        (
                                            opt,
                                            i
                                        ) => (
                                            <Text
                                                key={i}
                                                style={
                                                    styles.optionText
                                                }
                                            >
                                                {opt.is_correct
                                                    ? "✅"
                                                    : "⬜"}{" "}
                                                {
                                                    opt.text
                                                }
                                            </Text>
                                        )
                                    )}
                                </View>
                            )
                        )}
                    </View>
                )}

                {/* SUBMIT */}
                <View style={styles.footerButtons}>
                    <TouchableOpacity
                        style={
                            styles.cancelButton
                        }
                        onPress={() =>
                            router.back()
                        }
                    >
                        <Text
                            style={
                                styles.cancelText
                            }
                        >
                            İptal
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.submitButton
                        }
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text
                                style={
                                    styles.submitText
                                }
                            >
                                Ödevi Oluştur
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        paddingTop: 50,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingHorizontal: 16,
        marginBottom: 20,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0F172A",
    },

    card: {
        backgroundColor: "white",
        marginHorizontal: 16,
        marginBottom: 18,
        borderRadius: 18,
        padding: 16,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    dropdownWrapper: {
        marginBottom: 12,
        position: "relative",
    },

    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        padding: 12,
        backgroundColor: "#FFF",
    },

    dropdownText: {
        color: "#334155",
        fontWeight: "600",
    },

    dropdownList: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        backgroundColor: "#FFF",
        overflow: "hidden",
        position: "absolute",
        width: "100%",
        zIndex: 999,
    },

    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },

    dropdownItemText: {
        color: "#0F172A",
        fontWeight: "500",
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 14,
    },

    input: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        marginBottom: 12,
        backgroundColor: "#FFF",
        color: "#0F172A", // yazı rengi
    },

    textarea: {
        minHeight: 100,
        textAlignVertical: "top",
    },

    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: "#F1F5F9",
        marginRight: 10,
    },

    filterButtonActive: {
        backgroundColor: "#1087BB",
    },

    filterText: {
        color: "#334155",
        fontWeight: "600",
    },

    filterTextActive: {
        color: "white",
    },

    difficultyRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },

    levelButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "#F1F5F9",
        alignItems: "center",
    },

    levelButtonActive: {
        backgroundColor: "#1087BB",
    },

    levelText: {
        color: "#334155",
        fontWeight: "600",
    },

    levelTextActive: {
        color: "white",
    },

    questionCard: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
    },

    questionSelected: {
        borderColor: "#1087BB",
        backgroundColor: "#EFF6FF",
    },

    questionTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10,
    },

    questionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: "#0F172A",
    },

    questionMeta: {
        marginTop: 8,
        color: "#64748B",
        fontSize: 13,
    },

    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },

    addDraftButton: {
        backgroundColor: "#E0F2FE",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },

    addDraftText: {
        color: "#0369A1",
        fontWeight: "700",
    },

    draftCard: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
    },

    draftTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    draftQuestion: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: "#0F172A",
        marginRight: 10,
    },

    optionText: {
        marginTop: 4,
        color: "#334155",
        fontSize: 14,
    },

    footerButtons: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        marginTop: 10,
    },

    cancelButton: {
        flex: 1,
        backgroundColor: "#E2E8F0",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    cancelText: {
        color: "#334155",
        fontWeight: "700",
    },

    submitButton: {
        flex: 1,
        backgroundColor: "#1087BB",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    submitText: {
        color: "white",
        fontWeight: "700",
    },
});