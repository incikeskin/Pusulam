import { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    ActivityIndicator,
    SafeAreaView,
    Alert
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import {
    fetchClassInfo,
    fetchClassStudents,
    fetchClassAssignments
} from "@/store/classDetail/classDetailThunks";

import {
    addStudentToClass,
    removeStudentFromClass
} from "@/store/studentClassCreate/studentClassCreateThunks";

import { resetStudentClassCreate } from "@/store/studentClassCreate/studentClassCreateSlice";
import { findStudent } from "@/store/studentSearch/studentSearchThunks";

export default function ClassDetailScreen() {
    const route = useRoute();
    const {classID} = route.params as { classID: string };
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {info, students, assignments, loading} = useAppSelector(
        (state) => state.classDetail
    );

    const {user} = useAppSelector((state) => state.auth);

    const {student, loading: searchLoading, error: searchError} =
        useAppSelector((state) => state.studentSearch);

    const {
        loading: addLoading,
        success: addSuccess,
        error: addError
    } = useAppSelector((state) => state.studentClassCreate);

    const [modalVisible, setModalVisible] = useState(false);
    const [searchEmail, setSearchEmail] = useState("");
    const [searchPhone, setSearchPhone] = useState("");

    useEffect(() => {
        if (classID) {
            dispatch(fetchClassInfo(classID));
            dispatch(fetchClassStudents(classID));
            dispatch(fetchClassAssignments(classID));
        }
    }, [classID]);

    useEffect(() => {
        if (addSuccess) {
            dispatch(fetchClassStudents(classID));
            setModalVisible(false);
            dispatch(resetStudentClassCreate());
        }
    }, [addSuccess]);


    useFocusEffect(
        useCallback(() => {
            if (classID) {
                dispatch(fetchClassAssignments(classID));
            }
        }, [classID])
    );

    const handleSearch = () => {
        dispatch(findStudent({email: searchEmail, phone_number: searchPhone}));
    };

    const handleAddStudent = () => {
        if (student) {
            dispatch(addStudentToClass({studentId: student._id, classId: classID}));
        }
    };

    const handleRemoveStudent = (studentClassId: string, name: string) => {
        Alert.alert(
            "Öğrenciyi çıkar",
            `${name} sınıftan çıkarılsın mı?`,
            [
                {text: "İptal", style: "cancel"},
                {
                    text: "Evet",
                    onPress: () => {
                        dispatch(removeStudentFromClass({studentClassId}))
                            .unwrap()
                            .then(() => dispatch(fetchClassStudents(classID)))
                            .catch((err) => console.log(err));
                    }
                }
            ]
        );
    };

    if (loading || !info) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large"/>
                <Text>Yükleniyor...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                        router.push(`/teacher`)
                    }
                >
                    <Text>Geri</Text>
                </TouchableOpacity>
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Text style={styles.logoIcon}>🎓</Text>
                        <Text style={styles.logoText}>Sınıf Yönetimi</Text>
                    </View>

                    <Text style={styles.headerTitle}>{info.name}</Text>
                    <Text style={styles.headerSubtitle}>
                        👨‍🏫 {user ? `${user.first_name} ${user.last_name}` : "-"}
                    </Text>
                </View>

                {/* CLASS INFO */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Sınıf Bilgileri</Text>

                    <Text style={styles.infoText}>👥 {students.length} öğrenci</Text>

                    <TouchableOpacity
                        style={styles.analyticsButton}
                        onPress={() =>
                            router.push(`/teacher/class/${classID}/analytics`)
                        }
                    >
                        <Text style={styles.analyticsButtonText}>
                            📊 Sınıf Analitikleri
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.primaryButtonText}>+ Öğrenci Ekle</Text>
                    </TouchableOpacity>
                </View>

                {/* ASSIGNMENTS */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📚 Verilen Ödevler</Text>

                    {assignments.length === 0 && (
                        <Text style={styles.emptyText}>Henüz ödev yok</Text>
                    )}

                    {assignments.map((a) => (
                        <TouchableOpacity
                            key={a._id}
                            style={styles.assignmentItem}
                            onPress={() =>
                                router.push(
                                    `/teacher/class/${classID}/assignments/${a._id}`
                                )
                            }
                        >
                            <Text style={styles.bold}>{a.title}</Text>
                            <Text style={styles.gray}>
                                Son teslim: {a.due_date || "-"}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() =>
                            router.push(`/teacher/class/${classID}/assignments`)
                        }
                    >
                        <Text style={styles.secondaryButtonText}>
                            + Yeni Ödev Oluştur
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* STUDENTS */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>👨‍🎓 Öğrenciler</Text>

                    {students.map((s) => (
                        <View key={s._id} style={styles.studentRow}>
                            <Text style={styles.bold}>
                                {s.student.first_name} {s.student.last_name}
                            </Text>

                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() =>
                                    handleRemoveStudent(
                                        s._id,
                                        `${s.student.first_name} ${s.student.last_name}`
                                    )
                                }
                            >
                                <Text style={styles.deleteText}>Çıkar</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* MODAL (aynı sadece style değişti) */}
                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalBg}>
                        <View style={styles.modal}>
                            <Text style={styles.sectionTitle}>Öğrenci Ekle</Text>

                            <TextInput
                                placeholder="Email"
                                style={styles.input}
                                value={searchEmail}
                                onChangeText={setSearchEmail}
                            />

                            <TextInput
                                placeholder="Telefon"
                                style={styles.input}
                                value={searchPhone}
                                onChangeText={setSearchPhone}
                            />

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleSearch}
                            >
                                <Text style={styles.primaryButtonText}>Ara</Text>
                            </TouchableOpacity>

                            {searchLoading && <ActivityIndicator/>}

                            {searchError && (
                                <Text style={styles.error}>{searchError}</Text>
                            )}

                            {student && (
                                <View style={styles.studentCard}>
                                    <Text>
                                        {student.first_name} {student.last_name}
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.primaryButton}
                                        onPress={handleAddStudent}
                                    >
                                        <Text style={styles.primaryButtonText}>
                                            {addLoading
                                                ? "Ekleniyor..."
                                                : "Sınıfa Ekle"}
                                        </Text>
                                    </TouchableOpacity>

                                    {addError && (
                                        <Text style={styles.error}>{addError}</Text>
                                    )}
                                </View>
                            )}

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeText}>Kapat</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#f2f4f7",
        paddingTop: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    container: {
        paddingHorizontal: 16
    },
    backButton: { marginBottom: 10 },

    header: {
        backgroundColor: "#1087BB",
        padding: 20,
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 20
    },

    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },

    logoIcon: {
        fontSize: 26
    },

    logoText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginLeft: 8
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff"
    },

    headerSubtitle: {
        color: "#e0f2fe",
        marginTop: 4
    },

    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10
    },

    infoText: {
        color: "gray"
    },

    primaryButton: {
        backgroundColor: "#1087BB",
        padding: 14,
        borderRadius: 10,
        marginTop: 12,
        alignItems: "center"
    },

    primaryButtonText: {
        color: "#fff",
        fontWeight: "600"
    },

    secondaryButton: {
        backgroundColor: "#eef6fb",
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
        alignItems: "center"
    },

    secondaryButtonText: {
        color: "#1087BB",
        fontWeight: "600"
    },

    assignmentItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#f0f0f0"
    },

    studentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        padding: 12,
        borderRadius: 10,
        marginTop: 10
    },

    studentCard: {
        padding: 14,
        backgroundColor: "#f9fafb",
        borderRadius: 10,
        marginTop: 10
    },

    deleteBtn: {
        backgroundColor: "#ff4d4f",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8
    },

    deleteText: {
        color: "#fff",
        fontSize: 12
    },

    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10
    },

    modalBg: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center"
    },

    modal: {
        backgroundColor: "#fff",
        margin: 20,
        padding: 20,
        borderRadius: 16
    },

    closeText: {
        textAlign: "center",
        marginTop: 10,
        color: "gray"
    },

    gray: {
        color: "gray"
    },

    bold: {
        fontWeight: "bold"
    },

    error: {
        color: "#ff4d4f",
        marginTop: 5
    },

    emptyText: {
        color: "gray",
        fontStyle: "italic"
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