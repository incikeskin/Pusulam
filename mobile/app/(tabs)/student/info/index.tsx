import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";

export default function StudentInfoScreen() {
    const router = useRouter();

    // Şimdilik statik kullanıcı verisi
    const user = {
        first_name: "Ahmet",
        last_name: "Yılmaz",
        email: "ahmet@example.com",
        phone_number: "05551234567",
    };

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setPhoneNumber(user.phone_number);
        }
    }, [user]);

    const handleSubmit = () => {
        // Şifre kontrolü
        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                setPasswordError("Şifreler eşleşmiyor");
                return;
            }
            if (newPassword.length < 6) {
                setPasswordError("Şifre en az 6 karakter olmalı");
                return;
            }
        }

        setPasswordError(null);
        alert("Bilgiler güncellendi! (Statik demo)");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={styles.header}>
                    <Image
                        source={require("../../../../assets/images/pusulam_logo.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.headerText}>Profil Bilgilerim</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

                    <Text style={styles.label}>Ad</Text>
                    <TextInput
                        value={firstName}
                        onChangeText={setFirstName}
                        style={styles.input}
                    />

                    <Text style={styles.label}>Soyad</Text>
                    <TextInput
                        value={lastName}
                        onChangeText={setLastName}
                        style={styles.input}
                    />

                    <Text style={styles.label}>E-posta</Text>
                    <TextInput
                        value={user.email}
                        editable={false}
                        style={[styles.input, styles.readonlyInput]}
                    />

                    <Text style={styles.label}>Telefon Numarası</Text>
                    <TextInput
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.sectionTitle}>Şifre Güncelle</Text>

                    <Text style={styles.label}>Yeni Şifre</Text>
                    <TextInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        style={styles.input}
                        secureTextEntry
                    />

                    <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
                    <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={styles.input}
                        secureTextEntry
                    />

                    {passwordError && <Text style={styles.error}>{passwordError}</Text>}

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Bilgileri Güncelle</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f8fafc" },
    container: { padding: 15 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    logo: { width: 50, height: 50, resizeMode: "contain", marginRight: 10 },
    headerText: { fontSize: 22, fontWeight: "bold", color: "#1087BB" },

    formContainer: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1087BB",
        marginBottom: 10,
        marginTop: 10,
    },
    label: { fontSize: 14, color: "#555", marginBottom: 5 },
    input: {
        width: "100%",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#d1d5db",
        marginBottom: 10,
    },
    readonlyInput: { backgroundColor: "#e5e7eb", color: "#555" },
    error: { color: "red", marginBottom: 10 },

    button: {
        backgroundColor: "#1087BB",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});