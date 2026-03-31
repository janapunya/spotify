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
    
    {PlayingData && (
  <motion.div
    drag
    initial={{
      x: window.innerWidth - 320,
      y: window.innerHeight - 120
    }}
    dragConstraints={{
      top: 0,
      left: 0,
      right: window.innerWidth,
      bottom: window.innerHeight
    }}
    dragElastic={0.2}
    className="fixed z-50 w-80 p-3 rounded-2xl 
    bg-white/5 backdrop-blur-xl 
    border border-white/10 shadow-2xl 
    flex gap-3 items-center"
  >
    {/* IMAGE */}
    <div className="relative">
      <img
        src={PlayingData.imgUrl}
        alt=""
        className="h-14 w-14 rounded-lg object-cover"
      />

      {/* PLAY OVERLAY */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 rounded-lg transition"
      >
        {isPlaying ? (
          <TbPlayerPauseFilled className="text-white" size={18} />
        ) : (
          <IoPlay className="text-white ml-1" size={18} />
        )}
      </button>
    </div>

    {/* INFO + CONTROLS */}
    <div className="flex-1 min-w-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="text-sm font-semibold text-white truncate">
          {PlayingData.name}
        </h1>

        <GiCancel
          onClick={onClick}
          className="text-zinc-400 hover:text-red-500 cursor-pointer transition"
          size={18}
        />
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-3 mt-2">
        <audio ref={playingRef} src={PlayingData.audioUrl} />

        <button onClick={backward} className="hover:scale-110 transition">
          <IoPlayBack className="text-zinc-400 hover:text-white" size={18} />
        </button>

        <button
          onClick={togglePlay}
          className="bg-green-500 p-2 rounded-full hover:scale-110 transition shadow-md"
        >
          {isPlaying ? (
            <TbPlayerPauseFilled className="text-black" size={16} />
          ) : (
            <IoPlay className="text-black ml-0.5" size={16} />
          )}
        </button>

        <button onClick={forward} className="hover:scale-110 transition">
          <IoPlayForward className="text-zinc-400 hover:text-white" size={18} />
        </button>
      </div>
    </div>
  </motion.div>
)}
    </>
  )
})

export default playing