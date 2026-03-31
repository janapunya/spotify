import React, { useContext, useEffect, useMemo, useState } from "react";
import { IoPlay } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { musicAPI } from "../routs/Axios";
import Playcontext from "./Playcontext";

const PlayListShow = ({ playlist, onBack }) => {
  const { setPlayingData } = useContext(Playcontext);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingSongId, setDeletingSongId] = useState(null);

  useEffect(() => {
    const getSongs = async () => {
      try {
        setLoading(true);
        const res = await musicAPI.get("/music/songs");
        if (res?.data?.stutas) {
          setAllSongs(res.data.responceData || []);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getSongs();
  }, []);

  const playlistSongs = useMemo(() => {
    if (!playlist?.songs?.length) return [];
    const songIds = new Set(playlist.songs);
    return allSongs.filter((song) => songIds.has(song._id));
  }, [allSongs, playlist]);

  const deleteSongFromPlaylist = async (songId) => {
    try {
      setDeletingSongId(songId);
      const res = await musicAPI.post('/playlist/delSongPlaylist', {
        PlaylistId: playlist?._id,
        SongId: songId,
      })

      if (res?.data?.stutas) {
        setAllSongs((prev) => prev.filter((song) => song._id !== songId));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDeletingSongId(null);
    }
  };

  if (!playlist) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center text-zinc-400">
        Select a playlist to view songs
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-85px)] overflow-y-auto no-scrollbar px-2 sm:px-4 py-4">
      <div className="flex items-start justify-between gap-4 overflow-hidden rounded-2xl border border-zinc-700 bg-linear-to-br from-zinc-800 via-zinc-900 to-black p-4 sm:p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center min-w-0">
          <img
            src={playlist.imageUrl}
            alt={playlist.name}
            className="h-32 w-32 sm:h-36 sm:w-36 rounded-xl object-cover shadow-xl"
          />
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-400">Playlist</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-white mt-1 wrap-break-word">
              {playlist.name}
            </h1>
            <p className="text-zinc-300 mt-2">
              {playlistSongs.length} {playlistSongs.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="shrink-0 text-xs sm:text-sm border border-zinc-500 hover:border-green-500 text-zinc-200 hover:text-green-400 px-3 py-1.5 rounded-lg transition-all duration-200"
        >
          Back to all songs
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" />
        </div>
      ) : playlistSongs.length === 0 ? (
        <div className="border border-dashed border-zinc-700 rounded-xl py-12 text-center text-zinc-400">
          No songs in this playlist yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {playlistSongs.map((song) => (
            <div
              key={song._id}
              className="group text-left w-full flex items-center justify-between gap-3 rounded-xl border border-zinc-700 bg-[#181818] hover:bg-[#202020] hover:border-green-500/40 px-3 py-2 transition-all duration-300"
            >
              <div
                onClick={() => setPlayingData(song)}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <div className="relative shrink-0">
                  <img
                    src={song.imgUrl}
                    alt={song.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <IoPlay className="text-white ml-0.5" size={18} />
                  </div>
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-semibold text-zinc-200 truncate group-hover:text-green-400 transition">
                    {song.name}
                  </h2>
                  <p className="text-xs text-zinc-400">Tap to play</p>
                </div>
              </div>

              <button
                onClick={() => deleteSongFromPlaylist(song._id)}
                className="shrink-0 p-2 rounded-full hover:bg-zinc-700 transition"
              >
                {deletingSongId === song._id ? (
                  <span className="inline-block h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdDeleteForever size={22} className="text-red-500" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayListShow;
