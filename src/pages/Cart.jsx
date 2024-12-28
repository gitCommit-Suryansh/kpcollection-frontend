import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import decodeToken from "../utils/decodeToken";
import Header from "../features/navigation/header";

const Cart = () => {
  const token = Cookies.get("token");
  const decoded = decodeToken(token);
  const userId = decoded.id;
  const [user, setUser] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/cart/getcart/${userId}`
      );
      setUser(response.data.user);
    };
    fetchCart();
  }, [user]);

  useEffect(() => {
    if (user && user.cart) {
      const discount = user.cart.reduce((acc, item) => acc + item.product.discount * item.quantity, 0);
      setTotalDiscount(discount);
      const amount =
        user.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) - discount + 20;
      setTotalAmount(amount);
    }
  }, [user]);

  const removeFromCart = async (itemId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/cart/removefromcart/${itemId}`,
        { userId }
      );
      if (response.status === 200) {
        setMessage("Product removed from cart");
        setUser((prevUser) => {
          const updatedCart = prevUser.cart.filter((item) => item.productId !== itemId);
          console.log("Updated Cart:", updatedCart);
          return {
            ...prevUser,
            cart: updatedCart,
          };
        });
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { totalAmount: totalAmount } });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-20">
        {/* Notification Message */}
        {message && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 p-3 z-50 
            bg-black text-white rounded-lg shadow-lg">
            {message}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-medium mb-8">Shopping Cart</h1>

          {!user || !user.cart || user.cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-6">Your cart is empty</p>
              <Link 
                to="/shop" 
                className="inline-block border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-colors"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Cart Items */}
              <div className="col-span-8">
                {user.cart.map((item, index) => (
                  <div 
                    key={item.productId}
                    className="flex gap-6 py-6 border-b"
                  >
                    {/* Product Image */}
                    <div className="w-32 aspect-[3/4]">
                      <Link to={`/product/${item.product._id}`}>
                        <img
                          src={`data:image/jpg;base64,${Buffer.from(item.product.images[0].data).toString("base64")}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between mb-4">
                        <Link to={`/product/${item.product._id}`}>
                          <h3 className="font-medium">{item.product.name.toUpperCase()}</h3>
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-gray-400 hover:text-black"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span>Price: INR {item.product.price} x {item.quantity}</span>
                          {item.product.discount > 0 && (
                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                              {Math.round((item.product.discount / item.product.price) * 100)}% OFF
                            </span>
                          )}
                        </div>
                        {item.product.discount > 0 && (
                          <p className="text-gray-600">
                            Discount: INR {item.product.discount * item.quantity}
                          </p>
                        )}
                        <p className="text-gray-600">
                          Size: {item.size}
                        </p>
                        <p className="text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="col-span-8 md:col-span-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-medium mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span>Order Total</span>
                      <span>INR {user.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>- INR {totalDiscount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee</span>
                      <span>INR 20</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between font-medium text-base">
                        <span>Total Amount</span>
                        <span>INR {totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-4 mt-6 hover:bg-gray-900 transition-colors"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;