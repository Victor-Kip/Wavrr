import { Feather } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { DrawerActions } from "expo-router/react-navigation";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMusic } from "../../../context/musicContext";

const Index = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const {
    isLoading,
    songs,
    playSong,
    tooglePlayPause,
    player,
    isPlaying,
    currentSong,
    setCurrentSong,
  } = useMusic();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const playlist = [
    { uuid: "11111111-1111-4111-8111-111111111111", name: "Playlist 1" },
    { uuid: "22222222-2222-4222-8222-222222222222", name: "Playlist 2" },
    { uuid: "33333333-3333-4333-8333-333333333333", name: "Playlist 3" },
  ];

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemaining < 10 ? "0" : ""}${secondsRemaining}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-primary ">
      <ScrollView className="px-6 pt-4">
        <View className="flex-row items-center justify-between mb-8 mt-2">
          <View>
            <Text className="text-white font-bold text-3xl">Echora</Text>
            <Pressable onPress={openDrawer}>
              <Feather name="menu" size={24} color="white" />
            </Pressable>
          </View>
          <TextInput
            placeholder={"Search for a song ..."}
            placeholderTextColor="gray"
            className=" bg-gray-100 rounded-xl p-4 border-2 border-blue-300 mr-2 "
          />
        </View>
        <View>
          <Text className="text-white font-semibold text-2xl mb-2">
            Recently Played
          </Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            songs.map((item: any) => {
              const songUuid = item.uuid || item.id;
              const isCurrent = currentSong?.uuid === songUuid || currentSong?.id === songUuid;
              let displayTime = String((item.duration / 60).toFixed(2));
              if (isCurrent && player) {
                const duration = player.duration || 0;
                const currentTime = player.currentTime || 0;
                displayTime = isPlaying
                  ? formatTime(duration - currentTime)
                  : formatTime(duration);
              }
              return (
                <TouchableOpacity
                  key={songUuid}
                  onPress={() => {
                    setCurrentSong(item);
                    router.push(`../songs/${songUuid}`);
                  }}
                  className="bg-whiteview p-2 flex flex-row items-center justify-between rounded border mb-3"
                >
                  <Text className="text-indi font-semibold text-xl p-2">
                    {item.name}
                  </Text>
                  <View className="flex-row items-center justify-between mr-2">
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        if (currentSong?.uuid === songUuid || currentSong?.id === songUuid) {
                          tooglePlayPause();
                        } else {
                          playSong(item);
                        }
                      }}
                    >
                      <Feather
                        name={
                          isPlaying && (currentSong?.uuid === songUuid || currentSong?.id === songUuid)
                            ? "pause"
                            : "play"
                        }
                        size={32}
                        color="white"
                      />
                    </TouchableOpacity>
                    <Text className=" text-indi font-semibold p-2">
                      {displayTime}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
        <Text className="text-white font-semibold text-2xl mb-1 ">
          Based on Recents
        </Text>
        <View className=" flex-row  h-36 items-center justify-between mb-3">
          {playlist.map((item) => (
            <View
              key={item.uuid}
              className=" flex h-24 p-7 bg-whiteview items-center justify-center rounded"
            >
              <Text className="text-indi">Playlist 1</Text>
            </View>
          ))}
        </View>
        <Text className=" text-white font-semibold text-2xl mb-3">Genres</Text>
        <View className=" flex-row items-center justify-around mb-3">
          <View>
            <View className=" bg-whiteview w-36 h-16 mb-3 items-center justify-center rounded-3xl ">
              <Text className="text-indi text-xl font-semibold"> Pop</Text>
            </View>
            <View className=" bg-whiteview w-36 h-16 mb-3 items-center justify-center rounded-3xl">
              <Text className="text-indi text-xl font-semibold"> Rnb</Text>
            </View>
          </View>
          <View>
            <View className=" bg-whiteview w-36 h-16 mb-3 items-center justify-center rounded-3xl">
              <Text className="text-indi text-xl font-semibold"> Rap</Text>
            </View>
            <View className=" bg-whiteview w-36 h-16 mb-3 items-center justify-center rounded-3xl">
              <Text className="text-indi text-xl font-semibold"> Rock</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
