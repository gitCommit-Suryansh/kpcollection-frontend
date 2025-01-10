import React from 'react';
import Header from '../features/navigation/header';
import { Link } from 'react-router-dom';
import decodeToken from '../utils/decodeToken';
import Cookies from "js-cookie";
import axios from 'axios';
import { useEffect,useState } from 'react';
import { User, ShoppingCart, Heart,ShoppingBag } from 'lucide-react';

const MyAccount = () => {
  const [user, setuser] = useState()
  const [error, setError] = useState(null);
  const token = Cookies.get("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.id;
  
  useEffect(() => {
    const userDetails=async(req,res)=>{
      try{
        const response=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/get-profile/${userId}`)
        if(response){
            setuser(response.data.user)
            
        }
        else{
          console.log("error fetching details")
        }

      }
      catch{
        console.error("Failed to decode token:", error);
        setError("Failed to retrieve user information.");

      }
    }
    userDetails();
  }, [])
  
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-500"></div>
            <div className="animate-pulse text-zinc-500 pl-3">Loading...</div>
          </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 pt-24">
        {/* Profile Overview Card */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  {user.profile ? (
                    <img src={`data:image/jpg;base64,${Buffer.from(user.profile.data).toString("base64")}`} alt="User Profile" className="w-24 h-24 rounded-full" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <p className="text-white text-4xl">{user.name[0].toUpperCase()}</p>
                    </div>
                  )}
                </div>
                <span className="absolute bottom-2 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <h2 className="text-xl font-bold mt-4 mb-1">Welcome back</h2>
              <p className="text-gray-500 text-sm">{user.name}</p>
            </div>
            
            {/* Navigation Menu */}
            <nav className="mt-8">
              <ul className="space-y-2">
                <li>
                  <Link to="/myaccount/myprofile" className="flex items-center p-3 rounded-xl hover:bg-gray-50 group transition-all duration-300">
                    <User className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="ml-3 text-gray-600 group-hover:text-gray-900">My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link to="/myaccount/myorders" className="flex items-center p-3 rounded-xl hover:bg-gray-50 group transition-all duration-300">
                    <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="ml-3 text-gray-600 group-hover:text-gray-900">Orders</span>
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="flex items-center p-3 rounded-xl hover:bg-gray-50 group transition-all duration-300">
                    <Heart className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="ml-3 text-gray-600 group-hover:text-gray-900">Wishlist</span>
                  </Link>
                </li>
                <li>
                  
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Action Cards */}
            <Link to="/myaccount/myorders">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-400">Orders</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{user.orders.length}</h3>
              <p className="text-gray-500 text-sm">Total orders So Far</p>
            </div>
            </Link>

            <Link to="/cart">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-400">Cart</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{user.cart.length}</h3>
              <p className="text-gray-500 text-sm">Items in your Cart</p>
            </div>
            </Link>

            {/* Recent Activity Section */}
            <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                
                <Link to="/wishlist">
                  <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">Added item to wishlist</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;