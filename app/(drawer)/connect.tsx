import CreatePostModal from "@/components/connect/createPostModal";
import PostCard from "@/components/connect/postcard";
import Post from "@/types/post";
import RawPostFromBackend from "@/types/rawPostFromBackend";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/auth";
import api from "../services/api";
import postService from "../services/postService";

const { votePoll } = postService;

const normalizePollOptions = (rawPollOptions: any) => {
  if (!rawPollOptions) return null;

  let parsed = rawPollOptions;
  if (typeof rawPollOptions === "string") {
    try {
      parsed = JSON.parse(rawPollOptions);
    } catch {
      return null;
    }
  }

  const options = Array.isArray(parsed?.options) ? parsed.options : [];
  const rawVotes = Array.isArray(parsed?.votes) ? parsed.votes : [];

  const votes = options.map((_: string, index: number) => {
    const value = Number(rawVotes[index] ?? 0);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  });

  return { options, votes };
};

const Connect = () => {
  const { user, role } = useAuth();

  const voterKey = useMemo(() => {
    if (!user?.id || !role) return null;
    return `${role}:${user.id}`;
  }, [role, user]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("For You");
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGetFeed = async () => {
    setLoading(true);
    try {
      const response = await api.get("/posts/feed");
      const responseData = response.data;
      const rawPost = responseData.data as RawPostFromBackend[];

      const transformedPosts: Post[] = rawPost.map((raw) => ({
        id: raw.id,
        content: raw.content,
        author: {
          username:
            raw.userAuthor?.username || raw.artistAuthor?.username || "unknown",
          role: raw.authorType || "user",
        },
        post_type: raw.type as "text" | "poll",
        authorId: raw.authorId,
        is_pinned: raw.is_pinned,
        like_count: raw.like_count,
        comment_count: raw.comment_count,
        share_count: raw.share_count,
        poll_options: normalizePollOptions(raw.poll_options),
        poll_votes: raw.poll_votes || null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      }));

      setPosts(transformedPosts);
    } catch (err) {
      console.error(`Error getting posts : ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetFeed();
  }, []);

  const handleCreatePost = async (postData: any) => {
    try {
      await api.post("posts", postData);
      alert("Post created!");
      setIsCreatePostVisible(false);
      await handleGetFeed();
    } catch (err) {
      alert("An error occured");
      console.error(`Error creating post : ${err}`);
    }
  };

  const handleVote = async (postId: number, optionIndex: number) => {
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost?.poll_options) return;

    if (voterKey && targetPost.poll_votes?.[voterKey] !== undefined) {
      return;
    }

    if (
      optionIndex < 0 ||
      optionIndex >= (targetPost.poll_options.options?.length || 0)
    ) {
      return;
    }

    try {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId || !post.poll_options) return post;

          const options = post.poll_options.options || [];
          const currentVotes = Array.isArray(post.poll_options.votes)
            ? [...post.poll_options.votes]
            : options.map(() => 0);

          currentVotes[optionIndex] = (currentVotes[optionIndex] || 0) + 1;

          const updatedPollVotes = { ...(post.poll_votes || {}) };
          if (voterKey) {
            updatedPollVotes[voterKey] = optionIndex;
          }

          return {
            ...post,
            poll_options: {
              ...post.poll_options,
              votes: currentVotes,
            },
            poll_votes: updatedPollVotes,
          };
        }),
      );

      await votePoll(postId, optionIndex);
      await handleGetFeed();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        alert("You have already voted on this poll");
      } else {
        console.error(`Vote failed ${error}`);
      }
      await handleGetFeed();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {loading ? (
        <ActivityIndicator size={"large"} color={"#3b82f6"} />
      ) : (
        <FlatList
          data={posts}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleGetFeed} />
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const hasVoted = voterKey
              ? item.poll_votes?.[voterKey] !== undefined
              : false;

            return (
              <PostCard post={item} onVote={handleVote} hasVoted={hasVoted} />
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16 }}
          ListHeaderComponent={
            <>
              <View className="flex-row items-center justify-between mb-6 mt-2">
                <Text className="text-white font-bold text-3xl">Echora</Text>
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-2xl">Connect</Text>
                  <Feather
                    name="link"
                    size={24}
                    color="#3b82f6"
                    className=" bg-white rounded-full p-2 mx-3 border border-2 border-blue-500"
                  />
                </View>
              </View>

              <View className="mb-4">
                <TextInput
                  placeholder="Search for friends"
                  placeholderTextColor="gray"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="bg-gray-100 rounded-xl p-4 border border-blue-300 text-black"
                />
              </View>

              <View className="flex-row items-center justify-between mb-6 ">
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => setIsCreatePostVisible(true)}
                    className="mr-2 p-3 rounded-lg bg-blue-500"
                  >
                    <Text className="text-white font-semibold">Create Post</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setActiveFilter("Following")}
                    className={`mr-2 p-3 rounded-lg ${
                      activeFilter == "Following" ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`${
                        activeFilter == "Following"
                          ? "text-white font-semibold"
                          : "text-black font-semibold "
                      }`}
                    >
                      Following
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setActiveFilter("For You")}
                    className={` p-3 rounded-lg ${
                      activeFilter == "For You" ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`${
                        activeFilter == "For You"
                          ? "text-white font-semibold"
                          : "text-black font-semibold "
                      }`}
                    >
                      For You
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => router.push("/profile")}>
                  <Feather
                    name="user"
                    size={24}
                    color="black"
                    className=" p-2 bg-white rounded-full "
                  />
                </TouchableOpacity>
              </View>
            </>
          }
        />
      )}

      <CreatePostModal
        visible={isCreatePostVisible}
        onClose={() => setIsCreatePostVisible(false)}
        onSubmit={handleCreatePost}
      />
    </SafeAreaView>
  );
};

export default Connect;