import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMusic } from "../../../context/musicContext";

const styles = StyleSheet.create({
  dropdown: {
    padding: 14,
    height: 50,
    borderColor: "#4c75ea",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
    width: "50%",
  },
  listContainer: {
    backgroundColor: "#99a1af",
    borderRadius: 7,
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 2,
    margin: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#1c398e",
    fontWeight: "bold",
  },
  placeholder: {
    color: "#060a17",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedText: {
    fontSize: 16,
    color: "#1c398e",
    fontWeight: "bold",
  },
});

const Discover = () => {
  const router = useRouter();
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemaining < 10 ? "0" : ""}${secondsRemaining}`;
  };
  const options = [
    { label: "Genre", value: "Genre" },
    { label: "Liked Songs", value: "Liked Songs" },
    { label: "Recently Played", value: "Recently Played" },
    { label: "Friends", value: "Friends" },
  ];
  const {
    isLoading,
    songs,
    playSong,
    tooglePlayPause,
    player,
    isPlaying,
    currentSong,
  } = useMusic();
  return (
    <SafeAreaView className="flex-1 bg-primary ">
      <ScrollView className="px-6 pt-4">
        <View className="flex-row items-center justify-between mb-8 mt-2">
          <Text className="text-white font-bold text-3xl">Echora</Text>
          <View className="flex-row items-center">
            <Text className="text-white font-bold text-2xl">Discover</Text>
            <Feather
              name="compass"
              size={24}
              color="black"
              className=" bg-white rounded-full p-2 mx-3 border border-2 border-blue-500"
            />
          </View>
        </View>
        <View>
          <Text className="text-white font-semibold text-2xl mb-2">
            New songs for You
          </Text>
          <Dropdown
            data={options}
            labelField="label"
            style={styles.dropdown}
            containerStyle={styles.listContainer}
            itemContainerStyle={styles.itemContainer}
            itemTextStyle={styles.itemText}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            valueField="value"
            placeholder="Based on"
            onChange={(item) => console.log(item)}
          />
        </View>
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
                onPress={() => router.push(`/songs/${songUuid}`)}
              >
                <View className="mt-8 bg-whiteview p-2 flex flex-row items-center justify-between rounded border ">
                  <Text className="text-indi font-semibold text-xl p-2">
                    {item.name}
                  </Text>
                  <View className="flex-row items-center justify-between mr-2">
                    <Text className="font-semibold text-indi text-lg p-2">
                      {displayTime}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Discover;
