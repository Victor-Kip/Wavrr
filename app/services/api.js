import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_HOST = "192.168.1.11:5000";
export const API_ORIGIN = `http://${API_HOST}`;

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});
//add a request interceptor to add token to the request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  //if there is a token add it to the request header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  //otherwise return the config without the token
  return config;
});
export default api;
