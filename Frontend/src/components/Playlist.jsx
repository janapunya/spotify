import React, { useState, useEffect,useContext } from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'
import {addplayliststutas} from './Playcontext'
const Playlist = React.memo( ({ isOpen, onClose }) => {
   const {showCreatePlaylist, setshowCreatePlaylist} = useContext(addplayliststutas);
    const [showSearchPlaylist, setshowSearchPlaylist] = useState(false)

    // Prevent body scroll when sidebar is open on mobile
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
                        <button 
                            onClick={() => setshowCreatePlaylist(!showCreatePlaylist)} 
                            className='border-2 border-zinc-500 px-1 py-1 rounded-lg hover:scale-105 cursor-pointer hover:shadow-lg transition-all duration-300 '
                        >
                            <span >+</span><span>Add playlist</span>
                        </button>
                        {/* Close button for lg */}
                        <button 
                            onClick={onClose}
                            className='lg:hidden border-2 border-zinc-500 p-1.5 rounded-lg hover:scale-105 cursor-pointer hover:shadow-lg transition-all duration-300'
                        >
                            <FaTimes className='text-zinc-400' />
                        </button>
                    </div>
                </div>

                <div className='p-3 border-b-2 border-b-zinc-500 flex items-center justify-between'>
                    <div className="mr-2 cursor-pointer"
                        onClick={() => setshowSearchPlaylist(!showSearchPlaylist)}
                    >
                        <FaSearch className='text-zinc-500' />
                    </div>
                    {showSearchPlaylist ? (
                        <input type="text" name="search-playlist" id="search-playlist" placeholder='Search' className='w-full h-10 border-2 border-zinc-500 rounded-lg focus:outline-none focus:ring-0 focus:border-zinc-500 px-2 py-1' />
                    ):(
                        <h1 className='text-zinc-500 mr-5'>All Playlists</h1>
                    )}
                </div>
            </div>
        </>
    )
})

export default Playlist