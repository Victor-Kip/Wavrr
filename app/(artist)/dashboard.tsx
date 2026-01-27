import { Feather } from '@expo/vector-icons';
import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Dashboard = () => {
    return (
        <SafeAreaView className="flex-1 bg-indigo-900 ">
            <ScrollView className="px-6 pt-4">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-3xl font-bold text-white mb-6">Wavrr</Text>
                    <TouchableOpacity className="">
                        <Feather name="bell" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View className='flex-row justify-between mb-8'>
                    <TouchableOpacity className='bg-blue-300 px-6 py-2 rounded-full'>
                        <Text className='text-white font-semibold'>Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className=' px-6 py-2 rounded-full'>
                        <Text className='text-white font-semibold'>Stats</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className=' px-6 py-2 rounded-full'>
                        <Text className='text-white font-semibold'>Earnings</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-white text-2xl font-bold mb-4">Upload audio</Text>
                <View className='border-2 border-dashed border-blue-300 rounded-2xl items-center justify-center py-10 mb-6 bg-gray-100'>
                    <Feather name="upload" size={48} color="gray" className='mb-3' />
                    <Text className='text-gray-400 text-center px-8 py-3 mb-4'>Drag and drop your audio files here</Text>
                    <TouchableOpacity className='bg-blue-100 px-8 py-3 rounded-xl shadow-sm'>
                        <Text className='font-bold text-gray-700'>Upload Audio</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-white text-lg font-semibold mb-2">Song Name</Text>
                <TextInput
                className='bg-gray-100 rounded-xl p-4 mb-6 text-white border border-gray-100'
                placeholder='song name'
                placeholderTextColor="gray-50"/>
                <View className='flex-row justify-between mb-8'>
                    <View className='flex-1 mr-4'>
                        <Text className='text-white font-semibold text-lg mb-2 ml-1'>Genre</Text>
                        <View className='border-2 border-dashed border-blue-300 rounded-xl h-32 bg-gray-50 p-2'>
                            <TextInput
                            className='flex-1 text-black'
                            multiline/>
                        </View>
                    </View>
                    <View className='w-1/3'>
                        <Text className='text-white font-semibold mb-2 text-center text-xs'>Upload cover image (optional)</Text>
                        <TouchableOpacity className='border-2 border-dashed border-blue-300 rounded-xl h-32 bg-gray-50  items-center justify-center'>
                            <Feather name="image" size={32} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity className='bg-blue-300 px-6 py-3 rounded-xl items-center shadow-lg mb-10'>
                    <Text className='text-white font-bold text-lg'>Publish Track</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Dashboard;