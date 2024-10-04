import React from "react";
import decodeToken from "../utils/decodeToken";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../features/navigation/header";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const token = Cookies.get("token");
  const decoded = decodeToken(token);
  const userId = decoded.id;
  const [user, setUser] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/cart/getcart/${userId}`
      );
      setUser(response.data.user);
    };
    fetchCart();
  }, [userId]);

  useEffect(() => {
    if (user && user.cart) {
      const discount = user.cart.reduce((acc, item) => acc + item.discount, 0);
      setTotalDiscount(discount);
      const amount =
        user.cart.reduce((acc, item) => acc + item.price, 0) - discount + 20;
      setTotalAmount(amount);
    }
  }, [user]);

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/cart/removefromcart/${productId}`,
        { userId }
      );
      if (response.status === 200) {
        setSuccess("Product removed from cart");
        // Update the user's cart in real-time
        setUser((prevUser) => ({
          ...prevUser,
          cart: prevUser.cart.filter((item) => item._id !== productId),
        }));
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };
  success && setTimeout(() => setSuccess(""), 3000);

  const handleCheckout = () => {
    navigate('/checkout', { state: { totalAmount: totalAmount } });
  };

  return (
    <>
      <Header />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
      />
      <style>
        {`
        .error-message {
          height: 100vh !important;
        }

        @media (max-width: 1024px) {
          .main-div {
            flex-direction: column !important;
            padding: 0 !important;
          }
          .second-div {
            padding: 8px;
            height: 0 !important;
            width: auto !important;
            position: static !important;
            margin-top: 0 !important;
          }
          .first-div {
            height: 5vh !important;
            margin-top: 10vh !important;
          }
          .prods {
            width: auto !important;
            height: auto !important;
            gap: 0 !important;
            position: static !important;
          }
        }
      `}
      </style>

      {/* Success Message */}
      {success && success.length > 0 && (
        <div
          className={`absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-md ${
            success === "Product added to cart" ? "bg-blue-500" : "bg-red-500"
          }`}
        >
          <span className="inline-block mt-1 mb-1 text-white">{success}</span>
        </div>
      )}

      <div className="main-div w-full h-screen flex px-20 pt-24 gap-8">
        <div className="first-div flex flex-col overflow-auto">
          {/* Cart is Empty */}
          {!user || !user.cart || user.cart.length === 0 ? (
            <div className="error-message w-full flex pl-[27vw] mt-24">
              No Items In Your Cart.
            </div>
          ) : (
            user.cart.map((item, index) => (
              <div
                key={index}
                className="prods w-[59vw] h-[28vh] bg-zinc-100 flex gap-10 p-3 mb-8 relative"
              >
                <div className="w-[13vw] box-border rounded-md overflow-hidden">
                  <div className="w-full h-full flex justify-center align-center">
                    {item.images && item.images.length > 0 && (
                      <img
                        className="w-full h-full object-fit"
                        src={`data:image/jpeg;base64,${btoa(
                          String.fromCharCode.apply(
                            null,
                            new Uint8Array(item.images[0].data)
                          )
                        )}`}
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <div>
                  <div className="w-[40vw] h-full flex flex-col justify-between px-5 gap-4 py-4">
                    <div className="flex flex-col gap-3">
                      <Link to={`/product/${item._id}`}>
                        <h3 className="text-lg text-zinc-800">{item.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2">
                        <i className="w-7 h-7 bg-white flex rounded-full items-center justify-center ri-add-line"></i>
                        <div className="px-2 py-1 rounded-md bg-white text-black">
                          01
                        </div>
                        <i className="w-7 h-7 bg-white flex rounded-full items-center justify-center ri-subtract-line"></i>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-3 align-center h-full">
                        <h1 className="text-[1.1rem]">
                          <span className="text-blue-900 font-semibold">
                            Price
                          </span>
                          : ₹ {item.price}
                        </h1>
                        <h3 className="px-2 bg-blue-700 text-white inline-block rounded-xl flex justify-center align-center mt-[1.5px] text-[1rem] scale-90">
                          {parseFloat(
                            ((item.discount / item.price) * 100).toFixed(1)
                          )}
                          % off
                        </h3>
                      </div>
                      {item.discount !== 0 && (
                        <h1 className="text-[1rem]">
                          <span className="text-blue-900 font-semibold">
                            Discount
                          </span>
                          : ₹ {item.discount}
                        </h1>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <a onClick={() => removeFromCart(item._id)}>
                    <i className="fa-solid fa-xmark absolute right-4 top-4"></i>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="second-div w-1/4 h-screen fixed right-8 top-4 bg-white mt-20">
          <h3 className="text-2xl font-semibold text-[#212121] border-b-2 border-[#212121] pb-3">
            Order Summary
          </h3>
          <div className="px-5 mt-5">
            <div className="flex mt-2 w-full justify-between">
              <h4 className="w-1/3">Order Total</h4>
              <h4>
                ₹{" "}
                {user && user.cart
                  ? user.cart.reduce((acc, item) => acc + item.price, 0)
                  : 0}
              </h4>
            </div>
            <div className="flex mt-2 w-full justify-between">
              <h4 className="">Overall Discount</h4>
              <h4>₹ {totalDiscount}</h4>
            </div>
            <div className="flex mt-2 w-full justify-between">
              <h4 className="w-1/3">Platform Fee</h4>
              <h4>₹ 20</h4>
            </div>
            <div className="flex mt-2 w-full justify-between">
              <h4 className="w-1/3">Shipping Fee</h4>
              <h4>FREE</h4>
            </div>
          </div>
          <div className="w-full h-[1px] bg-black mt-10"></div>
          <div className="flex mt-5 w-full justify-between">
            <h3 className="text-2xl">
              <span className="font-semibold">Order </span>Total
            </h3>
            <h3 className="font-semibold text-xl text-green-600">
              ₹ {totalAmount}
            </h3>
          </div>
          <div className="bg-yellow-500 w-full h-[7vh] mt-4 rounded-md overflow-hidden">
            <button onClick={handleCheckout} className="w-full h-full">
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-semibold text-[#212121]">
                  Proceed To Checkout
                </h1>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
