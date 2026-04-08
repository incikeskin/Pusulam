import { useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
    fetchClassInfo,
    fetchClassAssignments
} from "../../../../../store/classDetail/classDetailThunks";
import { clearClassDetail } from "../../../../../store/classDetail/classDetailSlice";
import { checkAssignmentCompleted } from "../../../../../store/assignmentResult/assignmentResultThunks";

export default function StudentClassDetailScreen() {
    const params = useLocalSearchParams<{ classID: string }>();
    const classId = params.classID;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { info, assignments, loading, error } = useAppSelector(
        (state) => state.classDetail
    );
    const { completedMap } = useAppSelector((state) => state.assignmentResult);
    const { user } = useAppSelector((state) => state.auth);

    // ---------------- FETCH CLASS DATA ----------------
    useEffect(() => {
        if (!classId) return;

        dispatch(fetchClassInfo(classId));
        dispatch(fetchClassAssignments(classId));

        return () => {
            dispatch(clearClassDetail());
        };
    }, [classId, dispatch]);

    useEffect(() => {
        if (!assignments.length) return;
        if (!user?._id) return;

        assignments.forEach((assignment: any) => {
            dispatch(
                checkAssignmentCompleted({
                    assignmentId: assignment._id,
                    studentId: user!._id,
                })
            );
        });
    }, [assignments, user, dispatch]);

    const teacherName = useMemo(() => {
        if (!info?.teacher || typeof info.teacher === "string") return "-";
        return `${info.teacher.first_name} ${info.teacher.last_name}`;
    }, [info]);

    const completedCount = useMemo(() => {
        return assignments.filter((a: any) => completedMap[a._id]).length;
    }, [assignments, completedMap]);

    const progressPercent = useMemo(() => {
        if (assignments.length === 0) return 0;
        return Math.round((completedCount / assignments.length) * 100);
    }, [completedCount, assignments.length]);

    const today = new Date();

    if (loading && !info) return <Text style={{ padding: 20 }}>Yükleniyor...</Text>;
    if (error) return <Text style={{ padding: 20, color: "red" }}>{error}</Text>;

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push("/student")}
                >
                    <Text style={styles.backText}>← Geri</Text>
                </TouchableOpacity>
                {/* Sınıf Bilgileri */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Sınıf Bilgileri</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Sınıf Adı</Text>
                        <Text style={styles.value}>{info?.name ?? "-"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Öğretmen</Text>
                        <Text style={styles.value}>{teacherName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Toplam Ödev</Text>
                        <Text style={styles.value}>{assignments.length}</Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.label}>{completedCount} / {assignments.length} tamamlandı</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                        </View>
                        <Text style={styles.progressPercent}>%{progressPercent}</Text>
                    </View>
                </View>

                {/* Ödevler */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Verilen Ödevler</Text>
                    {assignments.map((a: any) => {
                        const isCompleted = completedMap[a._id];
                        const isPastDue = a.due_date ? new Date(a.due_date) < today : false;

                        return (
                            <View key={a._id} style={styles.assignmentCard}>
                                <View>
                                    <Text style={styles.assignmentTitle}>{a.title}</Text>
                                    {a.description && <Text style={styles.assignmentDesc}>{a.description}</Text>}
                                    {a.due_date && <Text style={styles.assignmentDue}>Son teslim: {new Date(a.due_date).toLocaleDateString()}</Text>}
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        (isPastDue || isCompleted)
                                            ? styles.buttonOutline
                                            : {}
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        if (isPastDue || isCompleted) {
                                            router.push(`/student/assignment/${a._id}/result`);
                                        } else {
                                            router.push(`/student/assignment/${a._id}/solve`);
                                        }
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            (isPastDue || isCompleted) && { color: "#1087BB" } // outline için koyu renk
                                        ]}
                                    >
                                        {(isPastDue || isCompleted)
                                            ? "Sonuçları Gör"
                                            : "Ödevi Çöz"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingTop: 20, // ✅ ekran üstüne yapışmayı önler
    },
    container: {
        padding: 15,
    },

    backButton: { marginBottom: 10 },
    backText: { color: "#1087BB", fontSize: 14 },

    card: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardTitle: { fontSize: 18, fontWeight: "bold", color: "#1087BB", marginBottom: 10 },

    infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    label: { color: "#888", fontSize: 14 },
    value: { fontWeight: "600", fontSize: 14 },

    progressHeader: { flexDirection: "row", justifyContent: "space-between" },
    labelSmall: { fontSize: 12, color: "#888" },
    progressBar: { height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, marginTop: 4 },
    progressFill: { height: 8, backgroundColor: "#1087BB", borderRadius: 4 },
    progressPercent: { fontSize: 12, color: "#888", marginTop: 2 },

    assignmentCard: {
        backgroundColor: "#f9fafb",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    assignmentTitle: { fontSize: 16, fontWeight: "600", color: "#1087BB" },
    assignmentDesc: { fontSize: 14, color: "#555", marginTop: 4 },
    assignmentDue: { fontSize: 12, color: "#888", marginTop: 4 },

    button: {
        marginTop: 8,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#1087BB",
        alignItems: "center",
    },
    buttonText: { color: "white", fontWeight: "bold" },
    buttonOutline: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#1087BB",
    },
    buttonOutlineText: { color: "#1087BB" },
    buttonDisabled: { backgroundColor: "#cbd5e1" },
});