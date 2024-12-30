import './App.css';
import Signup from './features/auth/signup'
import Login from './features/auth/login';
import OwnerSignup from './features/auth/OwnerSignup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Shop from './pages/Shop';
import ProtectedRoute from './utils/ProtectedRoute';
import CreateProduct from './pages/CreateProduct';
import ProtectedRouteOwners from './utils/ProtectedRouteOwners';
import OwnerLogin from './features/auth/OwnerLogin';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import MyAccount from './pages/MyAccount';
import MyOrders from './features/MyAccountPages/MyOrders';
import MyProfile from './features/MyAccountPages/MyProfile';
import OrderDetails from './features/MyAccountPages/OrderDetails';
import Collection from './features/Collection/Collection';
import Success from './features/payment/Success';
import Failure from './features/payment/Failure';
import { Buffer } from 'buffer';


function App() {
  window.Buffer = Buffer;
  return (
    <>
    
    <Router>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/Shop' element={<ProtectedRoute element={<Shop/>} />}/>
        <Route path='/cart' element={<ProtectedRoute element={<Cart/>} />} />
        <Route path='/wishlist' element={<ProtectedRoute element={<Wishlist/>} />} />
        <Route path='/myaccount' element={<ProtectedRoute element={<MyAccount/>} />} />
        <Route path='/myaccount/myorders' element={<ProtectedRoute element={<MyOrders/>} />} />
        <Route path='/myaccount/myorders/:id' element={<ProtectedRoute element={<OrderDetails/>} />} />
        <Route path='/myaccount/myprofile' element={<ProtectedRoute element={<MyProfile/>} />} />
        <Route path='/admin-signup' element={<OwnerSignup/>}/>
        <Route path='/createproduct' element={<ProtectedRouteOwners element={<CreateProduct/>} />} />
        <Route path='/admin-login' element={<OwnerLogin/>}/>
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/checkout' element={<ProtectedRoute element={<Checkout/>} />} />
        <Route path='/orderconfirmed' element={<OrderConfirmed/>} />
        <Route path='/collection/:category' element={<Collection/>}/>
        <Route path='/payment/success' element={<Success/>} />
        <Route path='/payment/failure' element={<Failure/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
