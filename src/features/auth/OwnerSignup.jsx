import React, { useRef, useState } from 'react';
import axios from 'axios';

const OwnerSignup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const contactRef = useRef();
  const businessNameRef = useRef();
  const gstinRef = useRef();
  const logoRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(); // FormData to handle file and other inputs
    formData.append("name", nameRef.current.value);
    formData.append("email", emailRef.current.value);
    formData.append("password", passwordRef.current.value);
    formData.append("contact", contactRef.current.value);
    formData.append("businessname", businessNameRef.current.value);
    formData.append("gstin", gstinRef.current.value);
    
    if (logoRef.current.files[0]) {
      formData.append("logo", logoRef.current.files[0]); // Attach file
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/ownersignup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-[100vh] bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mt-[13rem] ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin/Business Owner Signup</h2>

        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data" method='post'>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name (required)</label>
            <input
              type="text"
              name="name"
              ref={nameRef}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              ref={emailRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              ref={passwordRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label  className="block text-gray-700 font-medium mb-2">Contact (required, 10 digits)</label>
            <input
              type="tel"
              name="contact"
              ref={contactRef}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Business Name (required)</label>
            <input
              type="text"
              name="businessname"
              ref={businessNameRef}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          

          <div className="mb-4">
            <label  className="block text-gray-700 font-medium mb-2">GSTIN (optional)</label>
            <input
              type="text"
              name="gstin"
              ref={gstinRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Business Logo (optional)</label>
            <input
              type="file"
              name='logo'
              ref={logoRef}
              accept="image/*"
              className="w-full px-4 py-2 text-gray-600 file:bg-indigo-500 file:text-white file:border-none file:rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md font-semibold hover:bg-indigo-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerSignup;
