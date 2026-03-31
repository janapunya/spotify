import React, { useState, useEffect, useContext, Activity } from 'react'
import { musicAPI } from '../routs/Axios'
import Playcontext, { Playlistdatas } from './Playcontext';
import { SlOptionsVertical } from "react-icons/sl";
import { FaTimes } from 'react-icons/fa'
import { FaRegSquarePlus } from "react-icons/fa6";
import { IoPlay } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { button, h1 } from 'motion/react-client';
const Songs = () => {
  const { PlayingData, setPlayingData } = useContext(Playcontext);
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [PlaylistOpen, setPlaylistOpen] = useState(false)
  const [setsongdata, setsetsongdata] = useState(null)
  const { playListData, setplayListData } = useContext(Playlistdatas)
  const [addstutas, setaddstutas] = useState(false)
  const [lodingstutas, setlodingstutas] = useState(false)
  useEffect(() => {
    getSongs()
  }, [])

  const getSongs = async () => {
    try {
      setLoading(true)
      const res = await musicAPI.get('/music/songs')
      if (res.data.stutas) {
        setSongs(res.data.responceData)
      }
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  }
  const setcurrentplay = (song) => {
    setPlayingData(song);
  }

  const addsongplaylist = async (PlaylistId, SongId) => {
    try {
      setLoading(true)
      const res = await musicAPI.post('/playlist/addsongplaylist', {
        PlaylistId, SongId
      })
      if(res.data.stutas == true){
       playlists()
      }
    }
    catch (err) {
      console.error(err);

    }
    finally {
      setLoading(false);
    }
  }

  const delsongplaylist = async (PlaylistId, SongId) => {
    try {
      setLoading(true)
      const res = await musicAPI.post('/playlist/delSongPlaylist', {
        PlaylistId, SongId
      })
      if(res.data.stutas == true){
        playlists()
       }
    }
    catch (err) {
      console.error(err);

    }
    finally {
      setLoading(false);
    }
  }

  const playlists = async () => {
    try {
        const res = await musicAPI.post('/playlist/playlistdata',)
        setplayListData(res.data.playListData);
    } catch (err) {
    }
}
  return (
    <>
      <Activity mode={PlaylistOpen ? "visible" : "hidden"}>

        <div className='h-screen w-screen fixed z-70 backdrop-blur-2xl flex justify-center items-center'>
          <div className='border-2 border-stone-700 rounded-2xl bg-slate-900 px-3 py-2 md:w-1/3 lg:w-1/4 sm:w-1/2 w-full mx-5 sm:m-0'>
            <div className=' flex justify-between items-center h-17 border-b-2 border-zinc-600 pr-5'>
              <div className='flex items-center gap-3 font-bold'>
                <img src={setsongdata?.imgUrl} alt="image"
                  className="w-12 h-12 rounded-md object-cover" />
                <h1>{setsongdata?.name}</h1>
              </div>
              <button
                onClick={() => setPlaylistOpen(!PlaylistOpen)}
              >
                <FaTimes className='text-zinc-400' />
              </button>
            </div>
            <div className='mt-2'>
              {
                playListData?.length == 0 ?
                  <h1>Create a new playlist</h1>
                  :
                  playListData?.map((data, index) => (

                    <div
                      key={index}
                      className="flex justify-between items-center p-2 rounded-lg border-2 border-zinc-500"
                    >
                      <div className='flex items-center gap-3'>
                        <img
                          src={data.imageUrl}

                          alt="playlist"
                          className="w-12 h-12 rounded-md object-cover"
                        />

                        <div className="flex flex-col overflow-hidden">
                          <h3 className="text-sm font-medium truncate">
                            {data.name}
                          </h3>
                          <p className="text-xs text-zinc-400">
                            Playlist
                          </p>
                        </div>
                      </div>
                      <div>
                        {
                          data.songs.includes(setsongdata?._id) ?
                          <button className='cursor-pointer'
                          onClick={() => delsongplaylist(data._id, setsongdata._id)}
                        >
                          {loading ? <>
                            <div className='flex justify-center items-center h-full'>
                              <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500'></div>
                            </div>
                          </> :
                            <MdDeleteForever size={25} className=' text-red-700' />
                          }
                        </button>
                            :
                            <button className='cursor-pointer'
                              onClick={() => addsongplaylist(data._id, setsongdata._id)}
                            >
                              {loading ? <>
                                <div className='flex justify-center items-center h-full'>
                                  <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-500'></div>
                                </div>
                              </> :
                                <FaRegSquarePlus size={25} className=' text-green-600 ' />
                              }
                            </button>
                        }

                      </div>
                    </div>
                  ))
              }

            </div>
          </div>
        </div>
      </Activity>
      <h1 className='text-xl font-bold text-white m-4'>Songs for you</h1>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
          </div>
        ) : (
          songs.map((song) => (
            <div
              key={song._id}
              className="group flex items-center justify-between px-3 py-2 rounded-xl bg-[#181818] border border-zinc-700 hover:border-green-500/40 hover:bg-[#202020] transition-all duration-300 cursor-pointer"
            >
              {/* LEFT SIDE */}
              <div
                onClick={() => setcurrentplay(song)}
                className="flex items-center gap-3 flex-1"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={song.imgUrl}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover shadow-md"
                  />

                  {/* HOVER PLAY ICON */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition">
                    <IoPlay className="text-white ml-1" size={18} />
                  </div>
                </div>

                {/* TEXT */}
                <div className="overflow-hidden">
                  <h2 className="text-sm font-semibold text-zinc-200 truncate group-hover:text-green-400 transition">
                    {song.name}
                  </h2>
                  <p className="text-xs text-zinc-400">Tap to play</p>
                </div>
              </div>

              {/* RIGHT OPTIONS */}
              <button
                onClick={() => {
                  setsetsongdata(song);
                  setPlaylistOpen(!PlaylistOpen)

                }}
                className="p-2 rounded-full  hover:bg-zinc-700 transition"
              >
                <SlOptionsVertical className="text-zinc-400 hover:text-white" size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </>
  )
}
export default Songs;