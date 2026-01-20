import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const[loading,setLoading]=useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = await useAsyncStorage.getItem("userToken");
            const userData = await useAsyncStorage.getItem("userData");
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
            setLoading(false);
        }
        loadUser();
    }, [])

    const signIn = async (userData, token) => {
        await useAsyncStorage.setItem("userToken", token);
        await useAsyncStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
    }
    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => useContext(AuthContext);