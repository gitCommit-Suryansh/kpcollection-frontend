import React from 'react';
import { Link } from 'react-router-dom';

const MyAccount = () => {
  return (
    <div className="max-w-md mx-auto p-4 mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Account</h2>
      <div className="grid grid-cols-1 gap-4">
        <Link to="/myaccount/myprofile" className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2">My Profile</h3>
          <p className="text-gray-600">View and edit your profile information</p>
        </Link>
        <Link to="/myaccount/myorders" className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2">My Orders</h3>
          <p className="text-gray-600">View your order history and track your orders</p>
        </Link>
        <Link to="/my-wishlist" className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2">My Wishlist</h3>
          <p className="text-gray-600">View and manage your wishlist items</p>
        </Link>
        <Link to="/my-addresses" className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2">My Addresses</h3>
          <p className="text-gray-600">View and manage your saved addresses</p>
        </Link>
      </div>
    </div>
  );
};

export default MyAccount;