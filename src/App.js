import './App.css';
import Signup from './features/auth/signup'
import Login from './features/auth/login';
import OwnerSignup from './features/auth/OwnerSignup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lenis from '@studio-freight/lenis'

import Shop from './pages/Shop';
import ProtectedRoute from './utils/ProtectedRoute';
import CreateProduct from './pages/CreateProduct';
import AdminHome from './pages/AdminHome';
import ProtectedRouteOwners from './utils/ProtectedRouteOwners';
import OwnerLogin from './features/auth/OwnerLogin';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import MyAccount from './pages/MyAccount';
import MyOrders from './features/MyAccountPages/MyOrders';
import MyProfile from './features/MyAccountPages/MyProfile';
import OrderDetails from './features/MyAccountPages/OrderDetails';
import Collection from './features/Collection/Collection';
import Success from './features/payment/Success';
import Failure from './features/payment/Failure';
import { Buffer } from 'buffer';
import Accessories from './pages/Accessories';
import OrdersDashboard from './pages/OrdersDashboard';
import AboutUs from './pages/AboutUs'
import { useEffect } from 'react';

function App() {
  window.Buffer = Buffer;
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])
  return (
    <>
    
    <Router>
      <Routes>
        {/* Users routes */}
        <Route path='/' element={<Shop/>} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/cart' element={<ProtectedRoute element={<Cart/>} />} />
        <Route path='/accessories' element={<Accessories/>} />
        <Route path='/wishlist' element={<ProtectedRoute element={<Wishlist/>} />} />
        <Route path='/myaccount' element={<ProtectedRoute element={<MyAccount/>} />} />
        <Route path='/myaccount/myorders' element={<ProtectedRoute element={<MyOrders/>} />} />
        <Route path='/myaccount/myorders/:id' element={<ProtectedRoute element={<OrderDetails/>} />} />
        <Route path='/myaccount/myprofile' element={<ProtectedRoute element={<MyProfile/>} />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/payment/success' element={<Success/>} />
        <Route path='/collection/:category' element={<Collection/>}/>
        <Route path='/payment/failure' element={<Failure/>} />
        <Route path='/checkout' element={<ProtectedRoute element={<Checkout/>} />} />
        <Route path='/about-us' element={<AboutUs/>}/>

        <Route path='/AdminHome' element={<AdminHome/>}/>
        <Route path='/admin-signup' element={<OwnerSignup/>}/>
        <Route path='/createproduct' element={<ProtectedRouteOwners element={<CreateProduct/>} />} />
        <Route path='/admin-login' element={<OwnerLogin/>}/>
        <Route path='/OrdersDashboard' element={<OrdersDashboard/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
