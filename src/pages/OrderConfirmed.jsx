import React from 'react';
import { useLocation } from 'react-router-dom';
const OrderConfirmed = () => {
  const location = useLocation();
  const { order } = location.state || {};
 
  
  return (
    <div
      className="flex justify-center items-center justify-center h-screen bg-yellow-400"
    >
      <div className="text-center flex flex-col items-center">
        <svg
          className="w-16 h-16 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-bold text-gray-800">
          Order ID: #{order._id}
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmed;