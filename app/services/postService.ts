import api from "./api"; //

const requirePostUuid = (postUuid: string) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(postUuid)) {
    throw new Error("A valid post UUID is required");
  }
  return postUuid;
};

const postService = {
  votePoll: async (postUuid: string, optionIndex: number) => {
    postUuid = requirePostUuid(postUuid);
    try {
      const response = await api.post("/posts/vote", {
        postId: postUuid,
        optionIndex,
      });
      return response.data;
    } catch (error) {
      console.log(`Vote error : ${error}`);
      throw error;
    }
  },
  toogleLike: async (postUuid: string) => {
    postUuid = requirePostUuid(postUuid);
    try {
      const response = await api.post(`/posts/${postUuid}/like`);
      return response.data;
    } catch (error) {
      console.log(`Like error: ${error}`);
      throw error;
    }
  },
  getComments: async (postUuid: string) => {
    postUuid = requirePostUuid(postUuid);
    try {
      const response = await api.get(`/posts/${postUuid}/comments`);
      return response.data;
    } catch (error) {
      console.log(`Get comments error: ${error}`);
      throw error;
    }
  },
  addComment: async (postUuid: string, text: string) => {
    postUuid = requirePostUuid(postUuid);
    try {
      const response = await api.post(`/posts/${postUuid}/comment`, { text });
      return response.data;
    } catch (error) {
      // Log full Axios error info to help debug server-side failures
      console.error(`Add comment error: ${error}`);
      // @ts-ignore
      console.error("Add comment server response:", error?.response?.data, "status:", error?.response?.status);
      throw error;
    }
  },
};
export default postService;
