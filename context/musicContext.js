import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { createContext, useContext, useEffect, useState } from "react";
import songsService from "../app/services/songsService.js";
import { useAuth } from "./auth.js";

const MusicContext = createContext();
export const MusicProvider = ({ children }) => {
  const { role } = useAuth();
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [playBackMode, setPlayBackMode] = useState("sequential"); // 'repeat', 'shuffle', 'normal'
  const [isLoading, setIsLoading] = useState(true);
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  //load the music context with songs from the backend
  const loadSongs = async () => {
    setIsLoading(true);
    try {
      let data;
      //if it is an artist who has logged in,load their songs
      if (role == "artist") {
        data = await songsService.getSongsByArtist(2);
        //otherwise load all the songs for users
      } else {
        data = await songsService.getAllSongs();
      }
      setSongs(data);
    } catch (error) {
      console.error("Failed to load songs:", error);
    } finally {
      setIsLoading(false);
    }
  };
  /*run the loadSongs() whenever there is a role change
  i.e a user logs out and signs in as an artist
  */
  useEffect(() => {
    loadSongs();
  }, [role]);
  // enable changing between various playback modes
  const togglePlaybackMode = () => {
    setPlayBackMode((prevMode) => {
      if (prevMode === "sequential") return "shuffle";
      if (prevMode === "shuffle") return "repeat";
      return "sequential";
    });
  };

  useEffect(() => {
    //check if a song playing has ended
    if (status.duration > 0 && status.currentTime >= status.duration - 1) {
      //if so,start it again for repeat mode
      if (playBackMode === "repeat") {
        player.seekTo(0);
        player.play();
        //or play a ranodm song in the list of songs
      } else if (playBackMode === "shuffle") {
        const randomIndex = Math.floor(Math.random() * songs.length);
        playSong(songs[randomIndex]);
        //by default play the next song in the list
      } else {
        playNext();
      }
    }
  }, [status.currentTime, status.duration, playBackMode]);
  const playSong = async (song) => {
    if (!song) return;
    const audioPath = song.url || song.audioURL;
    if (!audioPath) {
      console.error(`No path found for ${song.name}`);
      return;
    }
    try {
      //use song list from backend if the song is not a local file
      let source;
      //check if the audioPath is a string(local file) or an object(from backend)
      if (typeof audioPath === "string") {
        const fullUrl = audioPath.startsWith("/")
          ? `http://10.178.72.202:5000${audioPath}`
          : audioPath;
        source = { uri: fullUrl };
      } else {
        source = audioPath;
      }
      setCurrentSong(song);
      player.replace(source);
      player.play();
    } catch (error) {
      console.log(`PlaybackError${error}`);
    }
  };
  const playNext = () => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };
  const playPrevious = () => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[previousIndex]);
  };
  const tooglePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };
  const stopPlayback = () => {
    player.pause();
    setCurrentSong(null);
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        stopPlayback,
        isPlaying: status.playing,
        playSong,
        tooglePlayPause,
        playNext,
        playPrevious,
        status,
        player,
        togglePlaybackMode,
        playBackMode,
        songs,
        isLoading,
        refreshSongs: loadSongs,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
export const useMusic = () => useContext(MusicContext);
