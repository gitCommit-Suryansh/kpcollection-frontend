import React, { useEffect, useRef ,useState} from 'react'
import Header from '../navigation/header'; // Adjust the path as necessary
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // For navigation
import Cookies from 'js-cookie';
// import dotenv from 'dotenv';
// dotenv.config();



const Login = () => {
  const [sucess, setsucess] = useState("")
  useEffect(()=>{
    Cookies.remove('token');
  },[])
  
   
   let navigate=useNavigate()
   let emailRef=useRef()
   let passwordRef=useRef()
    
   const handlesubmit=async(e)=>{
    e.preventDefault()
    let formdata={
        email:emailRef.current.value,
        password:passwordRef.current.value
    }
    try{
        let response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`,formdata,{
          withCredentials: true,
        })
        if(response.status===200){
          setsucess("logged in sucessfully")

          navigate('/Shop')
          
        }
        else{
          setsucess("incorrect creadentials")
        }
      
    }catch(err){
        console.log(err)
    }
   }
  return (
    <>
      <Header />
      <style>
        {`
          @media (max-width: 1024px) {
            .main-div2 {
              width: auto;
            }
            .main-div {
              padding-top: 10vh !important;
            }
            .main-div, .main-div2 {
              width: auto !important;
            }
            .main-div > div, .main-div2 > div {
              padding-left: 9px !important;
              padding-right: 9px !important;
            }
            .container {
              padding-left: 0 !important;
              padding-right: 0 !important;
              flex-direction: column !important;
              padding-top: 10vh !important;
            }
          }
        `}
      </style>
      {sucess && sucess.length > 0 && (
        <div
          className={`absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-md ${
            sucess === "logged in sucesfully" ? "bg-blue-500" : "bg-red-500"
          }`}
        >
          <span className="inline-block mt-1 mb-1 text-white">{sucess}</span>
        </div>
      )}

     <div className="main-div2 w-1/2 flex items-center justify-center h-screen">
          <div className="w-full px-32">
            <h4 className="text-2xl capitalize mb-5">login your account</h4>
            <form autoComplete="off" onSubmit={handlesubmit}>
              <input
                className="block bg-zinc-100 w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
                type="email"
                placeholder="Email"
                name="email"
                ref={emailRef}
              />
              <input
                className="block bg-zinc-100 w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
                type="password"
                placeholder="Password"
                name="password"
                ref={passwordRef}
              />
              <button
                className="px-5 block rounded-full py-2 mt-2 bg-blue-500 text-white"
                type="submit"
              >Login</button>
            </form>
            <div className="mt-5">
              <Link to="/">
                <button className="px-5 rounded-full py-2 mt-2 bg-gray-500 text-white">
                  Create New Account
                </button>
              </Link>
            </div>
          </div>
        </div></>
  )
}

export default Login