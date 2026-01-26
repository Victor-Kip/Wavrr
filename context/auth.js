import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            let token = await AsyncStorage.getItem("userToken");
            let userData = await AsyncStorage.getItem("userData");
            let foundRole = null;
            if (token && userData) {
                foundRole = "user";
            } else {
                token = await AsyncStorage.getItem("artistToken");
                userData = await AsyncStorage.getItem("artistData");
                if (token && userData) {
                    foundRole = "artist";
                }
            }
            if (token && userData && foundRole) {
                setUser(JSON.parse(userData));
                setRole(foundRole);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        };
        loadUser();
    }, [])

    const signIn = async ({ user, token, role }) => {
        if (!user || !token || !role) return;
        if (role === "artist") {
            await AsyncStorage.setItem("artistToken", token);
            await AsyncStorage.setItem("artistData", JSON.stringify(user));
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userData");
        } else {
            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userData", JSON.stringify(user));
            await AsyncStorage.removeItem("artistToken");
            await AsyncStorage.removeItem("artistData");
        }
        setUser(user);
        setRole(role);
    };

    const signOut = async () => {
        await AsyncStorage.multiRemove([
            "userToken",
            "userData",
            "artistToken",
            "artistData",
        ]);
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, setUser, loading, setLoading, signIn, signOut, role, setRole }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);