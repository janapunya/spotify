import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../routs/Axios'
const Login = () => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const logoRef = useRef(null)
  const titleRef = useRef(null)
  const googleButtonRef = useRef(null)
  const dividerRef = useRef(null)
  const formRef = useRef(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isUser, setisUser] = useState()
  const [valisPass, setvalisPass] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isUser === true && valisPass === true) {
      navigate('/')
    }
  }, [isUser, valisPass])


  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create timeline for entrance animations
    const tl = gsap.timeline()

    // Initial state - everything invisible
    gsap.set([logoRef.current, titleRef.current, googleButtonRef.current, formRef.current], {
      opacity: 0,
      y: 30
    })

    gsap.set(dividerRef.current, {
      opacity: 0,
      y: 10
    })

    // Animate elements in sequence
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.3')
      .to(googleButtonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.3')
      .to(dividerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.2')
      .to(formRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.3')

    // Background gradient animation
    gsap.to(container, {
      backgroundPosition: '100% 100%',
      duration: 15,
      ease: 'none',
      repeat: -1,
      yoyo: true
    })

    return () => {
      tl.kill()
    }
  }, [])

  const handleGoogleLogin = () => {
    // Google login animation
    gsap.to(googleButtonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    })
    window.location.href = 'http://localhost:3000/auth/google'

  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission animation
    const button = e.target.querySelector('button[type="submit"]')
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    })
    // Handle form submission logic here
    console.log('Form submitted', formData)
  }

  const handleInputFocus = (inputRef) => {
    gsap.to(inputRef, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleInputBlur = (inputRef) => {
    gsap.to(inputRef, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const userCheck = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try{
      const res = await axios.post('/users/login', {
        email: formData.email,
        password: formData.password
      })
      setisUser(res.data.stutas);
      setvalisPass(res.data.pass);
    }
    catch(err){
      console.log(err)
    }
    finally{
      setIsSubmitting(false)
    }

  }

  return (
    <>
    {isUser === false && (
    <div className='fixed backdrop-blur-xl h-screen w-screen z-50 inset-0 flex items-center justify-center px-4'>
      <div className='relative w-full max-w-md rounded-xl border bg-red-500/10 border-red-400 shadow-2xl'>
        <button
          type='button'
          aria-label='Close'
          onClick={() => setisUser(undefined)}
          className='absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition'
        >
          ×
        </button>
        <div className='p-6'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='h-3 w-3 rounded-full bg-red-400'></div>
            <h3 className='text-white font-semibold text-lg'>User not found</h3>
          </div>
          <p className='text-gray-200 text-sm'>Using this email user does not exist.</p>
          <div className='mt-4 flex justify-end'>
            <button
              type='button'
              onClick={() => setisUser(undefined)}
              className='px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-400 transition'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    )}
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #121212 50%, #1e1e1e 100%)',
        backgroundSize: '200% 200%'
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div ref={logoRef} className="flex justify-center mb-8">
          <img
            src="/spotify.png"
            alt="Spotify Logo"
            className="h-16 w-16 md:h-20 md:w-20"
          />
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-8 text-white"
        >
          Log in to Spotify
        </h1>

        {/* Google Login Button */}
        <button
          ref={googleButtonRef}
          onClick={handleGoogleLogin}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.02,
              duration: 0.2,
              ease: 'power2.out'
            })
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              duration: 0.2,
              ease: 'power2.out'
            })
          }}
          className="w-full bg-white text-black font-bold py-4 px-6 rounded-full mb-6 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <FaGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div ref={dividerRef} className="flex items-center justify-center mb-6">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="px-4 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        {/* Email/Password Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onFocus={(e) => handleInputFocus(e.target)}
              onBlur={(e) => handleInputBlur(e.target)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setvalisPass(null)
                }}
                onFocus={(e) => handleInputFocus(e.target.parentElement)}
                onBlur={(e) => handleInputBlur(e.target.parentElement)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {valisPass == false && (
            <div className='mt-2 flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2'>
              <span className='mt-[2px] inline-block h-4 w-4 text-red-400'>
                <svg viewBox='0 0 20 20' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.5a.75.75 0 10-1.5 0v5a.75.75 0 001.5 0v-5zM10 14.75a1 1 0 100 2 1 1 0 000-2z' clipRule='evenodd' />
                </svg>
              </span>
              <div className='text-sm text-red-300'>
                Password incorrect. Please try again.
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">

            <a
              href="#"
              className="text-green-500 hover:text-green-400 hover:underline transition-colors duration-200"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            onMouseEnter={(e) => {
              if (isSubmitting) return
              gsap.to(e.currentTarget, {
                scale: 1.02,
                duration: 0.2,
                ease: 'power2.out'
              })
            }}
            onMouseLeave={(e) => {
              if (isSubmitting) return
              gsap.to(e.currentTarget, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
              })
            }}
            onClick={userCheck}
            className={`w-full font-bold py-4 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${isSubmitting ? 'bg-green-600 text-black opacity-60 cursor-not-allowed' : 'bg-green-500 text-black hover:bg-green-400'}`}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>Logging in...</span>
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Sign up link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to='/sign_up' className='text-green-500 hover:text-green-400 hover:underline font-semibold transition-colors duration-200'>
              Sign up for Spotify
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login
