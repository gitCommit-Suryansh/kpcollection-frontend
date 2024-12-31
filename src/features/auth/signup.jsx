import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import Header from "../navigation/header";

const Signup = ({ error }) => {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove('token');
  }, []);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const streetRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const postalCodeRef = useRef();
  const mobileNumberRef = useRef();

  const [loading, setLoading] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formdata = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      street: streetRef.current.value,
      city: cityRef.current.value,
      state: stateRef.current.value,
      postalCode: postalCodeRef.current.value,
      mobileNumber: mobileNumberRef.current.value,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/signup`,
        formdata
      );
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Black Background */}
      <div className="md:w-1/3 bg-zinc-900 p-8 flex flex-col justify-center items-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">KP-COLLECTION</h1>
          <p className="text-zinc-400 mb-6">Discover our exclusive collection</p>
          <div className="w-16 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-sm text-zinc-400">Already have an account?</p>
          <Link to="/login">
            <button className="mt-4 px-8 py-2 border border-white text-white rounded-full hover:bg-white hover:text-zinc-900 transition-colors duration-300">
              Sign In
            </button>
          </Link>
        </div>
      </div>

      {/* Right Side - White Background */}
      <div className="md:w-2/3 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-3xl font-semibold mb-8 text-zinc-800">Create Your Account</h2>
          
          <form onSubmit={handlesubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Personal Information */}
              <div className="flex-1 space-y-4">
                <div>
                  <input
                    ref={nameRef}
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="flex-1 space-y-4">
                <div>
                  <input
                    ref={streetRef}
                    type="text"
                    placeholder="Street Address"
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    ref={cityRef}
                    type="text"
                    placeholder="City"
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    ref={stateRef}
                    type="text"
                    placeholder="State"
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                  />
                  <input
                    ref={postalCodeRef}
                    type="text"
                    placeholder="Postal Code"
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <input
                  ref={mobileNumberRef}
                  type="text"
                  placeholder="Mobile Number"
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-zinc-900 text-white py-4 rounded-lg hover:bg-zinc-800 transition-colors duration-300 font-medium"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center md:hidden">
            <p className="text-sm text-zinc-600">Already have an account?</p>
            <Link to="/login">
              <button className="mt-2 text-zinc-900 hover:underline">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    {loading && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div className="loader">Loading...</div>
      </div>
    )}
    </>
  );
};

export default Signup;