import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    ActivityIndicator,
    Image
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "../../../store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getTeacherClasses } from "../../../store/teacher/teacherThunks";
import { createClass } from "../../../store/createClass/createClassThunks";
import { resetClassCreate } from "../../../store/createClass/createClassSlice";

export default function TeacherPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { classes, loading } = useAppSelector((state) => state.teacher);
    const user = useAppSelector((state) => state.auth.user);
    const handleLogout = () => {
        dispatch(logout());
        router.replace("/login");
    };
    const {
        loading: createLoading,
        success,
        createdClass,
        error
    } = useAppSelector((state) => state.createClass);

    const [openModal, setOpenModal] = useState(false);
    const [className, setClassName] = useState("");

    useEffect(() => {
        dispatch(getTeacherClasses());
    }, [dispatch]);

    useEffect(() => {
        if (success && createdClass) {
            dispatch(getTeacherClasses());
            setOpenModal(false);
            setClassName("");
            dispatch(resetClassCreate());
        }
    }, [success, createdClass, dispatch]);

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/teacher/class/${item._id}`)}
        >
            <View style={styles.cardContent}>
                <Text style={styles.className}>{item.name}</Text>
                <Text style={styles.cardSub}>Detayları görüntüle →</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
            {/* HEADER */}
            <View style={styles.header}>
                <Image
                    source={require("../../../assets/images/pusulam_logo.png")}
                    style={styles.logo}
                />

                <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                        {user ? `${user.first_name} ${user.last_name}` : ""}
                    </Text>
                    <Text style={styles.userRole}>Öğretmen</Text>
                </View>

                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.accountBtn}
                        onPress={() => router.push("/teacher")}
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
            <View style={styles.container} >
            {/* TITLE */}
            <View style={styles.topRow}>
                <Text style={styles.pageTitle}>Sınıflarım</Text>

                <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.8}
                    onPress={() => setOpenModal(true)}
                >
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* LIST */}
            {loading ? (
                <ActivityIndicator size="large" color="#1087BB" style={{ marginTop: 40 }} />
            ) : classes.length === 0 ? (
                <Text style={styles.emptyText}>Henüz sınıf oluşturulmadı</Text>
            ) : (
                <FlatList
                    data={classes}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* MODAL */}
            <Modal visible={openModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Yeni Sınıf</Text>

                        <TextInput
                            placeholder="Sınıf adı gir..."
                            value={className}
                            onChangeText={setClassName}
                            style={styles.input}
                            placeholderTextColor="#94A3B8"
                        />

                        {error && <Text style={styles.error}>{error}</Text>}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setOpenModal(false)}
                                style={styles.cancelBtn}
                            >
                                <Text style={{ color: "#334155" }}>İptal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={createLoading || !className}
                                onPress={() => dispatch(createClass({ name: className }))}
                                style={[
                                    styles.createBtn,
                                    (createLoading || !className) && { opacity: 0.5 }
                                ]}
                            >
                                <Text style={{ color: "white", fontWeight: "600" }}>
                                    {createLoading ? "Oluşturuluyor..." : "Oluştur"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 16,
        paddingTop: 50, // ✅ üst boşluk düzeltildi
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1087BB",
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingTop: 50,
        marginBottom: 5,
    },

    logo: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },

    userInfo: {
        flex: 1,
        marginLeft: 10,
    },

    userName: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },

    userRole: {
        color: "white",
        fontSize: 12,
    },

    headerButtons: {
        flexDirection: "row",
        gap: 10,
    },

    accountBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "white",
        borderRadius: 6,
    },

    accountText: {
        color: "#1087BB",
        fontWeight: "bold",
    },

    logoutBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "white",
        borderRadius: 6,
    },

    logoutText: {
        color: "#1087BB",
        fontWeight: "bold",
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },


    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#1087BB",
    },

    user: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 6,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },

    pageTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0F172A",
    },

    addButton: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#1087BB",
        justifyContent: "center",
        alignItems: "center",
    },

    addButtonText: {
        color: "white",
        fontSize: 26,
        fontWeight: "bold",
        lineHeight: 26, // 🔥 kritik
        textAlign: "center",
        includeFontPadding: false,
    },

    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },

    cardContent: {
        gap: 6,
    },

    className: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0F172A",
    },

    cardSub: {
        fontSize: 13,
        color: "#94A3B8",
    },

    emptyText: {
        textAlign: "center",
        marginTop: 50,
        color: "#94A3B8",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    modal: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        width: "90%",
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 14,
    },

    input: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
        fontSize: 14,
    },

    error: {
        color: "red",
        marginBottom: 8,
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },

    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: "#F1F5F9",
    },

    createBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: "#1087BB",
        borderRadius: 10,
    },
});