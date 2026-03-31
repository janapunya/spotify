import { useState } from 'react'
import Playing from './components/playing'
import Router from './routs/Router'
import Playcontext, { addplayliststutas, Playlistdatas } from './components/Playcontext'
const App = () => {
  const [PlayingData, setPlayingData] = useState(null);
  const [showCreatePlaylist, setshowCreatePlaylist] = useState(false);
  const [playListData, setplayListData] = useState([])
  return (
    <>
      <Playcontext.Provider value={{ PlayingData, setPlayingData }}>
        <div className='text-white bg-zinc-900 z-10 h-screen max-w-screen '>
          {PlayingData &&

            <div className='z-50 fixed'>
              <Playing />
            </div>
          }
          <addplayliststutas.Provider value={{ showCreatePlaylist, setshowCreatePlaylist }}>
            <Playlistdatas.Provider value={{ playListData, setplayListData }}>
              <Router />
            </Playlistdatas.Provider>
          </addplayliststutas.Provider>
        </div>
      </Playcontext.Provider>

    </>
  )
}

export default App