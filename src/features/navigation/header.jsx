import React, { useState } from 'react';
import logo from '../../assets/images/favicon.png'
import Cookies from "js-cookie";
import decodeToken from "../../utils/decodeToken";
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart,User, LogOut,LogIn } from "lucide-react";


const Header = () => { 
  const [menuOpen, setMenuOpen] = useState(false);

  const token = Cookies.get("token");
  const decodedToken = decodeToken(token);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <>
  
      <header className="fixed top-0 w-full border-b border-gray-200 z-50 bg-white">
        <div className=" mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <button className="pr-[10px]" onClick={toggleMenu}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="text-center flex-1 lg:flex-none justify-center items-center flex">
              <img src={logo} alt="KP Collection Logo" className="h-8 inline-block" />
              <Link to="/" className={`${window.innerWidth>=1024?"text-2xl":''} font-bold`}>KP-COLLECTION</Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
              <Link to="/" className="text-sm hover:text-gray-600">HOME</Link>
              <Link to="/" className="text-sm hover:text-gray-600">CLOTHING</Link>
              <Link to="/accessories" className="text-sm hover:text-gray-600">ACCESSORIES</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {decodedToken ? (
                <>
                  <Link to="/myaccount"><User className="w-5 h-5" /></Link>
                  <Link to="/wishlist"><Heart className="w-5 h-5" /></Link>
                  <Link to="/cart"><ShoppingCart className="w-5 h-5" /></Link>
                  <Link to="/login"><LogOut className="w-5 h-5" /></Link>
                </>
              ) : (
                <Link to="/login"><LogIn className="w-5 h-5" /></Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40" onClick={toggleMenu}>
          
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-4 mt-16">
            <Link to="/"><h2 className="text-lg font-semibold mb-4">HOME</h2></Link>
            <h2 className="text-lg font-semibold mb-4">CLOTHING</h2>
            {/* <Link to="/accessories"><h2 className="text-lg font-semibold mb-4">ACCESSORIES</h2></Link> */}
          
            <h2 className="text-lg font-semibold mb-4">SHOP BY CATEGORY</h2>
            <ul>
             
              <li className="mb-2 pl-4">
                <Link to="/collection/Shirt" className="text-gray-700 hover:text-gray-900">Shirts</Link>
              </li>
              <li className="mb-2 pl-4">
                <Link to="/collection/Jeans" className="text-gray-700 hover:text-gray-900">Jeans</Link>
              </li>
              <li className="mb-2 pl-4">
                <Link to="/collection/T-Shirts" className="text-gray-700 hover:text-gray-900">T-Shirts</Link>
              </li>
              <li className="mb-2 pl-4">
                <Link to="/collection/Lower" className="text-gray-700 hover:text-gray-900">Lowers</Link>
              </li>
              
            </ul>
            <Link to="/about-us"><h2 className="text-lg font-semibold mb-4">ABOUT US</h2></Link>

            
          </div>
        </div>
      )}
    </>
    
  );
};

export default Header;
