import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';
import logo from '../assets/logo.png'

const RegisterPage = () => {
  const [data,setData] = useState({
    name : "",
    email : "",
    password : "",
    profile_pic : ""
  })
  const [uploadPhoto,setUploadPhoto] = useState("")
  const navigate = useNavigate()

  const handleOnChange = (e)=>{
    const { name, value} = e.target

    setData((preve)=>{
      return{
          ...preve,
          [name] : value
      }
    })
  }

  const handleUploadPhoto = async(e)=>{
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)

    setUploadPhoto(file)

    setData((preve)=>{
      return{
        ...preve,
        profile_pic : uploadPhoto?.url
      }
    })
  }
  const handleClearUploadPhoto = (e)=>{
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto(null)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/register`

    try {
        const response = await axios.post(URL,data)
        console.log("response",response)

        toast.success(response.data.message)

        if(response.data.success){
            setData({
              name : "",
              email : "",
              password : "",
              profile_pic : ""
            })

            navigate('/email')

        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
    console.log('data',data)
  }


  return (
    
<div className='min-h-screen bg-gray-900 text-white'>
  <div className='flex justify-center items-center pt-8'>
    <div className='bg-orange-500 p-3 rounded-full'>
      <img src={logo} alt="logo" className='w-32' />
    </div>
  </div>

  <div className='w-full max-w-sm bg-gray-800 shadow-lg rounded-lg overflow-hidden p-5 mx-auto mt-8'>
    <h3 className='text-center text-xl font-semibold mb-4'>Welcome to Laugh Daily!</h3>

    <form className='grid gap-3' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-1'>
        <label htmlFor='name' className='text-gray-400 text-sm'>Name :</label>
        <input
          type='text'
          id='name'
          name='name'
          placeholder='Enter your name' 
          className='bg-gray-700 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary'
          value={data.name}
          onChange={handleOnChange}
          required
        />
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='email' className='text-gray-400 text-sm'>Email :</label>
        <input
          type='email'
          id='email'
          name='email'
          placeholder='Enter your email' 
          className='bg-gray-700 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary'
          value={data.email}
          onChange={handleOnChange}
          required
        />
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='password' className='text-gray-400 text-sm'>Password :</label>
        <input
          type='password'
          id='password'
          name='password'
          placeholder='Enter your password' 
          className='bg-gray-700 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary'
          value={data.password}
          onChange={handleOnChange}
          required
        />
      </div>

      <div className='flex flex-col gap-1'>
  <label htmlFor='profile_pic' className='text-gray-400 text-sm'>Photo :</label>
  <div
    className='h-12 bg-gray-700 flex justify-center items-center border border-gray-600 rounded cursor-pointer hover:border-primary'
    onClick={() => document.getElementById('profile_pic').click()} // Trigger the file input click
  >
    <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
      {uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"}
    </p>
    {uploadPhoto?.name && (
      <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
        <IoClose/>
      </button>
    )}
  </div>
  <input
    type='file'
    id='profile_pic'
    name='profile_pic'
    className='hidden'
    onChange={handleUploadPhoto}
  />
</div>

      <button
        className='bg-primary text-base px-3 py-1.5 rounded mt-2 font-bold text-white hover:bg-orange-500 transition-colors'
      >
        Register
      </button>
    </form>

    <p className='my-3 text-center text-gray-400 text-sm'>Already have an account? 
      <Link to={"/email"} className='hover:text-primary text-white font-semibold ml-1'>Login</Link>
    </p>
  </div>
</div>


  )
}

export default RegisterPage