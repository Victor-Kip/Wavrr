import api from "./api.js";

const requireUuid = (value) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error("A valid artist UUID is required");
  }
  return value;
};

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
  getSongsByArtist: async (artistUuid) => {
    try {
      const response = await api.get(`/audio/artist/${requireUuid(artistUuid)}`);
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
