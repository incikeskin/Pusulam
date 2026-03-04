import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Şimdilik sadece örnek
        console.log("Login attempt:", email, password);

        // Redux gelince backend doğrulaması buraya eklenecek
        // Şimdilik test için
        router.push("//(tabs)");
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>

                {/* Logo + Başlık */}
                <View style={styles.logoContainer}>
                    <Image source={require("../../../assets/images/pusulam_logo.png")} style={styles.logo} />
                    <Text style={styles.logoText}>Pusulam</Text>
                </View>

                <Text style={styles.title}>Giriş Yap</Text>

                {/* Form */}
                <View style={styles.form}>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        autoCapitalize="none"
                    />

                    <TextInput
                        placeholder="Şifre"
                        placeholderTextColor="#888"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Giriş Yap</Text>
                    </TouchableOpacity>
                </View>

                {/* Kayıt Ol */}
                <TouchableOpacity onPress={() => router.push("//(tabs)")}>
                    <Text style={styles.registerText}>
                        Hesabın yok mu? <Text style={styles.registerLink}>Kayıt Ol</Text>
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f8fafc" },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    logo: { width: 80, height: 80, resizeMode: "contain" },
    logoText: {
        color: "#1087BB",
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1087BB",
        textAlign: "center",
        marginBottom: 20,
    },
    form: { gap: 15 },
    input: {
        width: "100%",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#d1d5db",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#1087BB",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "bold" },
    registerText: {
        textAlign: "center",
        marginTop: 25,
        fontSize: 14,
        color: "#555",
    },
    registerLink: {
        color: "#1087BB",
        fontWeight: "bold",
    },
});