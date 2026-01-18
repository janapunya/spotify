import React, { useEffect, useState, useRef,useContext, use } from 'react'
import { GoHome, GoHomeFill } from "react-icons/go";
import { FaBars } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Playlist from './Playlist';
import axios from '../routs/Axios';
import { gsap } from 'gsap';
import Songs from './Songs';
import { FaSearch } from 'react-icons/fa';
import {addplayliststutas} from './Playcontext'
import Addplaylist from './Addplaylist';
const defaultImg = "https://www.vhv.rs/dpng/d/256-2569650_men-profile-icon-png-image-free-download-searchpng.png"
const Header = () => {
    const {showCreatePlaylist, setshowCreatePlaylist} = useContext(addplayliststutas)
    const [isLogin, setisLogin] = useState(false)
    const [formData, setformData] = useState("")
    const [user, setuser] = useState()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const hamburgerRef = useRef(null)
    const spotifyLogoRef = useRef(null)
    const searchInputWrapperRef = useRef(null)
    const loginButtonRef = useRef(null)
    const signUpButtonRef = useRef(null)
    const userAccountLinkRef = useRef(null)

    useEffect(()=>{
        userStatus();
    },[])
 
    useEffect(() => {
        // Initial animations
        gsap.fromTo(hamburgerRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 });
        gsap.fromTo(spotifyLogoRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.2 });
        gsap.fromTo(searchInputWrapperRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.4 });
        
        if (isLogin) {
            gsap.fromTo(userAccountLinkRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.6 });
        } else {
            gsap.fromTo(loginButtonRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.6 });
            gsap.fromTo(signUpButtonRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.8 });
        }
       
       // Hover animations for buttons and links
       const addHoverAnimation = (elementRef, scale = 1.1) => {
           if (elementRef.current) {
               elementRef.current.addEventListener('mouseenter', () => {
                   gsap.to(elementRef.current, { scale: scale, duration: 0.3, ease: 'power2.out' });
               });
               elementRef.current.addEventListener('mouseleave', () => {
                   gsap.to(elementRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' });
               });
           }
       };
       
       addHoverAnimation(hamburgerRef);
       addHoverAnimation(searchInputWrapperRef, 1.02);
       if (isLogin) {
           addHoverAnimation(userAccountLinkRef);
       } else {
           addHoverAnimation(loginButtonRef);
           addHoverAnimation(signUpButtonRef);
       }
    }, [isLogin]);

    const userStatus = async () => {
        const res= await axios.post('/users/checkuser')
        setisLogin(res.data.stutas);
        setuser(res.data.user || "");
    }




    
    return (
        <>
            <div className='h-15 border-b-2 border-b-zinc-500 flex items-center justify-between px-3 sm:px-5'>
                <div className='flex items-center gap-3'>
                    {/* Hamburger menu button for mobile */}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        ref={hamburgerRef}
                        className='lg:hidden border-2 border-zinc-500 p-2 rounded-lg hover:scale-105 cursor-pointer hover:shadow-lg transition-all duration-300'
                    >
                        <FaBars className='text-white' />
                    </button>
                    <img src="/spotify.png" alt="Spotify Logo" 
                        ref={spotifyLogoRef}
                        className='h-12 w-12' 
                    />
                </div>
                <div 
                    ref={searchInputWrapperRef}
                    className='flex border-2 border-zinc-400 rounded-lg'
                >
                    <div className='py-1 px-2'><GoHomeFill className='text-zinc-300 ' size={35} /></div>
                    <div className='border-l-2 border-l-zinc-500 py-1 px-2'><FaSearch className='text-zinc-300' size={30} /></div>
                    
                </div>
                <div>
                    {
                        isLogin ? (
                            <Link to='/Useraccount' 
                                ref={userAccountLinkRef}
                                className='h-12 pl-1  rounded-full flex items-center  sm:bg-linear-to-r from-amber-500 via-pink-500 to-purple-600'>
                                <img src={user.imgurl || defaultImg} alt="" className='h-10 w-10 rounded-full' />
                                <h1 className='text-white px-2 font-bold hidden sm:inline-block'>
                                    {user.name || "Hi user"}
                                </h1>
                            </Link>
                        ) :
                            (
                                <div className='flex'>
                                    <Link to='/login' 
                                        ref={loginButtonRef}
                                        className="h-10 border-2 border-zinc-300 px-4 flex items-center justify-center rounded-lg hover:scale-110 hover:shadow-lg transition-all duration-300 mr-3">Login</Link>
                                    <Link to='/sign_up' 
                                        ref={signUpButtonRef}
                                        className="h-10 border-2 border-zinc-300 px-4 flex items-center justify-center rounded-lg hover:scale-110 hover:shadow-lg transition-all duration-300">Sign Up</Link>
                                </div>
                            )
                    }


                </div>
            </div>
            <div className=' flex'>
                <Playlist  isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                    <div className=' w-full p-1 sm:p-3'>
                        {
                            showCreatePlaylist?
                            <Addplaylist/>:
                            <Songs />
                        }
                    
                    </div>
            </div>
        </>
    )
}

export default Header