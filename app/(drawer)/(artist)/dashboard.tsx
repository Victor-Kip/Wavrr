import api from "@/app/services/api";
import { useMusic } from "@/context/musicContext";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/react-navigation";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Earnings from "./earnings";
import Stats from "./stats";

const Dashboard = () => {
  const navigation = useNavigation();
  const {
    playSong,
    tooglePlayPause,
    currentSong,
    isPlaying,
    refreshSongs,
    songs,
  } = useMusic();
  const openDrawer = ()=>{
    navigation.dispatch(DrawerActions.openDrawer)
  };
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "stats" | "earnings"
  >("dashboard");
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [selectedCoverImage, setSelectedCoverImage] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [songName, setSongName] = useState("");
  const [genre, setGenre] = useState("");

  const handlePickDocument = async () => {
    setSelectedFile(null);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        console.log("Selected file:", result.assets[0]);
      }
    } catch (err) {
      console.log("Document pick error:", err);
      alert("Failed to pick audio file. Please try again.");
    }
  };
  const handlePickCoverImage = async () => {
    setSelectedCoverImage(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedCoverImage(result.assets[0]);
      }
    } catch (err) {
      console.log("Cover image pick error:", err);
      alert("Failed to pick cover image. Please try again.");
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("No file selected");
      return;
    }
    if (!songName.trim()) {
      alert("Missing song name");
      return;
    }
    if (!genre.trim()) {
      alert("Missing genre");
      return;
    }

    const formData = new FormData();
    const audioBlob = await fetch(selectedFile.uri).then((response) => response.blob());
    formData.append("audio", audioBlob, selectedFile.name);
    formData.append("songName", songName);
    formData.append("genre", genre);
    if (selectedCoverImage) {
      const coverBlob = await fetch(selectedCoverImage.uri).then((response) => response.blob());
      formData.append("coverImage", coverBlob, selectedCoverImage.name);
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const response = await api.post("/audio/new", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      const responseJson = response.data;
      await refreshSongs();
      if (!responseJson.success) {
        throw new Error(responseJson.message || "Upload failed");
      }
      setSelectedFile(null);
      setSelectedCoverImage(null);
      setSongName("");
      setGenre("");
      alert(responseJson.message || "Upload successful");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Upload failed";
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const showContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <View>
            <Text className="text-white text-2xl font-bold mb-4">
              Upload audio
            </Text>
            <View className="border-2 border-solid border-blue-300 rounded-2xl items-center justify-center py-10 mb-6 bg-gray-100">
              <Feather name="upload" size={48} color="gray" className="mb-3" />
              <Text className="text-gray-400 text-center px-8 py-3 mb-4">
                Click below to upload your audio file (MP3, WAV, etc.)
              </Text>
              <TouchableOpacity
                className="bg-blue-100 px-8 py-3 rounded-xl"
                onPress={handlePickDocument}
              >
                <Text className="font-bold text-gray-700">Upload Audio</Text>
              </TouchableOpacity>
              {selectedFile && (
                <View>
                  <Text className="text-green-600 mt-4">
                    Selected File: {selectedFile.name}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-white text-xl font-semibold mb-2">
              Song Name
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl p-4 mb-6 text-black border  border-blue-300 border-solid border-2"
              placeholder="input song name"
              value={songName}
              onChangeText={setSongName}
              placeholderTextColor="gray-400"
            />
            <View className="flex-row justify-end mb-8 items-center">
              <View className="flex-1 mr-4">
                <Text className="text-white font-semibold text-xl mb-2 mt-2 ml-1">
                  Genre
                </Text>
                <View className="border-2 border-solid  border-blue-300 rounded-xl bg-gray-50 p-2 ">
                  <TextInput
                    placeholder="input genre"
                    className="text-black"
                    value={genre}
                    onChangeText={setGenre}
                    placeholderTextColor="gray-400"
                  />
                </View>
              </View>
              <View className="w-1/2 ">
                <Text className="text-white font-semibold mb-3 text-center text-xl">
                  Upload cover image
                </Text>
                <TouchableOpacity
                  onPress={handlePickCoverImage}
                  className="items-center"
                >
                  <View className="bg-white border-2  rounded-xl border-blue-300 border-solid">
                    {selectedCoverImage ? (
                      <Image
                        source={{ uri: selectedCoverImage.uri }}
                        style={{ width: 100, height: 80, borderRadius: 10 }}
                      ></Image>
                    ) : (
                      <Feather name="image" size={48} color="gray" />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <Text className="text-white text-xl font-semibold mb-2">
              Uploaded songs
            </Text>
            <View className=" mb-6">
              {!songs ? (
                <Text className="text-gray-200">No songs uploaded yet</Text>
              ) : (
                songs.map((item: any) => (
                  <View
                    key={item.uuid}
                    className="flex-row justify-between p-3 bg-whiteview border-2 border-blue-300 rounded-xl mb-3 items-center"
                  >
                    <Text className="text-indi text-lg font-semibold">
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      className=" p-2 rounded full"
                      onPress={() => {
                        if (currentSong?.uuid === item.uuid) {
                          tooglePlayPause();
                        } else {
                          try {
                            playSong(item);
                          } catch (error) {
                            console.error("Error playing song:", error);
                            alert("Failed to play song. Please try again.");
                          }
                        }
                      }}
                    >
                      <Feather
                        name={isPlaying ? "pause" : "play"}
                        color={"white"}
                        size={24}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
            <TouchableOpacity
              onPress={handleUpload}
              disabled={isUploading}
              className="bg-blue-300 px-6 py-4 rounded-xl items-center  mb-10"
            >
              <View className="flex-row items-center justify-center">
                {isUploading && (
                  <ActivityIndicator
                    size="small"
                    color="#fff "
                    className="mr-10"
                  />
                )}
                <Text className="text-white font-bold text-lg">
                  {isUploading
                    ? uploadProgress > 0
                      ? `Uploading ${uploadProgress}%`
                      : "Uploading..."
                    : "Publish Track"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      case "stats":
        return <Stats />;
      case "earnings":
        return <Earnings />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary ">
      <ScrollView className="px-6 pt-4">
        <View className="flex-row justify-between items-center ">
          <Text className="text-3xl font-bold text-white mb-4">Echora</Text>
         
          <TouchableOpacity className="">
            <Feather name="bell" size={24} color="white" />
          </TouchableOpacity>
        </View>
         <Pressable className=" p-2" onPress={openDrawer}>
                        <Feather name="menu" size={24} color="white" />
                      </Pressable>
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity
            className={`px-6 py-2 rounded-full ${activeTab === "dashboard" ? "bg-tabbtn" : ""}`}
            onPress={() => setActiveTab("dashboard")}
          >
            <Text className="text-white font-semibold">Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 rounded-full ${activeTab === "stats" ? "bg-tabbtn" : ""}`}
            onPress={() => setActiveTab("stats")}
          >
            <Text className="text-white font-semibold">Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 rounded-full ${activeTab === "earnings" ? "bg-tabbtn" : ""}`}
            onPress={() => setActiveTab("earnings")}
          >
            <Text className="text-white font-semibold">Earnings</Text>
          </TouchableOpacity>
        </View>
        {showContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
