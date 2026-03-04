import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";

export default function StudentClassDetailScreen() {
    // 🔹 Statik demo veriler
    const info = { name: "Matematik 101", teacher: "Ayşe Yılmaz" };
    const assignments = [
        { _id: "1", title: "Ödev 1", description: "Konu 1 çalışması", due_date: "2026-03-10" },
        { _id: "2", title: "Ödev 2", description: "Konu 2 çalışması", due_date: "2026-03-01" },
        { _id: "3", title: "Ödev 3", description: "Konu 3 çalışması", due_date: "2026-03-15" },
    ];
    const completedMap: Record<string, boolean> = { "1": true };

    const completedCount = assignments.filter(a => completedMap[a._id]).length;
    const progressPercent = assignments.length ? Math.round((completedCount / assignments.length) * 100) : 0;

    const today = new Date();

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Geri dön */}
                <TouchableOpacity onPress={() => { /* router.push("/student") */ }} style={styles.backButton}>
                    <Text style={styles.backText}>← Sınıflarıma dön</Text>
                </TouchableOpacity>

                {/* 🔹 Sınıf Bilgileri */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Sınıf Bilgileri</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Sınıf Adı</Text>
                        <Text style={styles.value}>{info.name}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Öğretmen</Text>
                        <Text style={styles.value}>{info.teacher}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Toplam Ödev</Text>
                        <Text style={styles.value}>{assignments.length}</Text>
                    </View>

                    {/* İlerleme */}
                    <View style={{ marginTop: 10 }}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.label}>İlerleme Durumu</Text>
                            <Text style={styles.labelSmall}>
                                {completedCount} / {assignments.length} ödev tamamlandı
                            </Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                        </View>
                        <Text style={styles.progressPercent}>%{progressPercent} tamamlandı</Text>
                    </View>
                </View>

                {/* 🔹 Ödevler */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Verilen Ödevler</Text>

                    {assignments.length === 0 && (
                        <Text style={{ color: "#888", marginTop: 10 }}>Bu sınıfa henüz ödev verilmemiş.</Text>
                    )}

                    {assignments.map(a => {
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
                                        isCompleted ? styles.buttonOutline :
                                            isPastDue ? styles.buttonDisabled : {}
                                    ]}
                                    disabled={isPastDue}
                                    onPress={() => { /* Ödev sayfasına yönlendirme */ }}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        isCompleted ? styles.buttonOutlineText : {}
                                    ]}>
                                        {isCompleted ? "Sonuçlarımı Gör" : isPastDue ? "Süresi Doldu" : "Ödevi Çöz"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f8fafc" },
    container: { padding: 15 },

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