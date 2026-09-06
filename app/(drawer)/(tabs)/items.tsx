import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const echoraItems = [
  { uuid: "11111111-1111-4111-8111-111111111111", name: "Echora T-Shirt", price: 20 },
  { uuid: "22222222-2222-4222-8222-222222222222", name: "Echora CD", price: 10 },
  { uuid: "33333333-3333-4333-8333-333333333333", name: "Echora Hoodie", price: 40 },
];

const Items = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary ">
      <ScrollView className="p-6 pt-4">
        <View className="flex-row justify-between items-center mb-6 mt-2">
          <Text className="text-white font-bold text-3xl">Echora</Text>
          <View className="flex-row items-center">
            <Text className="text-2xl text-white font-bold">Items</Text>
            <Feather
              name="shopping-bag"
              size={24}
              color="black"
              className=" bg-white rounded-full p-2 mx-3 border border-2 border-tabbtn"
            />
          </View>
        </View>
        <View className="flex-row items-center justify-around">
          <TouchableOpacity className="rounded bg-tabbtn">
            <Text className="text-white text-lg font-bold px-4  m-2">
              Merch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded bg-tabbtn">
            <Text className="text-white text-lg font-bold px-4  m-2">CDs</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded bg-tabbtn">
            <Text className="text-white text-lg font-bold px-4 m-2">Songs</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Search items..."
          className="bg-gray-200 rounded px-4 py-2 mt-4 mb-6"
        />
        <Text className="text-2xl text-white font-bold mb-2">
          Based on artists you follow
        </Text>

        {echoraItems.map((item) => (
          <View key={item.uuid}>
            <View className="border-t border-gray-200 my-2 mb-6" />
            <TouchableOpacity
              className="relative flex-row "
              onPress={() =>
                router.push({
                  pathname: "/items/[id]",
                  params: { id: item.uuid },
                })
              }
            >
              <View className="bg-gray-200  w-[48%] h-40 rounded mb-4"></View>
              <Text className="text-white text-2xl font-bold mb-2 p-2">
                {item.name}
              </Text>
              <View className="absolute bottom-5 right-0 bg-gray-200">
                <Text className="text-black font-semibold text-xl p-2">
                  ${item.price}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Items;
