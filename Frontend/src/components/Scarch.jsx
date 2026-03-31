import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoPlay } from 'react-icons/io5';
import { GoX } from 'react-icons/go';
import { musicAPI } from '../routs/Axios';
import Playcontext from './Playcontext';

const Scarch = () => {
  const { PlayingData, setPlayingData } = useContext(Playcontext);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
const [FindResult, setFindResult] = useState([])


  useEffect(() => {
    const timer = setTimeout(() => {
      ScarchData()
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const ScarchData = async ()=>{
    setLoading(true)
    try{
      const res = await musicAPI.post('/music/Searchdata',{
        query
      })
      setFindResult(res.data.songs);
    }
    catch(err){
      setFindResult([])
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-white text-2xl sm:text-3xl font-bold">Search</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {query.trim()
                ? `Showing results for “${query.trim()}”`
                : 'Find songs by name'}
            </p>
          </div>

          <div className="w-full sm:w-[520px]">
            <div className="flex items-center gap-2 border-2 border-zinc-700 rounded-xl bg-[#181818] px-3 py-2 transition-all focus-within:border-green-500">
              <FaSearch className="text-zinc-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search songs..."
                className="w-full bg-transparent text-white placeholder:text-zinc-600 outline-none"
              />
              {query.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md hover:bg-zinc-800 transition"
                  aria-label="Clear search"
                >
                  <GoX className="text-zinc-400" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
            </div>
          ) : FindResult.length === 0 ? (
            <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-white font-semibold">No songs found</p>
              <p className="text-zinc-400 text-sm mt-2">
                Try a different keyword
              </p>
            </div>
          ) : (
            <div>


              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-lg font-bold">Results</h2>
                <p className="text-zinc-400 text-sm">
                  {FindResult.length} song{FindResult.length === 1 ? '' : 's'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {FindResult.map((song) => (
                  <div
                    key={song._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setPlayingData(song)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                      PlayingData?._id === song._id
                        ? 'border-green-500/60 bg-[#202020]'
                        : 'bg-[#181818] border-zinc-700 hover:border-green-500/40 hover:bg-[#202020]'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative">
                        <img
                          src={song.imgUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover shadow-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition">
                          <IoPlay className="text-white ml-1" size={18} />
                        </div>
                      </div>

                      <div className="overflow-hidden">
                        <h2 className="text-sm font-semibold text-zinc-200 truncate group-hover:text-green-400 transition">
                          {song.name}
                        </h2>
                        <p className="text-xs text-zinc-500 truncate">Tap to play</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scarch;