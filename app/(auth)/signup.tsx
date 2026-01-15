import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignUp = async () => {}


    return(

    <SafeAreaView className="flex-1 justify-center items-center bg-indigo-900">
      <Text className="text-5xl text-white font-bold mb-9">WAVRR</Text>
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
      <TouchableOpacity onPress={handleSignUp} className="bg-blue-400 px-4 py-2 rounded mt-2 w-72">
        <Text className="text-white text-lg text-center font-bold">Sign Up</Text>
      </TouchableOpacity>
      <Text className="text-white mt-4">Sign up with Google Coming Soon!</Text>
    </SafeAreaView>
  );
}
export default Signup;
