import React, { useEffect, useRef } from "react";
import Header from "../navigation/header"; // Adjust the path as necessary
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

const Signup = ({ error }) => {

  useEffect(()=>{
    Cookies.remove('token');
  },[])
  

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const streetRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const postalCodeRef = useRef();

  const handlesubmit = async (e) => {
    e.preventDefault();
    const formdata = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      street: streetRef.current.value,
      city: cityRef.current.value,
      state: stateRef.current.value,
      postalCode: postalCodeRef.current.value,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/signup`,
        formdata
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

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

      {/* {error.length > 0 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-md bg-red-500">
          <span className="inline-block mt-1 mb-1 text-white">
            {error}
          </span>
        </div>
      )} */}

      <div className="container w-full h-screen flex px-20">
        <div className="main-div w-1/2 flex items-center justify-center h-screen">
          <div className="w-full px-32">
            <h3 className="text-4xl">
              welcome to{" "}
              <span className="text-blue-400 font-semibold">Scratch</span>
            </h3>
            <h4 className="text-2xl mb-5">create your account</h4>
            <form autoComplete="off" onSubmit={handlesubmit}>
              <input
                className="bg-zinc-100 block w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
                type="text"
                placeholder="Full Name"
                name="name"
                ref={nameRef}
              />
              <input
                className="bg-zinc-100 block w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
                type="email"
                placeholder="Email"
                name="email"
                ref={emailRef}
              />
              <input
                className="bg-zinc-100 block w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
                type="password"
                placeholder="Password"
                name="password"
                ref={passwordRef}
              />

              <input
                className="bg-zinc-100 block w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
                type="text"
                placeholder="Street"
                name="street"
                ref={streetRef}
              />

              <input
                className="bg-zinc-100 block w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
                type="text"
                placeholder="City"
                name="city"
                ref={cityRef}
              />  

              <input
                className="bg-zinc-100 block w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
                type="text"
                placeholder="State"
                name="state"
                ref={stateRef}
              />  

              <input
                className="bg-zinc-100 block w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
                type="text"
                placeholder="Postal Code"
                name="postalCode"
                ref={postalCodeRef}
              />  
              
              

              <button
                className="px-5 rounded-full py-3 mt-2 bg-blue-500 text-white"
                type="submit"
              >
                Create Account
              </button>
            </form>
            <div className="mt-5">
              <Link to="/login">
                <button className="px-5 rounded-full py-2 mt-2 bg-gray-500 text-white">
                  Go to Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
