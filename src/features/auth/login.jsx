import React, { useEffect, useRef, useState } from "react";
import Header from "../navigation/header"; // Adjust the path as necessary
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // For navigation
import Cookies from "js-cookie";

const Login = () => {
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading

  useEffect(() => {
    Cookies.remove("token");
  }, []);

  let navigate = useNavigate();
  let emailRef = useRef();
  let passwordRef = useRef();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted
    let formdata = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        formdata,
        {
          withCredentials: true, // Important to allow cookies to be sent
        }
      );

      if (response.status === 200) {
        // You can set the token here manually if you need to store it in a cookie
        const { token } = response.data;

        // Set token in a cookie
        document.cookie = `token=${token}; path=/; max-age=36000; secure; samesite=None`;
        setSuccess("Logged in successfully");
        console.log("Success message set:", "Logged in successfully"); // Debugging log
        navigate("/");
      } else {
        setSuccess("Incorrect credentials");
        console.log("Success message set:", "Incorrect credentials"); // Debugging log
      }
    } catch (err) {
      // Enhanced error logging
      if (err.response) {
        setSuccess(err.response.data.message || "Unknown error"); // Set a user-friendly error message
      } else {
        setSuccess("Login failed: " + err.message); // Set a user-friendly error message
      }
    } finally {
      setLoading(false); // Set loading to false after the response is received
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
      {success && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 p-3 z-50 
            bg-red-500 text-white rounded-lg shadow-lg mt-16"
        >
          {success}
        </div>
      )}

      <div className="main-div2 w-full max-w-md mx-auto flex items-center justify-center h-screen">
        <div className="w-full px-8 py-6 bg-white shadow-md rounded-lg">
          <h4 className="text-2xl font-semibold text-center mb-6">
            Login to Your Account
          </h4>
          <form autoComplete="off" onSubmit={handlesubmit}>
            <input
              className="block bg-gray-100 w-full px-4 py-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
              type="email"
              placeholder="Email"
              name="email"
              ref={emailRef}
            />
            <input
              className="block bg-gray-100 w-full px-4 py-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
              type="password"
              placeholder="Password"
              name="password"
              ref={passwordRef}
            />
            <button
              className="w-full py-3 mt-4 bg-black text-white rounded-3xl hover:bg-gray-800 transition duration-300"
              type="submit"
            >
              Login
            </button>
          </form>
          <div className="mt-5 text-center">
            <Link to="/signup">
              <button className="px-5 rounded-full py-2 mt-2 bg-gray-500 text-white hover:bg-gray-600 transition duration-300">
                Create New Account
              </button>
            </Link>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="min-h-screen flex items-center justify-center flex-col gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-500"></div>
            <div className="animate-pulse text-zinc-500 pl-3">Loading...</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
