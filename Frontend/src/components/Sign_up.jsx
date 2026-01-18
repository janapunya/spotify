import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { FaGoogle, FaEye, FaEyeSlash, FaUser, FaImage } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import api from '../routs/Axios'
const Sign_up = () => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const logoRef = useRef(null)
  const titleRef = useRef(null)
  const googleButtonRef = useRef(null)
  const dividerRef = useRef(null)
  const formRef = useRef(null)
  const imagePreviewRef = useRef(null)
  const [showPassword, setShowPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [isCreated, setisCreated] = useState(false)
  const [feedback, setFeedback] = useState({ visible: false, isCreated: null, message: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [redirectCountdown, setRedirectCountdown] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: null
  })

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

  useEffect(() => {
    if (feedback.visible && feedback.isCreated) {
      setRedirectCountdown(5)
    } else {
      setRedirectCountdown(null)
    }
  }, [feedback.visible, feedback.isCreated])

  useEffect(() => {
    if (redirectCountdown === null) return
    if (redirectCountdown === 0) {
      navigate('/')
      return
    }
    const t = setTimeout(() => setRedirectCountdown((prev) => (typeof prev === 'number' ? prev - 1 : prev)), 1000)
    return () => clearTimeout(t)
  }, [redirectCountdown, navigate])

  // Animate image preview when it appears
  useEffect(() => {
    if (imagePreview && imagePreviewRef.current) {
      gsap.fromTo(imagePreviewRef.current,
        {
          opacity: 0,
          scale: 0.8
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        }
      )
    }
  }, [imagePreview])

  const handleGoogleSignup = () => {
    // Google signup animation
    gsap.to(googleButtonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    })
    window.location.href = 'http://localhost:3000/auth/google'
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData({ ...formData, image: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSubmitting) return
    // Form submission animation
    const button = e.target.querySelector('button[type="submit"]')
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsSubmitting(true)
        Submitdata()
      }
    })
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

  const Submitdata = async () => {
    // client-side validation for better UX
    const newErrors = {}
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors)
      setIsSubmitting(false)
      return
    }
    try {
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('email', formData.email)
      payload.append('password', formData.password)
      if (formData.image) {
        payload.append('image', formData.image)
      }

      const res = await api.post('/users/createUser', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log(res.data)
      const { IsCreated, message } = res.data || {}
      setisCreated(IsCreated)
      setFeedback({ visible: true, isCreated: IsCreated, message: message || '' })

    } catch (err) {
      console.log('Signup error:', err)
      const status = err?.response?.status
      if (status === 422) {
        const errors = err?.response?.data?.errors || []
        const mapped = {}
        errors.forEach(e => {
          const key = e?.path || e?.param
          if (key && !mapped[key]) {
            mapped[key] = e?.msg || 'Invalid value'
          }
        })
        setFieldErrors(mapped)
      } else {
        const apiMessage = err?.response?.data?.message || 'Something went wrong. Please try again.'
        setFeedback({ visible: true, isCreated: false, message: apiMessage })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const redirecthome = ()=>{
    navigate('/')
  }

  return (

    <>
      {feedback.visible && (
        <div className='backdrop-blur-sm h-screen w-screen fixed z-50 inset-0 flex justify-center items-center px-4'>
          <div className={`relative w-full max-w-md rounded-xl border ${feedback.isCreated ? 'bg-green-500/10 border-green-400' : 'bg-red-500/10 border-red-400'} shadow-2xl`}> 
            <button
              type='button'
              aria-label='Close'
              onClick={() => setFeedback(prev => ({ ...prev, visible: false }))}
              className='absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition'
            >
              ×
            </button>
            <div className='p-6'>
              <div className='flex items-center gap-3 mb-2'>
                <div className={`h-3 w-3 rounded-full ${feedback.isCreated ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <h3 className='text-white font-semibold text-lg'>
                  {feedback.isCreated ? 'Registration Successful' : 'Already Registered'}
                </h3>
              </div>
              <p className='text-gray-200 text-sm'>
                {feedback.message || (feedback.isCreated ? 'User created successfully.' : 'User already exists.')}
              </p>
              <div className='mt-4 flex justify-end'>
                {
                  !feedback.isCreated ?(
                    <button
                  type='button'
                  onClick={() => setFeedback(prev => ({ ...prev, visible: false }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-400 transition`}
                >
                  Close
                </button>
                  ):
                  (
                    <button
                  type='button'
                  onClick={redirecthome}
                  className={`px-4 py-2 rounded-md text-sm font-medium bg-green-500 text-black hover:bg-green-400 transition`}
                  
                >
                  {redirectCountdown ? `Go to home page (${redirectCountdown}s)` : 'Go to home page'}
                </button>
                  )
                }
                

                


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
            Sign up for Spotify
          </h1>

          {/* Google Signup Button */}
          <button
            ref={googleButtonRef}
            onClick={handleGoogleSignup}
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

          {/* Email Signup Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
              What's your name?
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined })
                  }}
                  onFocus={(e) => handleInputFocus(e.target)}
                  onBlur={(e) => handleInputBlur(e.target)}
                  placeholder="Enter your name"
                  aria-invalid={!!fieldErrors.name}
                  className={`w-full pl-12 pr-4 py-3 bg-black border rounded-md text-white placeholder-gray-500 focus:outline-none focus:pl-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${fieldErrors.name ? 'border-red-500' : 'border-gray-600'}`}
                  required
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-2 text-xs text-red-400">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                What's your email?
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined })
                }}
                onFocus={(e) => handleInputFocus(e.target)}
                onBlur={(e) => handleInputBlur(e.target)}
                placeholder="name@example.com"
                aria-invalid={!!fieldErrors.email}
                className={`w-full px-4 py-3 bg-black border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${fieldErrors.email ? 'border-red-500' : 'border-gray-600'}`}
                required
              />
              {fieldErrors.email && (
                <p className="mt-2 text-xs text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            {/* Image Upload Field */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Profile Image (Optional)
              </label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      ref={imagePreviewRef}
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-2 border-2 border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setFormData({ ...formData, image: null })
                        const fileInput = document.getElementById('image')
                        if (fileInput) fileInput.value = ''
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-md cursor-pointer bg-black hover:bg-gray-900 transition-colors duration-200 group"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="text-gray-400 text-2xl mb-2 group-hover:text-green-500 transition-colors" />
                      <p className="mb-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 2MB)</p>
                    </div>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Create a password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined })
                  }}
                  onFocus={(e) => handleInputFocus(e.target.parentElement)}
                  onBlur={(e) => handleInputBlur(e.target.parentElement)}
                  placeholder="Enter your password"
                  aria-invalid={!!fieldErrors.password}
                  className={`w-full px-4 py-3 bg-black border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12 ${fieldErrors.password ? 'border-red-500' : 'border-gray-600'}`}
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
              {fieldErrors.password && (
                <p className="mt-2 text-xs text-red-400">{fieldErrors.password}</p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Use at least 8 characters with a mix of letters and numbers
              </p>
            </div>

            {/* Terms and Conditions */}


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
              className={`w-full font-bold py-4 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${isSubmitting ? 'bg-green-600 text-black opacity-60 cursor-not-allowed' : 'bg-green-500 text-black hover:bg-green-400'}`}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>Signing up...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to='/login' className='text-green-500 hover:text-green-400 hover:underline font-semibold transition-colors duration-200'>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sign_up
