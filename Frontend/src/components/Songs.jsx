import React, { useState, useEffect,useContext } from 'react'
import { musicAPI } from '../routs/Axios'
import Playcontext from './Playcontext';
const Songs = () => {
  const { PlayingData, setPlayingData } = useContext(Playcontext);
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(false)
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

  return (
    <>
      <h1 className='text-xl font-bold text-white m-4'>Songs for you</h1>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
          </div>
        ) : (
          songs.map((song) => (
            <div key={song._id} onClick={()=>setcurrentplay(song)} className='bg-zinc-800 rounded-lg p-2  border-2 border-zinc-100 flex items-center   cursor-pointer'>
              <img src={song.imgUrl} alt="" className='w-1/3 h-full object-cover border-2 border-zinc-100 rounded-lg mr-2' />
              <div>
                <h2 className='text-lg font-bold text-white'>{song.name}</h2>
                <p className='text-sm text-zinc-400'>Click for playing</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
export default Songs;