import React,{useState, useRef} from 'react'

const Addplaylist = () => {
    const [imgfile, setimgfile] = useState(null)
    const [playlistName, setPlaylistName] = useState('')
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setimgfile(file)
            setImagePreview(URL.createObjectURL(file))

        }
    }

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission here
        console.log('Playlist Name:', playlistName)
        console.log('Image File:', imgfile)
    }

  return (
    <div className=" p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
            {/* Title with fade-in animation */}
            <h1 className='font-bold text-3xl mb-8 text-white animate-fade-in'>
                Create New Playlist
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Section with animation */}
                <div className="animate-slide-up">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Playlist Cover
                    </label>
                    <div 
                        onClick={handleImageClick}
                        className="relative group cursor-pointer"
                    >
                        <div className="w-full h-64 bg-linear-to-br from-zinc-800 to-zinc-900 rounded-lg border-2 border-dashed border-zinc-600 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20">
                            {imagePreview ? (
                                <div className="relative w-full h-full">
                                    <img 
                                        src={imagePreview} 
                                        alt="Playlist cover preview" 
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">Change Image</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-6">
                                    <svg 
                                        className="w-16 h-16 mx-auto mb-3 text-zinc-500 group-hover:text-green-500 transition-colors duration-300" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-zinc-400 text-sm group-hover:text-green-400 transition-colors duration-300">
                                        Click to upload image
                                    </p>
                                </div>
                            )}
                        </div>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Playlist Name Input with animation */}
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Playlist Name
                    </label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Enter playlist name" 
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-800/50 border-2 border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 focus:bg-zinc-800 transition-all duration-300 focus:shadow-lg focus:shadow-green-500/20"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-focus-within:w-full"></div>
                    </div>
                </div>

                {/* Submit Button with animation */}
                <div className="animate-slide-up pt-4" style={{ animationDelay: '0.2s' }}>
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Playlist
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Addplaylist