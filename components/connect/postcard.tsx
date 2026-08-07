import postService from "@/app/services/postService";
import { useAuth } from "@/context/auth";
import { CommentItem, PostCardProps } from "@/types/post";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
const PostCard = ({ post,onVote,hasVoted = false,onLike,isLiked = false }: PostCardProps) => {
  const { id,author, content, post_type, poll_options,like_count,comment_count } = post;
  const {user:currentUser}  =useAuth()

  const [selectedOption,setSelectedOption] = useState<number | null>(null);


  const[commentsVisible,setCommentsVisible] = useState(false);
  const[comments,setComments] = useState<CommentItem[]>([]);
  const[newComment,setNewComment] = useState("");
  const [loadingComments,setLoadingComments] = useState(false);
  const[submittingComment,setSubmittingComment] = useState(false);

  const handleOptionPressed = (index:number)=>{
    if(hasVoted || selectedOption !== null) return;
    setSelectedOption(index);
    onVote(id,index);
  };

  const loadComments = async ()=>{
    setLoadingComments(true);
    try {
      const res = await postService.getComments(id);
      if(res.success){
        setComments(res.data || []);
      }
    } catch (error) {
      console.error(`Failed to load comments: ${error}`);
    }
    finally{
      setLoadingComments(false);
    }
  };

  const handleOpenComments = () =>{
    setCommentsVisible(true);
    loadComments();
  };

  const handleAddComments = async()=>{
    if(!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await postService.addComment(id,newComment.trim());
      if(res.success){
        setNewComment("");
        await loadComments();
      }
    } catch (error) {
      console.error(`Error adding comment: ${error}`);
    }
    finally{
      setSubmittingComment(false);
    }
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
        <TouchableOpacity 
          onPress={()=>onLike && onLike(id)}
          className="flex-row items-center py-1 px-2">
          <Feather name="heart" size={16} color={isLiked ? "red" : "#6b7280"} fill = {isLiked ? "red" : "none"} className="mr-1.5" />
          <Text className={`font-semibold ${isLiked ? "text-red-500 " : "text-gray-600"}`}>
            {like_count ?? 0} {like_count === 1 ? "Like" : "Likes"}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress = {handleOpenComments}
          className="flex-row items-center py-1 px-2">
          <Feather
            name="message-square"
            size={16}
            color="#6b7280"
            className="mr-1.5"
          />
          <Text className="font-semibold text-gray-600">
            {comment_count ?? 0}{comment_count === 1 ? "Comment" : "Comments"}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center py-1 px-2">
          <Feather name="share-2" size={16} color="#6b7280" className="mr-1.5" />
          <Text className="font-semibold text-gray-600">Share</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible = {commentsVisible}
        animationType = "slide"
        transparent = {true}
        onRequestClose = {() => setCommentsVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-2xl h-2/3 p-4">
        <View className="flex-row justify-between items-center pb-3 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900">Comments</Text>
          <TouchableOpacity
          onPress={()=>setCommentsVisible(false)}>
            <Feather name = "x" size = {64} color = "black"/>
          </TouchableOpacity>
        </View>
        {loadingComments ? (<ActivityIndicator size = "large" color = "#3b82f6" className = "mt-8"/>):(
          <FlatList
          data = {comments}
          keyExtractor={(item)=>item.id.toString()}
          renderItem={({item})=>{
            const username =
    item.User?.username ||
    (item.user_id === currentUser?.id ? currentUser?.username : null) ||
    "Anonymous";
            return(
            <View className="py-2 border-b border-gray-100">
              <Text className="font-semibold text-sm text-gray-900">
                {username}
              </Text>
              <Text className="text-gray-700 text-base mt-0.5 ">{item.text}</Text>
            </View>
          )}}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-6">
              No comments yet. Be the first!
            </Text>
          }
          />
        ) }

        <View className="flex-row items-center pt-2 border-t border-gray-200">
          <TextInput
          placeholder="Write a comment..."
          value = {newComment}
          onChangeText={setNewComment}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-black mr-2"
          />

          <TouchableOpacity
          onPress={handleAddComments}
          disabled={submittingComment || !newComment.trim()}
          className="bg-blue-500 rounded-full p-2.5"
          >
            {submittingComment ? (
              <ActivityIndicator size = "small" color = "white"/>
            ):(
              <Feather name = "send" size = {16} color = "white"/>
            )}
          </TouchableOpacity>
        </View>
        </View>
        </View>
      </Modal>
    </View>
  );
};
export default PostCard;
