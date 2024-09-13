import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import logo from '../assets/logo.png'

const CheckEmailPage = () => {
  const [data,setData] = useState({
    email : "",
  })
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

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/email`

    try {
        const response = await axios.post(URL,data)

        toast.success(response.data.message)

        if(response.data.success){
            setData({
              email : "",
            })
            navigate('/password',{
              state : response?.data?.data
            })
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
  }


  return (
    <div className='min-h-screen bg-gray-900 text-white'>
  <div className='flex justify-center items-center pt-8'>
    <div className='bg-orange-500 p-3 rounded-full'>
      <img src={logo} alt="logo" className='w-32' />
    </div>
  </div>

  <div className='bg-gray-800 w-full max-w-lg shadow-lg rounded-lg overflow-hidden p-8 mx-auto mt-10'>
    <h3 className='text-center text-2xl font-semibold mb-6'>Log in to your account!</h3>

    <form className='grid gap-5' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-1'>
        <label htmlFor='email' className='text-gray-400 text-sm'>Email :</label>
        <input
          type='email'
          id='email'
          name='email'
          placeholder='Enter your email' 
          className='bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary'
          value={data.email}
          onChange={handleOnChange}
          required
        />
      </div>

      <button
        className='bg-primary text-lg px-4 py-2 rounded mt-4 font-bold text-white hover:bg-orange-500 transition-colors'
      >
        Let's Go
      </button>
    </form>

    <p className='my-4 text-center text-gray-400'>
      New User? 
      <Link to={"/register"} className='hover:text-primary text-white font-semibold ml-1'>
        Register
      </Link>
    </p>
  </div>
</div>

  
  )
}

export default CheckEmailPage