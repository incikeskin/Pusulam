import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuth } from "../store/auth/authSlice";

export default function RootInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadAuth = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const user = await AsyncStorage.getItem("user");

                if (token && user) {
                    dispatch(
                        setAuth({
                            token,
                            user: JSON.parse(user),
                        })
                    );
                }
            } catch (error) {
                console.log("Auth yüklenirken hata:", error);
            }
        };

        loadAuth();
    }, []);

    return null;
}