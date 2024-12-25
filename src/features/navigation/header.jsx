import React, { useState } from 'react';
import logo from '../../assets/images/scatch.png'
import IsLoggedIn from '../../utils/IsLoggedIn';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, LogOut } from "lucide-react";


const Header = () => {  // Change 'header' to 'Header'
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };
  

  const loggedin = IsLoggedIn(); // Assuming this is a placeholder for actual login logic

  return (
    <>
  
      <header className="fixed top-0 w-full border-b border-gray-200 z-50 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button className="lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="text-center flex-1 lg:flex-none">
              <Link to="/shop" className="text-2xl font-bold">KP-COLLECTION</Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
              <Link to="/shop" className="text-sm hover:text-gray-600">HOME</Link>
              <Link to="/" className="text-sm hover:text-gray-600">CLOTHING</Link>
              <Link to="/" className="text-sm hover:text-gray-600">ACCESSORIES</Link>
              <Link to="/" className="text-sm hover:text-gray-600">SALE</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/myaccount"><User className="w-5 h-5" /></Link>
              <Link to="/"><Search className="w-5 h-5" /></Link>
              <Link to="/wishlist"><Heart className="w-5 h-5" /></Link>
              <Link to="/cart"><ShoppingCart className="w-5 h-5" /></Link>
              <Link to="/login"><LogOut className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>
      </header>
    </>
    
  );
};

export default Header;
