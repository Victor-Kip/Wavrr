import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const[loading,setLoading]=useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = await AsyncStorage.getItem("userToken");
            const userData = await AsyncStorage.getItem("userData");
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
            setLoading(false);
        }
        loadUser();
    }, [])

    const signIn = async ({ user, token }) => {
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userData", JSON.stringify(user));
        setUser(user);
};

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => useContext(AuthContext);