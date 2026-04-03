import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getStudentClasses } from "@/store/student/studentThunks";
import { logout } from "@/store/auth/authSlice";

export default function StudentPanel() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.user);
    const { classes, loadingClasses, classesError } = useAppSelector(
        (state) => state.student
    );

    useEffect(() => {
        dispatch(getStudentClasses());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        router.replace("/login");
    };

    const handleClassPress = (classId: string) => {
        // 🚨 Önemli: parametreyi doğru gönderiyoruz
        router.push({
            pathname: "/student/class/[classID]",
            params: { classID : classId}
        });
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Image
                    source={require("../../../assets/images/pusulam_logo.png")}
                    style={styles.logo}
                />

                <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                        {user ? `${user.first_name} ${user.last_name}` : ""}
                    </Text>
                    <Text style={styles.userRole}>Öğrenci</Text>
                </View>

                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.accountBtn}
                        onPress={() => router.push("/student")}
                    >
                        <Text style={styles.accountText}>Hesabım</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutText}>Çıkış</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.main}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <Text style={styles.title}>Sınıflarım</Text>

                {loadingClasses && <Text style={{ marginTop: 10 }}>Sınıflar yükleniyor...</Text>}
                {classesError && <Text style={{ color: "red", marginTop: 10 }}>{classesError}</Text>}

                <View style={styles.classesContainer}>
                    {classes.map((cls) => (
                        <TouchableOpacity
                            key={cls._id}
                            style={styles.classCard}
                            onPress={() => handleClassPress(cls._id)} // parametreyi buradan gönderiyoruz
                        >
                            <Text style={styles.className}>{cls.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f8fafc" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1087BB",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    logo: { width: 50, height: 50, resizeMode: "contain" },
    userInfo: { flex: 1, marginLeft: 10 },
    userName: { color: "white", fontWeight: "bold", fontSize: 16 },
    userRole: { color: "white", fontSize: 12 },

    headerButtons: { flexDirection: "row", gap: 10 },
    accountBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "white",
        borderRadius: 6,
    },
    accountText: { color: "#1087BB", fontWeight: "bold" },

    logoutBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "white",
        borderRadius: 6,
    },
    logoutText: { color: "#1087BB", fontWeight: "bold" },

    main: { flex: 1, padding: 15 },
    title: { fontSize: 22, fontWeight: "bold", color: "#1087BB", marginBottom: 15 },
    classesContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
    classCard: {
        width: "48%",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 12,
    },
    className: { color: "#1087BB", fontWeight: "bold", fontSize: 16 },
});