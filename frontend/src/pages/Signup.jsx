import React, { useState } from 'react'
import axios from "axios";
function Signup() {
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError]=useState(null);

    const handleSubmit = async(event) => {
        event.preventDefault()
        try {
          const response = await axios.post(
            "http://localhost:8000/api/auth/signup",
            {username, email, password},
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          if (response.data.success) {
            alert("Logged in Successfully!")
          }
          console.log(response);
        } catch (error) {
            if (error.response && !error.response.data.success) {
                setError(error.response.data.error)
                
            }else{
                setError("Error! Cannot login at this moment.")
            }
          console.log("Error! Couldn't send data.", error);
        }
      }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-200 font-[Inter]'>
            <form  onSubmit={handleSubmit} className='border p-5 px-[4vw] rounded-md bg-white' action="#">
                <h2 className='text-3xl font-bold text-[#2563EB] text-center mb-4'>EMS - SignUp</h2>
                {error && <p className='text-red-500'>{error}</p>}
                <div className='mb-4 flex flex-col'>
                    <label className='mb-1 block text-gray-700' htmlFor="username">Username</label>
                    <input
                        className='w-full border px-3 py-1 rounded-sm'
                        type="text" name="username" id="username" placeholder='John' 
                        onChange={(event)=> setUsername(event.target.value)}
                        required/>
                </div>
                <div className='mb-4 flex flex-col'>
                    <label className='mb-1 block text-gray-700' htmlFor="email">Email</label>
                    <input
                        className='w-full border px-3 py-1 rounded-sm'
                        type="email" name="email" id="email" placeholder='john@gmail.com' 
                        onChange={(event)=> setEmail(event.target.value)}
                        required/>
                </div>
                <div className='mb-4 flex flex-col'>
                    <label className='mb-1 block text-gray-700' htmlFor="password">Password</label>
                    <input className='w-full border px-3 py-1 rounded-sm' 
                    type="password" name="password" id="password" placeholder='********' 
                    onChange={(event)=> setPassword(event.target.value)}
                    required/>
                </div>
                <div className='flex items-center justify-center'>
                    <button className='w-full border cursor-pointer rounded-sm bg-[#2563EB] text-white px-[25px] py-1 uppercase font-bold' type='submit'>log in</button>
                </div>

            </form>
        </div>
  )
}

export default Signup