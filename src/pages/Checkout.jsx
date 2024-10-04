import React, { useState, useEffect } from "react";
import Header from "../features/navigation/header";
import Cookies from "js-cookie";
import decodeToken from "../utils/decodeToken";
import axios from "axios";
import cc from "../assets/images/cc.png";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (location.state && location.state.totalAmount) {
      setTotalAmount(location.state.totalAmount);
    }
  }, [location.state]);

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
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    try {
      const order = {
        userId: user._id,
        username: user.name,
        products: user.cart.map(item => ({
          productId: item._id,
          quantity: 1,
          price: item.price
        })),
        totalAmount: totalAmount,
        shippingAddress: user.address,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Completed",
        orderStatus: "Processing"
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/order/createorder`, {order});
      
      if (response.status === 200) {
        navigate('/orderconfirmed', { state: { order: response.data.order } });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // const submitOrderId = async(orderId) => {
  //   const orderidsubmit=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/order/updateorder/${orderId}`,user)
  //   if(orderidsubmit.status===200){
  //     console.log("succefull hogya bhai")
  //   }
  //   else{
  //     console.log("kuch to gadbad hai")
  //   }
  // }

  return (
    <>
      <Header />
      {user && (
        <div className="py-10 px-24 flex mt-20">
          <div className="w-2/3">
            <div className="mb-4">
              <h1 className="text-xl font-bold">1. Delivery address</h1>
              <div className="ml-6">
                <p>{user.name}</p>
                <p>{user.address.street}</p>
                <p>{user.address.city}</p>
                <p>
                  {user.address.state} {user.address.postalCode}
                </p>
                <a href="#" className="text-teal-600">
                  Add delivery instructions
                </a>
              </div>
              <a href="#" className="text-teal-600 ml-6">
                Change
              </a>
            </div>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-orange-600">
                2. Select a payment method
              </h1>
              <div className="flex items-center border p-4 mb-4">
                <img
                  src={cc}
                  alt="Credit card image"
                  className="mr-4 w-[5.5vw] h-[5.5vw]"
                />
                <div>
                  <p>
                    Get credit card approval in 30 minutes. Get{" "}
                    <span className="font-bold">(Rs.23.37)</span>
                  </p>
                  <button className="bg-blue-400 text-white px-4 py-2 mt-2">
                    Apply Now
                  </button>
                </div>
              </div>
              <div className="border p-4 mb-4">
                <h2 className="text-lg font-bold">Your available balance</h2>
                <div className="flex items-center mb-2">
                  <input type="radio" name="payment" className="mr-2" />
                  <div>
                    <p> Balance ₹0.00 Unavailable</p>
                    <p className="text-sm text-gray-500">
                      Insufficient balance.{" "}
                      <a href="#" className="text-teal-600">
                        Add money & get rewarded
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter Code"
                    className="border p-2 mr-2"
                  />
                  <button className="bg-gray-200 text-gray-700 px-4 py-2">
                    Apply
                  </button>
                </div>
              </div>
              <div className="border p-4">
                <h2 className="text-lg font-bold">Another payment method</h2>
                <div className="flex items-center mb-2">
                  <input type="radio" name="payment" className="mr-2" value="Credit or debit card" onChange={handlePaymentMethodChange} />
                  <div>
                    <p>Credit or debit card</p>
                    <img
                      src={cc}
                      alt="Credit card logos"
                      className="w-[5.5vw] h-[5.5vw]"
                    />
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <input type="radio" name="payment" className="mr-2" value="Net Banking" onChange={handlePaymentMethodChange} />
                  <div>
                    <p>Net Banking</p>
                    <select className="border p-2">
                      <option>Choose an Option</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="payment" className="mr-2" value="Other UPI Apps" onChange={handlePaymentMethodChange} />
                  <div>
                    <p>Other UPI Apps</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="payment" className="mr-2" value="Cash on Delivery" onChange={handlePaymentMethodChange} />
                  <div>
                    <p>Cash on Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/3 ml-4">
            <div className="border p-4 bg-yellow-100 mb-4">
              <button className="bg-yellow-300 text-gray-700 px-4 py-2 mb-4">
                Use this payment method
              </button>
              <p>
                Choose a payment method to continue checking out. You will still
                have a chance to review and edit your order before it is final.
              </p>
            </div>
            <div className="border p-4">
              <h2 className="text-lg font-bold">Order Summary</h2>
              <p>Items: ₹{totalAmount}</p>
              <p>Total: --</p>
              <p>Promotion Applied: --</p>
              <h2 className="text-lg font-bold text-orange-600">
                Order Total: ₹{totalAmount}
              </h2>
              <a href="#" className="text-teal-600">
                How are delivery costs calculated?
              </a>
            </div>
            <div className="border pt-1">
              <button className="bg-orange-400 text-white font-bold px-4 py-2 w-full h-[6.5vh]" onClick={handlePayment}>
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
