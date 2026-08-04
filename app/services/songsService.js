import api from "./api.js";

const songsService = {
  //fetch all the songs saved in database
  getAllSongs: async () => {
    try {
      const response = await api.get("/audio");

      return response.data.data || [];
    } catch (error) {
      console.error(
        "getAllSongs failed:",
        error?.response?.data || error.message,
      );
      throw error;
    }
  },
  //get a specific song in the list of songs
  getSongById: async (id) => {
    try {
      const response = await api.get(`/audio/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "getSongById failed:",
        error?.response?.data || error.message,
      );
      throw error;
    }
  },
  //get the songs created bt a specific artist
  getSongsByArtist: async (artistId) => {
    try {
      const response = await api.get(`/audio/artist/${artistId}`);
      console.log(`Retrieved artist's songs ${response.data.data}`);
      return response.data.data;
    } catch (error) {
      console.error(
        "getSongsByArtist failed:",
        error?.response?.data || error.message,
      );
      throw error;
    }
  },
};

export default songsService;
