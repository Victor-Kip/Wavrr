import { useLocalSearchParams } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
//import { SliderBox } from "react-native-image-slider-box";
import { SafeAreaView } from "react-native-safe-area-context";
const items = [
  {
    uuid: "11111111-1111-4111-8111-111111111111",
    name: "Echora T-Shirt",
    price: 20,
    description: "High quality cotton t-shirt with Echora logo.",
    color: "Available in black, white, and gray.",
  },
  {
    uuid: "22222222-2222-4222-8222-222222222222",
    name: "Echora CD",
    price: 10,
    description: "Limited edition music CD from Echora artists.",
  },
  // Add more items as needed
];
const images = [
  "http://unsplash.com/photos/white-hotel-printed-crew-neck-shirt-on-black-surface-9ugEeqflo70",
  "http://unsplash.com/photos/a-white-t-shirt-hanging-from-a-tree-2WeAYFTG69A",
];
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
const paymentOptions = [
  { label: "Mobile Payment", value: "Mobile Payment" },
  { label: "USDT", value: "USDT" },
  { label: "Paypal", value: "Paypal" },
];

const ItemDetails = () => {
  const { id } = useLocalSearchParams();
  const item = items.find((item) => item.uuid === id);

  if (!item) {
    return (
      <SafeAreaView className=" flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Item not found.</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="bg-primary flex-1 ">
      <ScrollView className="px-6 pt-4">
        <View className="mt-2 p-6 justify-center items-center">
          <Text className=" text-white text-3xl font-bold mb-2">
            {item.name}
          </Text>
        </View>
        <View className=" shadow-xl  p-2 bg-white/10 border border-white/20  w-[100%] h-[250px] self-center rounded-lg justify-center items-center">
          <Text className="text-center text-white/90 text-lg font-bold mt-2">
            Product Images
          </Text>
          {/* <SliderBox images={images}
         sliderBoxHeight={200}
         dotColor="#FFEE58"
         inactiveDotColor="#90A4AE"
         autoplay
         circleLoop/> */}
        </View>
        <View className="shadow-xl mt-2 p-4 justify-center items-center bg-white/10 border border-white/20 backdrop-blur-md  w-[100%] self-center rounded-lg">
          <Text className=" text-white/90 text-md">{item.description}</Text>
          <Text className="text-white/90 text-md mt-2">{item.color}</Text>
        </View>
        <View className="shadow-xl mt-2 p-4 justify-center bg-white/10 border border-white/20 backdrop-blur-md  w-[100%] self-center rounded-lg">
          <Text className="text-white font-bold text-lg">Payment Details</Text>
          <View className="flex-row items-center w-full mt-2">
            <View className=" justify-center items-center rounded w-[45%] bg-white h-[75px] mt-2 mx-2">
              <Text className="text-black/90 text-md">Bank Card</Text>
            </View>
            <View className=" justify- items-center mt-2">
              <Text className="text-white/90 text-md">.....4567</Text>
              <Text className="text-white/90 text-md">Exp: 12/25</Text>
            </View>
          </View>
          <Text className="text-white font-bold text-lg mt-4">
            Delivery Address
          </Text>
          <Text className="text-white/90 text-md mt-2">John Doe</Text>
          <Text className="text-white/90 text-md">
            123 Main St, City, Country
          </Text>
        </View>
        <View className="shadow-xl mt-2 p-4 justify-center bg-white/10 border border-white/20 backdrop-blur-md  w-[100%] self-center rounded-lg">
          <Text className="text-white font-bold text-lg">Amount</Text>
          <Text className="text-white/90 font-bold text-5xl mt-2">
            ${item.price}
          </Text>
          <Text className="text-white/90 text-md mt-2">
            Includes tax + shipping
          </Text>
        </View>
        <View className="flex-row justify-around items-center p-4  mb-2">
          <Dropdown
            data={paymentOptions}
            labelField="label"
            style={styles.dropdown}
            containerStyle={styles.listContainer}
            itemContainerStyle={styles.itemContainer}
            itemTextStyle={styles.itemText}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            valueField="value"
            placeholder="Other options"
            onChange={(item) => console.log(item)}
          />
          <TouchableOpacity className="bg-green-500 px-6 py-3 rounded-lg">
            <Text className="text-white font-bold text-lg">Pay Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemDetails;
