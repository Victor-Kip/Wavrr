import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const[loading,setLoading]=useState(true);
    const[role,setRole]=useState(null);

    useEffect(() => {
        const loadUser = async () => {
            let token = await AsyncStorage.getItem("userToken");
            let userData = await AsyncStorage.getItem("userData");
            let role = "user";
            if (!token) {
                token = await AsyncStorage.getItem("artistToken");
                userData = await AsyncStorage.getItem("artistData");
                role = "artist";
            }
            if (token && userData) {
                setUser(JSON.parse(userData));
                setRole(role);
            }
            setLoading(false);
        }
        loadUser();
    }, [])

    const signIn = async ({ user, token,role }) => {
        if (role === "artist"){
            await AsyncStorage.setItem("artistToken", token);
            await AsyncStorage.setItem("artistData", JSON.stringify(user));
        } else {
            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userData", JSON.stringify(user));
        }
        setUser(user);
        setRole(role);
};

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => useContext(AuthContext);