import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // For navigation
import Cookies from 'js-cookie';


const OwnerLogin = () => {
  useEffect(() => {
    Cookies.remove("token");
  }, []);

  let navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [Message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/ownerlogin`,formData,{
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const { token } = response.data;
        document.cookie = `token=${token}; path=/; max-age=36000; secure; samesite=None`;
        setMessage("Logged in Succesfully")
        navigate("/AdminHome");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mt-[2rem] ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Admin/Business Owner Login
        </h2>

        {Message && (
          <p className="text-red-500 text-sm mb-4">{Message}</p>
        )}

        <form onSubmit={handleSubmit} method="post">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              ref={emailRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              ref={passwordRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md font-semibold hover:bg-indigo-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerLogin;
