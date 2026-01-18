import React, { useEffect, useRef, useState, Activity } from 'react'
import { gsap } from 'gsap'
import axios from '../routs/Axios'
import { Link, useSearchParams } from 'react-router-dom'
import { FaEnvelope, FaUser, FaMusic, FaChevronDown, FaCog } from 'react-icons/fa'
import Setting from './Setting'
const defaultImg = "https://www.vhv.rs/dpng/d/256-2569650_men-profile-icon-png-image-free-download-searchpng.png"
import Add_songs from './Song_list'
const Useraccount = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [setting, setsetting] = useState(false)
  const firstDivRef = useRef(null)
  const secondDivRef = useRef(null)
  const profileImgRef = useRef(null)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const roleRef = useRef(null)
  const roleDropdownRef = useRef(null)
  const roleSelectRef = useRef(null)
  const [UpdateRole, setUpdateRole] = useState(false)

  useEffect(() => {
    fetchUserData()

  }, [UpdateRole])

  useEffect(() => {
    if (user && !loading) {
      animateElements()
    }
  }, [user, loading])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false)
      }
    }

    if (showRoleDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      // Animate dropdown opening
      if (roleSelectRef.current) {
        gsap.fromTo(roleSelectRef.current,
          {
            opacity: 0,
            y: -10,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          }
        )
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showRoleDropdown])

  const fetchUserData = async () => {
    try {
      const res = await axios.post('/users/checkuser')
      if (res.data.stutas && res.data.user) {
        setUser(res.data.user)
      }
    } catch (err) {
      console.log('Error fetching user data:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (newRole) => {
    if (isUpdatingRole || newRole === (user?.role || 'User')) {
      setShowRoleDropdown(false)
      return
    }

    setIsUpdatingRole(true)
    try {
      // Animate the role card before update
      if (roleRef.current) {
        gsap.to(roleRef.current, {
          scale: 0.95,
          opacity: 0.7,
          duration: 0.2,
          ease: 'power2.out'
        })
      }

      const res = await axios.post('/users/updateUser', { role: newRole })

      if (res.data.stutas && res.data.user) {
        // Animate success
        if (roleRef.current) {
          gsap.to(roleRef.current, {
            scale: 1.05,
            duration: 0.3,
            ease: 'back.out(1.7)',
            onComplete: () => {
              gsap.to(roleRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
              })
            }
          })
        }

        setUser(res.data.user)

        // Update profile badge icon with animation
        if (profileImgRef.current) {
          gsap.to(profileImgRef.current.parentElement?.querySelector('.absolute'), {
            rotation: 360,
            scale: 1.2,
            duration: 0.5,
            ease: 'back.out(1.7)',
            onComplete: () => {
              gsap.to(profileImgRef.current.parentElement?.querySelector('.absolute'), {
                scale: 1,
                duration: 0.3
              })
            }
          })
        }
      }
    } catch (err) {
      console.log('Error updating role:', err)
      // Animate error
      if (roleRef.current) {
        gsap.to(roleRef.current, {
          x: -10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.to(roleRef.current, {
              x: 0,
              scale: 1,
              opacity: 1,
              duration: 0.3
            })
          }
        })
      }
    } finally {
      setIsUpdatingRole(false)
      setShowRoleDropdown(false)
    }
  }

  const animateElements = () => {
    // Set initial states
    gsap.set([firstDivRef.current, secondDivRef.current], {
      opacity: 0,
      y: 50
    })

    gsap.set([profileImgRef.current, nameRef.current], {
      opacity: 0,
      scale: 0.8
    })

    gsap.set([emailRef.current, roleRef.current], {
      opacity: 0,
      x: -30
    })

    // Create timeline for animations
    const tl = gsap.timeline()

    // Animate first div
    tl.to(firstDivRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
      .to(profileImgRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)'
      }, '-=0.4')
      .to(nameRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.3')

      // Animate second div
      .to(secondDivRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
      .to([emailRef.current, roleRef.current], {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out'
      }, '-=0.4')

    // Add hover animations for profile image
    if (profileImgRef.current) {
      profileImgRef.current.addEventListener('mouseenter', () => {
        gsap.to(profileImgRef.current, {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      profileImgRef.current.addEventListener('mouseleave', () => {
        gsap.to(profileImgRef.current, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    }
  }
  const handleCloseSetting = () => {
    setsetting(false)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-linear-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-linear-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center'>
        <div className='text-white text-xl'>Please log in to view your account</div>
      </div>
    )
  }

  // Determine role - default to "User" if no role field exists
  const userRole = user.role || 'User'
  const isArtist = userRole.toLowerCase() === 'artist'

  return (
    <>
      <div>
        <Activity mode={setting ? 'visible' : 'hidden'}>
          <Setting user={user} onClose={handleCloseSetting} UpdateRole={UpdateRole} setUpdateRole={setUpdateRole} />
        </Activity>
      </div>
      <div className='min-h-screen bg-linear-to-br from-[#121212] via-[#1a1a1a] to-[#121212] py-8 px-4 sm:px-8'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {/* First Div - Profile Section */}
          <div
            ref={firstDivRef}
            className='bg-linear-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300'
          >
            <div className='flex flex-col sm:flex-row items-center gap-6'>
              <div className='relative'>
                <img
                  ref={profileImgRef}
                  src={user.imgurl || defaultImg}
                  alt={user.name || 'User'}
                  className='h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover border-4 border-green-500'
                />
                <div className='absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg'>
                  {isArtist ? (
                    <FaMusic className='text-white text-sm' />
                  ) : (
                    <FaUser className='text-white text-sm' />
                  )}
                </div>
              </div>
              <div className='flex-1 text-center sm:text-left'>
                <h1
                  ref={nameRef}
                  className='text-3xl sm:text-4xl font-bold text-white mb-2'
                >
                  {user.name || 'User'}
                </h1>
                <p className='text-gray-400 text-sm sm:text-base'>
                  Welcome to your Spotify account
                </p>
              </div>

            </div>
          </div>

          {/* Second Div - User Data Section */}
          <div
            ref={secondDivRef}
            className='bg-linear-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300'
          >
            <h2 className='text-2xl font-bold text-white mb-6 pb-4 border-b border-gray-700'>
              Account Information
            </h2>
            <div className='space-y-4'>
              {/* Email */}
              <div
                ref={emailRef}
                className='flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-xl border border-gray-800 hover:border-green-500/50 transition-all duration-300 group'
              >
                <div className='bg-green-500/20 p-3 rounded-lg group-hover:bg-green-500/30 transition-colors'>
                  <FaEnvelope className='text-green-500 text-xl' />
                </div>
                <div className='flex-1'>
                  <p className='text-gray-400 text-sm mb-1'>Email Address</p>
                  <p className='text-white font-semibold text-lg'>{user.email || 'Not provided'}</p>
                </div>
              </div>

              {/* Role */}
              <div
                ref={roleDropdownRef}
                className='relative'
              >
                <div
                  ref={roleRef}
                  className='flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-xl border border-gray-800 hover:border-green-500/50 transition-all duration-300 group'
                >
                  <div className={`p-3 rounded-lg transition-colors ${isArtist
                    ? 'bg-purple-500/20 group-hover:bg-purple-500/30'
                    : 'bg-blue-500/20 group-hover:bg-blue-500/30'
                    }`}>
                    {isArtist ? (
                      <FaMusic className='text-purple-500 text-xl' />
                    ) : (
                      <FaUser className='text-blue-500 text-xl' />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='text-gray-400 text-sm mb-1'>Account Type</p>
                    <div className='flex items-center gap-2'>
                      <p className={`font-semibold text-lg ${isArtist ? 'text-purple-400' : 'text-blue-400'
                        }`}>
                        {isArtist ? '🎵 Artist' : '👤 User'}
                      </p>
                      {isUpdatingRole && (
                        <span className='inline-block h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin'></span>
                      )}
                    </div>
                    {!isArtist && (
                      <div
                        onClick={() => setsetting(true)}
                        className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-[#2a2a2a]'
                      >
                        <FaCog className='text-2xl' />
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
          {user.role === 'Artist' && (
            <div>
              <Add_songs />
            </div>
          )}
        </div>
      </div>

    </>
  )
}

export default Useraccount