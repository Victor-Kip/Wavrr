import Post from "@/types/post";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
interface PostCardProps {
  post: Post;
  onVote:(postId:number,optionIndex:number)=>void;
  hasVoted?:boolean;
}
const PostCard = ({ post,onVote,hasVoted = false }: PostCardProps) => {
  const { id,author, content, post_type, poll_options } = post;
  const [selectedOption,setSelectedOption] = useState<number | null>(null);

  const handleOptionPressed = (index:number)=>{
    if(hasVoted || selectedOption !== null) return;
    setSelectedOption(index);
    onVote(id,index);
  }
  const getOptions = (data: any): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.options && Array.isArray(data.options)) return data.options;
    return [];
  };
  const getVotes = (data: any): number[] => {
    if (!data) return [];
    if (data.votes && Array.isArray(data.votes)) return data.votes;
    if (Array.isArray(data)) return data.map(() => 0);
    return [];
  };

  const getPercentage = (votes: number[]): number[] => {
    if (votes.length === 0) return [];
    const total = votes.reduce((sum, v) => sum + v, 0);
    return total > 0
      ? votes.map((v) => Math.round((v / total) * 100))
      : votes.map(() => 0);
  };

  const options = getOptions(poll_options);
  const votes = getVotes(poll_options);
  const percentages = getPercentage(votes);

  return (
    <View className="w-full bg-white rounded-xl mb-6 p-4 pt-12 pb-14 relative min-h-[180px0">
      <View className="absolute top-3 left-4 flex-row items-center">
        <Text className="font-bold text-gray-900 text-lg mr-1">
          {author.username}
        </Text>

        {author.role === "artist" && (
          <View className="bg-indigo-900 rounded-full p-0.5 items-center justify-center">
            <Feather name="check" size={12} color="white" />
          </View>
        )}
      </View>
      <View className="w-full justify-center py-2">
        <Text className="text-xl font-semibold text-gray-800 mb-3">
          {content}
        </Text>
        {post_type === "poll" && options.length > 0 && (
          <View className="w-full space-y-2 mt-1">
            {options.map((option: string, idx: number) => {
              const percentage = Number(percentages[idx] ?? 0);
              const isSelected = selectedOption === idx;
              const isVoted = hasVoted || selectedOption !== null;
              return (

                <TouchableOpacity
                  key={idx}
                  onPress={()=>handleOptionPressed(idx)}
                  disabled = {isVoted}
                  className={`w-full rounded-lg overflow-hidden h-10 justify-center relative mb-2 ${isVoted ? "opacity-80" : "active:opacity-70"}`}
                >
                  <View
                    style={{ width: `${percentage}%` }}
                    className={`absolute top-0 bottom-0 left-0 ${idx === 0 ? "bg-green-600" : "bg-red-700"}`}
                  />
                  <View className="flex-row justify-between px-3 z-10 w-full items-center">
                    <Text className="text-black font-medium">{option}</Text>
                    <Text className="text-gray-800 font-bold">{isVoted ? percentage : ""}%</Text>
                  </View>
                  </TouchableOpacity>
                
              );
            })}
          </View>
        )}
      </View>
      <View className="w-full absolute bottom-2 left-4 right-4 flex-row justify-around border-t border-gray-100 pt-2">
        <TouchableOpacity className="flex-row items-center py-1 px-2">
          <Feather name="heart" size={16} color="red" className="mr-1.5" />
          <Text className="font-semibold text-gray-600">Like</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-1 px-2">
          <Feather
            name="message-square"
            size={16}
            color="red"
            className="mr-1.5"
          />
          <Text className="font-semibold text-gray-600">Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-1 px-2">
          <Feather name="share-2" size={16} color="red" className="mr-1.5" />
          <Text className="font-semibold text-gray-600">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default PostCard;
