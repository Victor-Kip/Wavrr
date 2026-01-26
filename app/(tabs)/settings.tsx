import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/auth";

const Settings = ()=>{
    const { signOut } = useAuth();

    const handleSignOut = () => {
        signOut();
    };

    return(
        <View className="flex-1 justify-center items-center">
            <TouchableOpacity onPress={handleSignOut}
            className="bg-red-500 px-4 py-2 rounded">
                <Text className="text-white font-bold">Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}
export default Settings;