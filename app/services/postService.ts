import api from "./api"; //
const postService = {
  votePoll: async (postId: number, optionIndex: number) => {
    try {
      const response = await api.post("/posts/vote", {
        postId,
        optionIndex,
      });
      return response.data;
    } catch (error) {
      console.log(`Vote error : ${error}`);
      throw error;
    }
  },
  toogleLike: async (postId: number) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.log(`Like error: ${error}`);
      throw error;
    }
  },
  getComments: async (postId: number) => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.log(`Get comments error: ${error}`);
      throw error;
    }
  },
  addComment: async (postId: number, text: string) => {
    try {
      const response = await api.post(`/posts/${postId}/comment`, { text });
      return response.data;
    } catch (error) {
      console.log(`Add comment error: ${error}`);
      throw error;
    }
  },
};
export default postService;
