import React, { useState } from 'react';
import logo from '../../assets/images/scatch.png'
import IsLoggedIn from '../../utils/IsLoggedIn';
import { Link } from 'react-router-dom';


const Header = () => {  // Change 'header' to 'Header'
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };
  

  const loggedin = IsLoggedIn(); // Assuming this is a placeholder for actual login logic

  return (
    <nav className="w-full fixed top-0 px-5 py-3 h-[10vh] flex justify-between items-center bg-white shadow-md z-998 ">
      <h3 className="text-xl">
        <img src={logo} alt="Logo" className="logo w-[9vw]" />
      </h3>
      {loggedin && (
        <>
          {/* <i className="ri-menu-line hamburger text-2xl"></i> */}
          <div className={`options flex gap-5 text-[1.2rem] ${loggedin ? 'flex' : 'hidden'} md:flex`}>
            <Link to='/shop' className="shop">SHOP</Link>
            <Link to='/cart' className="cart">CART</Link>
            <Link to='/myaccount' className="myAccount">MY ACCOUNT</Link>
            <Link to='/login' className='text-red-600'>LOGOUT</Link>

          </div>
        </>
      )}
    </nav>
  );
};

export default Header;
