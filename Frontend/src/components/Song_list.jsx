import React, { useState, useRef, useEffect, useCallback, use } from 'react'
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5"
import { IoPlay } from "react-icons/io5";
import { TbPlayerPauseFilled } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import Add_song from './Add_song';
import { musicAPI } from "../routs/Axios";
import { GiCrossMark } from "react-icons/gi";
import { GiCheckMark } from "react-icons/gi";
const Song_list = () => {
    const audioRef = useRef({});
    const [showform, setshowform] = useState(false)
    const [isPlaying, setIsPlaying] = useState({});
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [All_songs, setAll_songs] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [deletestutas, setdeletestutas] = useState({})
    const [deleteUpdateStutas, setdeleteUpdateStutas] = useState(null)
    const [lodingstutas, setlodingstutas] = useState(false)
    const Closeform = useCallback(() => {
        setshowform(false)
    }, [showform])


    useEffect(() => {
        allsong();
    }, [])

    useEffect(() => {
        if (All_songs) {
            All_songs.forEach(song => {
                setdeletestutas((prev) => ({
                    ...prev,
                    [song._id]: { loading: null, success: null },
                }));
            });
        }
    }, [All_songs])



    const allsong = async () => {
        try {
            const res = await musicAPI.get('/music/allsongs');
            setAll_songs(res.data.songs)

        }
        catch (err) {
            console.log(err)
        }
    }


    const togglePlay = (id) => {
        if (isPlaying[id]) {
            audioRef.current[id].pause();
        } else {
            audioRef.current[id].play();
        }
        setIsPlaying(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    const forward = (id) => {
        audioRef.current[id].currentTime += 10;
    };

    // Backward 10s
    const backward = (id) => {
        audioRef.current[id].currentTime -= 10;
    };


    const delete_song = async (id) => {
        try {
            setdeletestutas((prev) => ({
                ...prev,
                [id]: { loading: true, success: null },
            }));

            const res = await musicAPI.post('/music/delete_song', {
                id
            })     
            setdeletestutas((prev) => ({
                ...prev,
                [id]: { loading: false, success: res.data.stutas },
            }));
        }
        catch (err) {
            console.log(err);
            setdeletestutas((prev) => ({
                ...prev,
                [id]: { loading: false, success: false },
            }));
        }
        finally {
            setTimeout(() => {
                setdeletestutas((prev) => ({
                    ...prev,
                    [id]: { loading: false, success: false },
                }));
                allsong();
            }, 3000);
        }
    }

    return (
        <>

            {showform &&
                <div className='fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm z-50 flex items-center justify-center'>
                    <Add_song Closeform={Closeform} />
                </div>
            }
            <div className='bg-linear-to-r to-[#1a1a1a] from-10% from-[#2a2a2a] to-90% rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300'>
                <div className='flex justify-between'>

                    <h2 className='text-2xl font-bold text-white mb-6 pb-4'>All Songs</h2>
                    <button className='bg-green-500 text-white h-12 w-30 rounded-lg hover:bg-green-600 transition-all duration-300' onClick={() => setshowform(true)}> Add song</button>
                </div>
                <div className='space-y-4'>
                    {
                        All_songs.map((song) => (
                            
                            <div
                                key={song._id}
                                className='flex items-center justify-between bg-[#0f0f0f] rounded-xl border border-gray-800 hover:border-green-500/50 transition-all duration-300 group'>
                                <div className='flex ml-2'>
                                    <img src={song.imgUrl} alt="" className='h-12 w-12 rounded-lg mr-3' />

                                    <div>
                                        <h1>{song?.name}</h1>
                                        <p>artist name</p>
                                    </div>
                                </div>
                                <div>
                                    <div>

                                        <audio key={song._id} ref={(e) => (audioRef.current[song._id]) = e} src={song?.audioUrl} />
                                        <button onClick={() => backward(song._id)} className="hover:scale-110 hover:shadow-lg transition-all duration-300 sm:mr-10"><IoPlayBack className='text-zinc-500' size={30} /></button>
                                        <button onClick={() => togglePlay(song._id)} className="hover:scale-110 hover:shadow-lg transition-all duration-300 sm:mr-10">
                                            {isPlaying[song._id] ? <TbPlayerPauseFilled className='text-zinc-500' size={30} /> : <IoPlay className='text-zinc-500' size={30} />}
                                        </button>
                                        <button onClick={() => forward(song._id)} className="hover:scale-110 hover:shadow-lg transition-all duration-300"><IoPlayForward className='text-zinc-500' size={30} /></button>
                                    </div>


                                </div>
                                <div className='mr-2'>
                                    <button onClick={() => delete_song(song._id)} className="hover:scale-110 hover:shadow-lg transition-all duration-300">
                                        {deletestutas[song._id]?.loading ? (
                                            <span className='inline-block h-4 w-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin'></span>
                                        ) : deletestutas[song._id]?.success === true ? (
                                            <GiCheckMark color='green' size={25} />
                                        ) : deletestutas[song._id]?.success === false ? (
                                            <GiCrossMark color='red' size={25} />
                                        ) : (
                                            <MdDeleteForever className='text-zinc-500' size={30} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
        </>
    )
}

export default Song_list