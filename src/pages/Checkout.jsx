import React, { useState, useEffect } from "react";
import Header from "../features/navigation/header";
import Cookies from "js-cookie";
import decodeToken from "../utils/decodeToken";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = "PhonepeEncryptionKey".padEnd(32, '0');

function decrypt(text) {
  const parts = text.split(':');
  const iv = CryptoJS.enc.Hex.parse(parts[0]);
  const encryptedText = CryptoJS.enc.Hex.parse(parts[1]);

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encryptedText },
    CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY),
    { iv: iv }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentDetails, setpaymentDetails] = useState();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentDetailsQuery = queryParams.get("paymentDetails");

    if (location.state && location.state.totalAmount) {
          // Case: Navigated from Cart.jsx
          setTotalAmount(location.state.totalAmount);
    }

    // Check for paymentDetails in query parameters
    if (paymentDetailsQuery) {
          const decryptedData = decrypt(decodeURIComponent(paymentDetailsQuery));
          const paymentDetails = JSON.parse(decryptedData);
          setpaymentDetails(paymentDetails);
          setTotalAmount(paymentDetails.data.amount / 100);
    }
  }, []);
  console.log(paymentDetails)

  const token = Cookies.get("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.id;

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
    console.log("clicked");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/phonepe/pay`,
        {
          amount: totalAmount * 100,
          mobileNumber: user.mobileNumber,
          userId: user._id,
        }
      );
      if (response.status === 200) {
        window.location.assign(response.data.url);
        console.log(response.data);
      } else {
        throw new Error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {user && (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
          {/* Left Side - Order Details */}
          <div className="md:w-2/3 bg-zinc-50 p-8 md:p-16">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-zinc-900 mb-8">
                Checkout
              </h1>

              {/* Delivery Address Section */}
              <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-zinc-800">
                    Delivery Address
                  </h2>
                  <button className="text-zinc-900 text-sm hover:underline">
                    Change
                  </button>
                </div>
                <div className="space-y-2 text-zinc-600">
                  <p className="font-medium text-zinc-900">{user.name}</p>
                  <p>{user.address.street}</p>
                  <p>{user.address.city}</p>
                  <p>
                    {user.address.state} {user.address.postalCode}
                  </p>
                </div>
                <button className="text-zinc-900 text-sm mt-4 hover:underline">
                  Add delivery instructions
                </button>
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
