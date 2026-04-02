import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks"; // path senin projeye göre değişebilir
import { registerUser } from "@/store/auth/authThunks";
import { Alert } from "react-native";

export default function RegisterScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        role: "student",
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleRegister = async () => {
        // basit validation
        if (!form.email || !form.password) {
            Alert.alert("Hata", "Email ve şifre zorunlu");
            return;
        }

        const result = await dispatch(registerUser(form));

        if (registerUser.fulfilled.match(result)) {
            Alert.alert("Başarılı", "Kayıt oluşturuldu 🎉");

            // login sayfasına yönlendir
            router.replace("/login");
        } else {
            Alert.alert("Hata", result.payload as string);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../../../assets/images/pusulam_logo.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.logoText}>Pusulam</Text>
                </View>

                <Text style={styles.title}>Kayıt Ol</Text>

                {/* Form */}
                <View style={styles.form}>
                    <TextInput
                        placeholder="İsim"
                        placeholderTextColor="#888"
                        value={form.first_name}
                        onChangeText={(t) => handleChange("first_name", t)}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Soyisim"
                        placeholderTextColor="#888"
                        value={form.last_name}
                        onChangeText={(t) => handleChange("last_name", t)}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={form.email}
                        onChangeText={(t) => handleChange("email", t)}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Şifre"
                        placeholderTextColor="#888"
                        value={form.password}
                        onChangeText={(t) => handleChange("password", t)}
                        secureTextEntry
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Telefon"
                        placeholderTextColor="#888"
                        value={form.phone_number}
                        onChangeText={(t) => handleChange("phone_number", t)}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />

                    {/* Role seçimi (Basit bir toggle) */}
                    <View style={styles.roleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.roleButton,
                                form.role === "student" && styles.roleActive
                            ]}
                            onPress={() => handleChange("role", "student")}
                        >
                            <Text style={[
                                styles.roleText,
                                form.role === "student" && styles.roleTextActive
                            ]}>
                                Öğrenci
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.roleButton,
                                form.role === "teacher" && styles.roleActive
                            ]}
                            onPress={() => handleChange("role", "teacher")}
                        >
                            <Text style={[
                                styles.roleText,
                                form.role === "teacher" && styles.roleTextActive
                            ]}>
                                Öğretmen
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {error && (
                        <Text style={{ color: "red", marginTop: 10 }}>
                            {error}
                        </Text>
                    )}
                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.6 }]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Yükleniyor..." : "Kayıt Ol"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.registerText}>
                        Hesabın var mı? <Text style={styles.registerLink}>Giriş Yap</Text>
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
    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold"
    },
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

    /* Role Switch */
    roleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: "#e5e7eb",
        borderRadius: 10,
        alignItems: "center",
    },
    roleActive: {
        backgroundColor: "#1087BB",
    },
    roleText: {
        fontSize: 16,
        color: "#555",
    },
    roleTextActive: {
        color: "white",
        fontWeight: "bold",
    },
});