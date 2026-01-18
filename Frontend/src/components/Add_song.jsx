import React, { useState, useRef } from "react";
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5"
import { IoPlay } from "react-icons/io5";
import { TbPlayerPauseFilled } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import { musicAPI } from "../routs/Axios";
const Add_song = React.memo(({ Closeform }) => {
    const audioRef = useRef(null);
    const [image, setimage] = useState(null)
    const [audio, setaudio] = useState(null)
    const [Audioinput, setAudioinput] = useState(null)
    const [name, setname] = useState("")
    const [isPlaying, setIsPlaying] = useState(false);
    const [statas, setstutas] = useState(null);
    const [isLoding, setisLoding] = useState(false);
    const [checkStutas, setcheckStutas] = useState(false)
    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const forward = () => {
        audioRef.current.currentTime += 10;
    };

    // Backward 10s
    const backward = () => {
        audioRef.current.currentTime -= 10;
    };

    const Clear = () => {
        setimage(null)
        setaudio(null)
        setname("")
        setIsPlaying(false)
    }

    const submitusic = async () => {
        if (!name || !image || !Audioinput) {
            alert("All fields required");
            return;
        }
        setisLoding(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);
        formData.append("audio", Audioinput);

        try {
            const res = await musicAPI.post("/music/addsong", formData);
            setstutas(res.data.stutas)
            
        } catch (err) {
            setstutas(false)
            console.error(err);
        } finally {
            setisLoding(false);
            setcheckStutas(true);
        }
    };
    if(statas){
        setTimeout(() => {
            Closeform();
        }, 3000);
    }


    return (
        <div className=' border-2 border-zinc-500 rounded-2xl p-4 bg-zinc-900'>
            <div className="flex justify-between mb-5">
                <h1 className=' ml-1  font-semibold text-xl'>Enter song name</h1>
                <button onClick={Closeform}><GiCancel size={25} className="text-zinc-500 mr-2" /></button>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" name='name' value={name} onChange={(e) => setname(e.target.value)} placeholder='ENTER SONG NAME' className='h-12 w-full border-2 border-zinc-400 rounded-2xl pl-3 mb-5' />
                <input type="file" accept='image/*' id='image' className=' hidden' onChange={(e) => setimage(e.target.files[0])} />
                <input type="file" accept='audio/*' id='audio' className=' hidden' onChange={(e) => { setaudio(URL.createObjectURL(e.target.files[0])); setAudioinput(e.target.files[0]) }} />

                <label htmlFor="image" className=' bg-green-500 text-white p-2  rounded-lg hover:bg-green-600 transition-all duration-300 '>Add Cover Image</label>
                <label htmlFor="audio" className='bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all duration-300 ml-5'>Add your audio track</label>
            </form>
            {image &&
                <div className='flex justify-between items-center p-2 bg-[#0f0f0f] rounded-xl border border-gray-800 hover:border-green-500/50 transition-all duration-300 group mt-5'>
                    <div className="flex items-center">
                        <img src={URL.createObjectURL(image)} alt="" className='h-12 w-12 rounded-lg mr-3' />
                        <h1 >{name ? name : "Enter name"}</h1>

                    </div>
                    <div>
                        {audio ?
                            <>
                                <audio ref={audioRef} src={audio} />
                                <button onClick={backward} className="hover:scale-110 hover:shadow-lg transition-all duration-300 mr-10"><IoPlayBack className='text-zinc-500' size={30} /></button>
                                <button onClick={togglePlay} className="hover:scale-110 hover:shadow-lg transition-all duration-300 mr-10">
                                    {isPlaying ? <TbPlayerPauseFilled className='text-zinc-500' size={30} /> : <IoPlay className='text-zinc-500' size={30} />}
                                </button>
                                <button onClick={forward} className="hover:scale-110 hover:shadow-lg transition-all duration-300"><IoPlayForward className='text-zinc-500' size={30} /></button>
                            </> :
                            <h1>Enter your audio file</h1>
                        }

                    </div>
                    <div>
                        <button className="hover:scale-110 hover:shadow-lg transition-all duration-300" onClick={Clear}><MdDeleteForever className='text-zinc-500' size={30} /></button>
                    </div>
                </div>
            }
            <button className="h-10 w-30 border-2 border-zinc-400 rounded-xl mt-5 hover:bg-green-500 duration-500" onClick={submitusic} disabled={isLoding}>{isLoding ? <span className='inline-block h-4 w-4 border-3 border-green-100 border-t-transparent rounded-full animate-spin'></span> : 'Upload song'}</button>
            {
                checkStutas &&(
                    !statas ? (
                        <h1 className=" text-red-500 px-2 py-2 border-2 border-red-500 rounded-2xl mt-5">Something went wrong......</h1>
                    ) : (
                        <h1 className=" text-green-500 px-2 py-2 border-2 border-green-500 rounded-2xl mt-5">Song added successfully</h1>
                    )
                )
            }

        </div>
    )
})

export default Add_song