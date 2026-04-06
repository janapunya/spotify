import React, { useState, useEffect, useContext } from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { addplayliststutas, Playlistdatas } from './Playcontext'
import { musicAPI } from '../routs/Axios'
const Playlist = React.memo(({ isOpen, onClose, onSelectPlaylist }) => {
    const { showCreatePlaylist, setshowCreatePlaylist } = useContext(addplayliststutas);
    const {playListData, setplayListData} = useContext(Playlistdatas)
    const [playListStutas, setplayListStutas] = useState(false)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        playlists()

    }, [showCreatePlaylist])


    const playlists = async () => {
        try {
            const res = await musicAPI.post('/playlist/playlistdata',)
            setplayListData(res.data.playListData);
            setplayListStutas(res.data.stutas)
        } catch (err) {
            setplayListStutas(false)
        }
    }

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className='fixed inset-0 z-60 lg:hidden transition-opacity duration-300'
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static
                top-[60px] left-0
                h-[calc(100vh-60px)]
                w-80 max-w-[85vw]
                bg-zinc-900
                border-r-2 border-r-zinc-500
                z-60 lg:z-auto
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className='h-13 border-b-2 border-b-zinc-500 flex items-center justify-between px-3 sm:px-5'>
                    <h1 className='text-base  font-semibold'>Your Library</h1>
                    <div className='flex items-center gap-2'>
                        {playListStutas && 
                        <button
                            onClick={() => setshowCreatePlaylist(!showCreatePlaylist)}
                            className='border-2 border-zinc-500 px-2 py-1 rounded-lg hover:scale-105 cursor-pointer hover:shadow-lg transition-all duration-300 bg-zinc-600'
                        >
                            +Add
                        </button>
                        }
                        {/* Close button for lg */}
                        <button
                            onClick={onClose}
                            className='lg:hidden border-2 border-zinc-500 p-1.5 rounded-lg hover:scale-105 cursor-pointer hover:shadow-lg transition-all duration-300'
                        >
                            <FaTimes className='text-zinc-400' />
                        </button>
                    </div>
                </div>
                <div className="h-[calc(100vh-162px)] overflow-y-scroll no-scrollbar px-2 py-3 space-y-2 max-w-full">

                    {!playListStutas ? (
                        <div className="flex items-center justify-center h-full  text-green-500 font-bold">
                            You need to login first
                        </div>
                    ) : playListData.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-green-500 font-bold">
                            Create a new playlist
                        </div>
                    ) : (
                        playListData && playListData.map((data, index) => (
                            <div
                            onClick={() => {
                                onSelectPlaylist?.(data);
                                onClose?.();
                            }}
                                key={index}
                                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-zinc-800 transition-all duration-200 border-2 border-zinc-500"
                            >
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
                        ))
                    )}

                </div>
            </div>
        </>
    )
})

export default Playlist