import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/auth";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

        const {signIn} = useAuth();
        const url =  "http://192.168.1.8:5000/api/auth/artistlogin";
        const handleLogin = async () => {
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
              signIn(data);
            } else {
              alert(data.message || "Login failed. Please try again.");
            }
          } catch (error) {
            alert(`An error occurred': ${error}`);
          }
        }
    
    return(

    <SafeAreaView className="flex-1 justify-center items-center bg-indigo-900">
      <Text className="text-5xl text-white font-bold mb-9">WAVRR</Text>
      <Text className="text-white font-bold mb-4">Log in using your email and password</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        className="w-72 h-12 bg-white text-black rounded px-4 mb-4 border border-blue-700"
        placeholderTextColor="#cbd5e1"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="w-72 h-12 bg-white text-black rounded px-4 mb-4 border border-blue-700"
        placeholderTextColor="#cbd5e1"
      />
      <TouchableOpacity onPress={handleLogin} className="bg-blue-400 px-4 py-2 rounded mt-2 w-72">
        <Text className="text-white text-lg text-center font-bold">Log In</Text>
      </TouchableOpacity>
      <Text className="text-white mt-4">Don't have an account? <Link className="text-blue-300" href="/(auth)/artistsignup">Create one</Link></Text>
    </SafeAreaView>
  );
}
export default Login;
