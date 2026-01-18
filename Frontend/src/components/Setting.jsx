import React, { useState, useEffect } from 'react'
import axios from '../routs/Axios'
const Setting = ({ user, onClose, UpdateRole, setUpdateRole }) => {
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [message, setmessage] = useState("")
    const [stutas, setstutas] = useState(false)
    const [loading, setloading] = useState(false)
    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };
    useEffect(() => {
        setSelectedRole(user.role);
        setmessage("")
        setstutas(false)
    }, [user.role]);
    const handleSaveChanges = async () => {
        try {
            setloading(true)
            const res = await axios.post('/users/updateUser', { role: selectedRole })
            if (res.data.stutas && res.data.user) {
                setstutas(true)
                setmessage(res.data.message)
                setUpdateRole(true)
                setTimeout(() => {
                    onClose()
                }, 2000)
            } else {
                setstutas(false)
                setmessage(res.data.message)
                setTimeout(() => {
                    setmessage("")
                }, 2000)
            }
        } catch (err) {
            setmessage(err.response.data.message)
            setTimeout(() => {
                setmessage("")
            }, 2000)
        } finally {
            setloading(false)
        }
    }
    return (
        <div className='fixed top-0 left-0 w-full z-50 min-h-screen backdrop-blur-lg flex items-center justify-center px-4'>

            <div className='max-h-100 max-w-150 w-screen p-10 bg-linear-to-br from-[#1c1c1c] to-[#0a0a0a] rounded-3xl shadow-3xl border border-[#2a2a2a] overflow-y-auto transform scale-95 transition-all duration-500 ease-out hover:scale-100'>
                <h1 className='text-3xl font-extrabold text-white mb-8 pb-5 border-b-2 border-green-500 tracking-wide'>Settings</h1>
                <button
                    className="absolute top-8 right-8 text-gray-400 hover:text-white text-3xl font-extrabold bg-transparent p-2 rounded-full transition-all duration-300 focus:outline-none"
                    onClick={() => {
                        onClose()
                    }}
                    aria-label="Close"
                    title="Close"
                >
                    &times;
                </button>
                {message ? <div className={`${stutas ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'} text-center  border-2 p-3 rounded-lg`}>{message}</div> :

                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2 p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]'>
                            <label htmlFor='name' className='text-gray-300 text-base font-semibold'>Name: <span className='text-white font-normal'>{user.name}</span></label>
                            <label htmlFor="email" className='text-gray-300 text-base font-semibold'>Email: <span className='text-white font-normal'>{user.email}</span></label>
                            {user.role === "User" ?
                            <div className='flex items-center gap-2'>
                                <p className='text-gray-300 text-base font-semibold'>Role:</p>
                                <input type="radio" name="role" id="user" value="User" checked={selectedRole === "User"} onChange={handleRoleChange} />
                                <label htmlFor="user">User</label>
                                <input type="radio" name="role" id="artist" value="Artist" checked={selectedRole === "Artist"} onChange={handleRoleChange} />
                                <label htmlFor="artist">Artist</label>
                            </div>
                            :
                            <div className='flex items-center gap-2'>

                                <p className='text-gray-300 text-base font-semibold'>Role: <span className='text-white font-normal'>{user.role}</span></p>
                            </div>
                            }
                            {/* {selectedRole !== user.role && ( */}
                                <button className='bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-full mt-6 self-center transition-all duration-300 transform hover:scale-105 shadow-lg'
                                onClick={handleSaveChanges} disabled={loading}>{loading ? <span className='inline-block h-4 w-4 border-3 border-green-100 border-t-transparent rounded-full animate-spin'></span> : 'Save Changes'}</button>
                            {/* )} */}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Setting