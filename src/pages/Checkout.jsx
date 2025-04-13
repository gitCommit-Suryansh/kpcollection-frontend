import React, { useState, useEffect } from "react";
import Header from "../features/navigation/header";
import Cookies from "js-cookie";
import decodeToken from "../utils/decodeToken";
import axios from "axios";
import { useLocation, useNavigate ,useSearchParams} from "react-router-dom";
import CryptoJS from 'crypto-js';
import { FaExclamationTriangle } from 'react-icons/fa';


const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentDetails, setpaymentDetails] = useState();
  const [user, setUser] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  
  const token = Cookies.get("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.id;

  const [searchParams] = useSearchParams();
  const merchantOrderId = searchParams.get('merchantOrderId');

  useEffect(() => {
    if (location.state && location.state.totalAmount) {
      // Case: Navigated from Cart.jsx
      setTotalAmount(location.state.totalAmount);
    }
  }, [location.state]); // Run this effect when location.state changes

  useEffect(() => {
    if (merchantOrderId) {
      checkPaymentStatus();
    }
  }, [merchantOrderId]);

  const callback = (response) => {
    switch (response) {
      case 'USER_CANCEL':
        // Add merchant's logic if they have any custom thing to trigger on UI after the transaction is cancelled by the user
        break;
      case 'CONCLUDED':
        // Add merchant's logic if they have any custom thing to trigger on UI after the transaction is in terminal state
        break;
      default:
        console.log('Unknown response received:', response);
    }
  };



  useEffect(() => {
    if (user && user.cart && paymentDetails) {
      if (isCreatingOrder) return;

      setIsCreatingOrder(true);

      const userDetails = {
        userId: decodedToken.id,
        email: decodedToken.email,
        name: decodedToken.name,
        mobileNumber: user.mobileNumber,
        address: user.address,
      };

      const productDetails = user.cart.map(item => ({
        productId: item.product._id,
        size: item.size,       
        quantity: item.quantity 
      }));

      const paymentDetailsObject = paymentDetails;

      const orderDetails = {
        userDetails,
        productDetails,
        paymentDetails: paymentDetailsObject,
      };

      const createOrder = async () => {
        try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/order/createorder`, orderDetails);
          console.log("Order created successfully:", response.data);
          
          if (response.data.order.paymentDetails.code === "COMPLETED") {
            navigate("/payment/success", { state: { orderId: response.data.order._id } });
          }
          if (response.data.order.paymentDetails.code !== "COMPLETED") {
            navigate("/payment/failure", { state: { orderId: response.data.order._id } });
          }
          
        } catch (error) {
          console.error("Error creating order:", error);
        } finally {
          setIsCreatingOrder(false);
        }
      };

      createOrder();
    }
  }, [user, paymentDetails]);
  

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/phonepe/check-payment-status`, {
        merchantOrderId: merchantOrderId
      });

      if (response.data.status.state === "COMPLETED") {
        setPaymentStatus("success");
        setpaymentDetails(response.data.status)
        console.log(response.data.status)
      } else if(response.data.status.state==='PENDING') {
        setPaymentStatus("pending");
        setpaymentDetails(response.data.status)
        console.log(response.data.status)
      } else {
        setPaymentStatus("failed");
        setpaymentDetails(response.data.status)
        console.log(response.data.status)
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus("error");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/cart/getcart/${userId}`
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [userId]);


  const handlePayment = async () => {
    console.log("Payment button clicked");
    const paymentData = {
      amount: totalAmount * 100,
      mobileNumber: user.mobileNumber,
      userId: user._id,
    };
    
    console.log("Data being sent to backend:", paymentData);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/phonepe/pay`,
        paymentData
      );
      if (response.status === 200) {
        console.log(response.data)
        const tokenUrl=response.data.redirectUrl
        window.PhonePeCheckout.transact({ tokenUrl });  
        // window.PhonePeCheckout.transact({ tokenUrl, callback, type: "IFRAME" });


      } else {
        throw new Error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert("Failed to create order. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <Header />
      {user && (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
          {/* New Section - Cart Items */}
          <div className="md:w-2/3 bg-zinc-50 p-8 md:p-16">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-zinc-800 mb-4">Your Cart Items</h2>
              {user.cart && user.cart.length > 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                  {user.cart.map((item) => (
                    <div key={item.productId} className="flex justify-between mb-4 border-b pb-2">
                      <span className="font-medium">{item.product.name} ({item.size})</span>
                      <span>INR {item.product.price} x {item.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600">Your cart is empty.</p>
              )}

              <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-zinc-800">
                    Delivery Address
                  </h2>
                  
                </div>
                <div className="space-y-2 text-zinc-600">
                  <p className="font-medium text-zinc-900">{user.name}</p>
                  <p>{user.address.street}</p>
                  <p>{user.address.city}</p>
                  <p>
                    {user.address.state} {user.address.postalCode}
                  </p>
                </div>
                
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="md:w-1/3 bg-white p-8 md:p-16 border-l border-zinc-100">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Items Total</span>
                  <span className="font-medium">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Delivery</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Promotion Applied</span>
                  <span className="font-medium">--</span>
                </div>
                <div className="h-px bg-zinc-200 my-4"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Order Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-zinc-900 text-white py-4 rounded-lg hover:bg-zinc-800 transition-colors duration-300 font-medium"
              >
                Proceed to Payment
              </button>

              <p className="text-sm text-zinc-500 mt-4 text-center">
                <button className="hover:underline">
                  How are delivery costs calculated?
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
