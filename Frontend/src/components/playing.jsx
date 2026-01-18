import React, { useState, useEffect, useRef, useContext, use } from 'react'
import { motion } from "motion/react"
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5"
import { IoPlay } from "react-icons/io5";
import { TbPlayerPauseFilled } from "react-icons/tb";
import Playcontext from './Playcontext';
import { GiCancel } from "react-icons/gi";


const playing = React.memo(() => {
  const playingRef = useRef(null)
  const {PlayingData, setPlayingData} = useContext(Playcontext)
  const [isPlaying, setisPlaying] = useState(false);

  useEffect(() => {
    playingRef.current.play();
    setisPlaying(true)
  
    return () => {
      playingRef.current = null;
    }
  }, [])
  
  const togglePlay = () => {
    if (isPlaying) {
      playingRef.current.pause();
    } else {
      playingRef.current.play();
    }
    setisPlaying(!isPlaying);
};

const forward = () => {
  playingRef.current.currentTime += 10;
};

// Backward 10s
const backward = () => {
  playingRef.current.currentTime -= 10;
};

const onClick = ()=>{
  playingRef.current = null;
  setPlayingData(null);
}

  return (
    <>
    
    {PlayingData && 
    
      <motion.div
      drag
      initial={{
        x: window.innerWidth - 300,
        y: window.innerHeight - 120
      }}
      dragConstraints={{top:0,left:0,right: window.innerWidth,bottom: window.innerHeight}}
      dragElastic={0.8}
      className=' border-2 border-zinc-500 text-amber-50 h-25 w-72 p-2 rounded-xl flex bg-zinc-800 '>
        <img src={PlayingData.imgUrl} alt="" className='h-20 w-20 rounded-md mr-3' />
        <div >
          <div className='flex justify-between pr-2 mb-4'>
          <h1>{PlayingData.name}</h1>
          <GiCancel onClick={onClick} className=' text-zinc-500 cursor-pointer' size={22}/>
          </div>
          <div>
            <audio ref={playingRef} src={PlayingData.audioUrl}></audio>
            <button onClick={backward} className="hover:scale-110 hover:shadow-lg transition-all duration-300 mr-10"><IoPlayBack className='text-zinc-500' size={30} /></button>
            <button onClick={togglePlay} className="hover:scale-110 hover:shadow-lg transition-all duration-300 mr-10">
              {isPlaying ? <TbPlayerPauseFilled className='text-zinc-500' size={30} /> : <IoPlay className='text-zinc-500' size={30} />}
            </button>
            <button onClick={forward} className="hover:scale-110 hover:shadow-lg transition-all duration-300"><IoPlayForward className='text-zinc-500' size={30} /></button>

          </div>
        </div>


      </motion.div>
    }
    </>
  )
})

export default playing