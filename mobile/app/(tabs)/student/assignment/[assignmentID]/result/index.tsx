import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function StudentAssignmentResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const assignmentId = params.assignmentId;

    // 🔹 Statik veriler (demo için)
    const [studentResult, setStudentResult] = useState({
        total: 20,
        correct: 15,
        incorrect: 5,
        score_percent: 75,
    });

    const [studentAnswers, setStudentAnswers] = useState([
        {
            _id: "1",
            question: { text: "1+1 kaçtır?" },
            selected_option: { text: "2" },
            is_correct: true,
        },
        {
            _id: "2",
            question: { text: "Başkent Ankara mı?" },
            selected_option: { text: "Hayır" },
            is_correct: false,
        },
    ]);

    const [classRanking, setClassRanking] = useState({
        studentScore: 75,
        classAverage: 70,
        rank: 2,
        totalStudents: 15,
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>

            {/* 🔹 Header */}
            <Text style={styles.header}>Ödev Sonucu</Text>

            {/* 🔹 ÖDEV SONUCU */}
            <View style={styles.card}>
                <View style={styles.resultRow}>
                    <View style={styles.resultItem}>
                        <Text style={styles.resultNumber}>{studentResult.total}</Text>
                        <Text style={styles.resultLabel}>Toplam Soru</Text>
                    </View>
                    <View style={styles.resultItem}>
                        <Text style={[styles.resultNumber, { color: "green" }]}>{studentResult.correct}</Text>
                        <Text style={styles.resultLabel}>Doğru</Text>
                    </View>
                    <View style={styles.resultItem}>
                        <Text style={[styles.resultNumber, { color: "red" }]}>{studentResult.incorrect}</Text>
                        <Text style={styles.resultLabel}>Yanlış</Text>
                    </View>
                    <View style={styles.resultItem}>
                        <Text style={[styles.resultNumber, { color: "#1087BB" }]}>{studentResult.score_percent}%</Text>
                        <Text style={styles.resultLabel}>Başarı</Text>
                    </View>
                </View>
            </View>

            {/* 🔹 SINIF SIRALAMASI */}
            <Text style={[styles.header, { marginTop: 24 }]}>Sınıf Sıralaması</Text>
            <View style={styles.card}>
                <View style={styles.resultRow}>
                    <View style={styles.resultItem}>
                        <Text style={styles.resultNumber}>{classRanking.studentScore}</Text>
                        <Text style={styles.resultLabel}>Senin Skorun</Text>
                    </View>
                    <View style={styles.resultItem}>
                        <Text style={styles.resultNumber}>{classRanking.classAverage}</Text>
                        <Text style={styles.resultLabel}>Sınıf Ortalaması</Text>
                    </View>
                    <View style={styles.resultItem}>
                        <Text style={styles.resultNumber}>{classRanking.rank}</Text>
                        <Text style={styles.resultLabel}>Sıralaman</Text>
                    </View>
                    <View style={styles.resultItem}>
                        <Text style={styles.resultNumber}>{classRanking.totalStudents}</Text>
                        <Text style={styles.resultLabel}>Toplam Öğrenci</Text>
                    </View>
                </View>
            </View>

            {/* 🔹 SORU DETAYLARI */}
            <Text style={[styles.header, { marginTop: 24 }]}>Soru Detayları</Text>
            {studentAnswers.map((answer, index) => (
                <View key={answer._id} style={styles.answerCard}>
                    <Text style={{ fontSize: 20 }}>{answer.is_correct ? "✅" : "❌"}</Text>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={{ fontWeight: "600" }}>{index + 1}. {answer.question.text}</Text>
                        <Text style={{ color: answer.is_correct ? "green" : "red" }}>
                            Seçilen cevap: {answer.selected_option.text}
                        </Text>
                    </View>
                </View>
            ))}

            {/* 🔹 Dönüş Butonu */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("..//(tabs)/student/index")}
            >
                <Text style={styles.buttonText}>Sınıflara Dön</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    header: { fontSize: 20, fontWeight: "bold", color: "#1087BB", marginBottom: 12 },
    card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    resultRow: { flexDirection: "row", justifyContent: "space-between" },
    resultItem: { alignItems: "center", flex: 1 },
    resultNumber: { fontSize: 24, fontWeight: "bold" },
    resultLabel: { fontSize: 12, color: "#555", marginTop: 4 },
    answerCard: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
    button: { marginTop: 24, backgroundColor: "#1087BB", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});