import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

const AuthContext = createContext();
const isWeb = Platform.OS === "web";

const storageGetItem = async (key) => {
  if (isWeb) {
    return AsyncStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
};

const storageSetItem = async (key, value) => {
  if (isWeb) {
    return AsyncStorage.setItem(key, value);
  }
  return SecureStore.setItemAsync(key, value);
};

const storageRemoveItem = async (key) => {
  if (isWeb) {
    return AsyncStorage.removeItem(key);
  }
  return SecureStore.deleteItemAsync(key);
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    //get the stored data
    const loadAuth = async () => {
      try {
        const authData = await AsyncStorage.getItem("authData");
        const userToken = await storageGetItem("userToken");
        //check if there is data, if there is save it to the states
        if (authData && userToken) {
          const { role, user } = JSON.parse(authData);
          setToken(userToken);
          setRole(role);
          setUser(user);
          //if not set the states to null
        } else {
          await signOut();
        }
      } catch (error) {
        console.log(`Failed to load auth ${error}`);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  //save data to storage
  const signIn = async ({ token, role, user }) => {
    //check that all needed data to be saved is passed
    if (!token || !role || !user) return;
    //if everything is present save the data with a key named "authdata"
    await AsyncStorage.setItem("authData", JSON.stringify({ role, user }));
    await storageSetItem("userToken", token);
    setToken(token);
    setRole(role);
    setUser(user);
  };

  const signOut = async () => {
    //once the user is logged out remove the save key-value pair and set the states to null
    await AsyncStorage.removeItem("authData");
    await storageRemoveItem("userToken");
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, user, loading, setLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
