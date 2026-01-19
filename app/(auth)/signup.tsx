import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validatePassword = (pass:string) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(pass);
    }

    const handleSignUp = async () => {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (!validatePassword(password)) {
        alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
        return;
      }
      try {
        const response = await fetch("http://10.51.52.251:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({username, email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Signup successful! Please log in.");
        } else {
          alert(data.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        alert(`An error occurred': ${error}`);
      }
    }
    const handleGoogleSignUp = async () => {
    }


    return(

    <SafeAreaView className="flex-1 justify-center items-center bg-indigo-900">
      <Text className="text-5xl text-white font-bold mb-9">WAVRR</Text>
      <Text className="text-white mb-4">Create an account using your email and password</Text>
        <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        keyboardType="default"
        autoCapitalize="none"
        className="w-72 h-12 bg-white text-black rounded px-4 mb-4 border border-blue-700"
        placeholderTextColor="#cbd5e1"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        className="w-72 h-12 bg-white text-black rounded px-4 mb-4 border border-blue-700"
        placeholderTextColor="#cbd5e1"
      />
      <View>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={!showPassword}
          className="w-72 h-12 bg-white text-black rounded px-4 mb-1 border border-blue-700"
          placeholderTextColor="#cbd5e1"
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-[12] z-10"
        >
          <Text className="text-blue-400">{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword}
          className="w-72 h-12 bg-white text-black rounded px-4 mb-1 border border-blue-700"
          placeholderTextColor="#cbd5e1"
        />
      </View>
      <TouchableOpacity onPress={handleSignUp} className="bg-blue-400 px-4 py-2 rounded mt-2 w-72">
        <Text className="text-white text-lg text-center font-bold">Sign Up</Text>
      </TouchableOpacity>
      <Text className="text-white font-bold mt-4">OR</Text>
      <TouchableOpacity onPress={handleGoogleSignUp} className="bg-red-500 px-4 py-2 rounded mt-2 w-72">
        <Text className="text-white text-lg text-center font-bold">Sign Up with Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
export default Signup;
