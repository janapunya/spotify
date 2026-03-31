import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import Login from '../components/Login'
import Sign_up from '../components/Sign_up'
import Useraccount from '../components/Useraccount'
import Setting from '../components/Setting'
import Scarch from '../components/Scarch'
const Routers = () => {
  return (
    <>
    <Routes>
    <Route path='/' element={<Header />} />
    <Route path='/login' element={<Login />} />
    <Route path='/sign_up' element={<Sign_up />} />
    <Route path='/Useraccount' element={<Useraccount />} />
    <Route path='/Setting/:user' element={<Setting />} />
    <Route path='/scaech' element={<Scarch/>}/>
    </Routes>
    </>
  )
}

export default Routers