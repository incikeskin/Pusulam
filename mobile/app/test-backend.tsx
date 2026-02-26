// app/test-backend.tsx
import { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { apiFetch } from "../src/api/api";

export default function TestBackendScreen() {
    useEffect(() => {
        const testBackend = async () => {
            try {
                const data = await apiFetch("/api/categories"); // kendi endpoint
                console.log("Backend cevabı:", data);
            } catch (err) {
                console.log("Hata:", err);
            }
        };

        testBackend();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Backend Test Çalışıyor</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: { fontSize: 18, fontWeight: "bold" },
});