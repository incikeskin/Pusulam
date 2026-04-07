import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getTeacherClasses } from "../../../store/teacher/teacherThunks";
import { createClass } from "../../../store/createClass/createClassThunks";
import { resetClassCreate } from "../../../store/createClass/createClassSlice";

export default function TeacherPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { classes, loading } = useAppSelector((state) => state.teacher);
    const user = useAppSelector((state) => state.auth.user);

    const {
        loading: createLoading,
        success,
        createdClass,
        error
    } = useAppSelector((state) => state.createClass);

    const [openModal, setOpenModal] = useState(false);
    const [className, setClassName] = useState("");

    // ✅ Teacher classes yükle
    useEffect(() => {
        dispatch(getTeacherClasses());
    }, [dispatch]);

    // ✅ classes state log
    useEffect(() => {
        console.log("Teacher classes:", classes);
    }, [classes]);

    // ✅ Yeni sınıf oluşturulduktan sonra listeleri güncelle
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
            onPress={() => router.push(`/teacher/class/${item._id}`)} // absolute path
        >
            <Text style={styles.className}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Pusulam</Text>
                <Text style={styles.user}>
                    {user ? `${user.first_name} ${user.last_name}` : "Öğretmen"}
                </Text>
            </View>

            {/* TITLE + BUTTON */}
            <View style={styles.topRow}>
                <Text style={styles.pageTitle}>Sınıflarım</Text>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setOpenModal(true)}
                >
                    <Text style={styles.addButtonText}>+ Sınıf Oluştur</Text>
                </TouchableOpacity>
            </View>

            {/* LIST */}
            {loading ? (
                <ActivityIndicator size="large" color="#1087BB" style={{ marginTop: 20 }} />
            ) : classes.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>Henüz sınıf yok</Text>
            ) : (
                <FlatList
                    data={classes}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    style={{ width: "100%" }}
                />
            )}

            {/* MODAL */}
            <Modal visible={openModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Yeni Sınıf Oluştur</Text>

                        <TextInput
                            placeholder="Sınıf adı"
                            value={className}
                            onChangeText={setClassName}
                            style={styles.input}
                        />

                        {error && <Text style={styles.error}>{error}</Text>}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setOpenModal(false)}
                                style={styles.cancelBtn}
                            >
                                <Text>İptal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={createLoading || !className}
                                onPress={() => dispatch(createClass({ name: className }))}
                                style={[styles.createBtn, (createLoading || !className) && { opacity: 0.5 }]}
                            >
                                <Text style={{ color: "white" }}>
                                    {createLoading ? "Oluşturuluyor..." : "Oluştur"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F1F5F9", padding: 16 },
    header: { marginBottom: 16 },
    title: { fontSize: 24, fontWeight: "bold", color: "#1087BB" },
    user: { fontSize: 16, color: "#334155", marginTop: 4 },
    topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    pageTitle: { fontSize: 20, fontWeight: "bold", color: "#1087BB" },
    addButton: { backgroundColor: "#1087BB", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
    addButtonText: { color: "white", fontWeight: "bold" },
    card: { backgroundColor: "white", padding: 16, borderRadius: 8, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    className: { fontSize: 16, fontWeight: "bold", color: "#1087BB" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
    modal: { backgroundColor: "white", padding: 20, borderRadius: 8, width: "90%" },
    modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1087BB", marginBottom: 12 },
    input: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 6, padding: 8, marginBottom: 12 },
    error: { color: "red", marginBottom: 8 },
    modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
    cancelBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 6 },
    createBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#1087BB", borderRadius: 6 }
});