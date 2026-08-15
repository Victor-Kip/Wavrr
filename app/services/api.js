import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

const getApiHost = () => {
  if (isWeb) {
    if (typeof window !== "undefined" && window.location?.hostname) {
      return window.location.hostname;
    }
    return "localhost";
  }

  return "192.168.1.11";
};

const API_HOST = process.env.EXPO_PUBLIC_API_URL || `${getApiHost()}:5000`;
export const API_ORIGIN = /^https?:\/\//.test(API_HOST)
  ? API_HOST
  : `http://${API_HOST}`;

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});
//add a request interceptor to add token to the request
api.interceptors.request.use(async (config) => {
  const token = isWeb
    ? await AsyncStorage.getItem("userToken")
    : await SecureStore.getItemAsync("userToken");
  //if there is a token add it to the request header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  //otherwise return the config without the token
  return config;
});
export default api;
