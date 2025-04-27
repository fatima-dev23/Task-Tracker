import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { IoPerson } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      if (response.data.success) {
        alert("Logged in Successfully!");
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        navigate('/admin-dashboard');
      }
      console.log(response);
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Error! Cannot login at this moment.");
      }
      console.log("Error! Couldn't send data.", error);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-900 font-[Inter]'>
      <form onSubmit={handleSubmit} className='border border-green-400 p-5 px-[4vw] rounded-md bg-gray' action="#">
        <h2 className='text-3xl font-bold text-[#ffffff] text-center mb-1'>Trackit</h2>
        <span className=' mb-4 text-white text-[18px] text-center'>Manage all your tasks at one place</span>
        {error && <p className='text-red-500'>{error}</p>}
        <div className='mt-3 mb-4 flex flex-col'>
          <label className='mb-1 block text-gray-300' htmlFor="email">Email</label>
          <div className='flex items-center border border-green-400 rounded-sm'>

            <input
              className='w-full px-2 text-white bg-transparent py-1 focus:outline-none'
              type="email"
              name="email"
              id="email"
              placeholder='john@gmail.com'
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <span className='px-2 text-gray-400'>
              <IoPerson />
            </span>
          </div>
        </div>
        <div className='mb-4 flex flex-col'>
          <label className='mb-1 block text-gray-300' htmlFor="password">Password</label>
          <div className='relative'>
            <input
              className='w-full border text-white border-green-400 px-3 py-1 rounded-sm pr-10' /* Right padding for icon */
              type="password"
              name="password"
              id="password"
              placeholder='********'
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <RiLockPasswordFill className='absolute right-3 top-2 text-gray-400' /> {/* Right-aligned icon */}
          </div>
        </div>
        <div className='flex justify-between mb-3'>
          <label className='inline-flex items-center'>
            <input type="checkbox" className='form-checkbox' />
            <span className="ml-2 text-gray-300 text-sm">Remember me</span>
          </label>
          <a className='text-[#2563EB] float-end text-sm' href='#'>Forgot Password?</a>
        </div>
        <div className='flex items-center justify-center'>
          <button className='w-full border cursor-pointer rounded-sm bg-green-400 text-white px-[25px] py-1 uppercase font-bold' type='submit'>log in</button>
        </div>
      </form>
    </div>
  )
}

export default Login