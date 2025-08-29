import React, { useState } from 'react';
// import logo from '../../assets/images/favicon.png'
import logo from '../../assets/images/signatureLogoFinal.png'
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
        <div className=" mx-auto px-5 py-5">
          <div className="flex items-center justify-between relative"> {/* Added 'relative' to allow absolute positioning of the logo */}
            {/* Leftmost position: Hamburger icon */}
            <button className="pr-[10px]" onClick={toggleMenu}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Centermost position: Signature (logo) */}
            {/* Using absolute positioning to ensure it's truly centered regardless of side content width */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img src={logo} alt="KP Collection Logo" className="h-16 inline-block" />
            </div>
            
            {/* Rightmost position: Decoded icons based on rendering logic (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-4">
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
          
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-4 mt-16" onClick={(e) => e.stopPropagation()}>
            <Link to="/"><h2 className="text-lg font-semibold mb-4">HOME</h2></Link>
            {/* <h2 className="text-lg font-semibold mb-4">CLOTHING</h2> */}
            {/* <Link to="/accessories"><h2 className="text-lg font-semibold mb-4">ACCESSORIES</h2></Link>*/}
          
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

            {/* Mobile-only account/actions */}
            <div className="md:hidden mt-6 border-t pt-4">
              <h2 className="text-lg font-semibold mb-3">Account</h2>
              <div className="flex flex-col gap-3 pl-2">
                {decodedToken ? (
                  <>
                    <Link to="/myaccount" onClick={toggleMenu} className="flex items-center gap-2 text-gray-700 hover:text-gray-900"><User className="w-5 h-5" /><span>My Account</span></Link>
                    <Link to="/wishlist" onClick={toggleMenu} className="flex items-center gap-2 text-gray-700 hover:text-gray-900"><Heart className="w-5 h-5" /><span>Wishlist</span></Link>
                    <Link to="/cart" onClick={toggleMenu} className="flex items-center gap-2 text-gray-700 hover:text-gray-900"><ShoppingCart className="w-5 h-5" /><span>Cart</span></Link>
                    <Link to="/login" onClick={toggleMenu} className="flex items-center gap-2 text-gray-700 hover:text-gray-900"><LogOut className="w-5 h-5" /><span>Logout</span></Link>
                  </>
                ) : (
                  <Link to="/login" onClick={toggleMenu} className="flex items-center gap-2 text-gray-700 hover:text-gray-900"><LogIn className="w-5 h-5" /><span>Login</span></Link>
                )}
              </div>
            </div>

            
          </div>
        </div>
      )}
    </>
    
  );
};

export default Header;
