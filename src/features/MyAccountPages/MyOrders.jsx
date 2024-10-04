import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import decodeToken from "../../utils/decodeToken";
import Header from "../navigation/header";
const MyOrders = () => {
  const token = Cookies.get("token");
  const decoded = decodeToken(token);
  const userId = decoded.id;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/order/getorders/${userId}`
        );
        const data = await response.json();
        if (data.orders) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-4 mt-[12vh]">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
              <p className="text-lg font-bold text-gray-800 mt-4">
                No orders found.
              </p>
              <p className="text-gray-600">
                You haven't placed any orders yet.
              </p>
              <Link
                to="/products"
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order, index) => (
              <div key={index} className="bg-white rounded-lg flex shadow-md p-4">
                <div className="flex w-[26%] overflow-x-auto mr-4">
                  {order.products.length > 0 && order.products.map((product, index) => 
                    product.productId.images.length > 0 && (
                      <img key={index} src={`data:image/jpeg;base64,${btoa(
                              String.fromCharCode.apply(
                                null,
                                new Uint8Array(product.productId.images[0].data)
                              )
                            )}`} alt="Error loading image" className="w-[10vw] h-[10vw]" />
                    )
                  )}
                </div>
                
                <div className="w-[70%]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Order #{order._id}
                    </h3>
                    <p className="text-gray-600 text-sm font-semibold">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600 text-lg font-semibold">
                      Order Total: ₹{order.totalAmount}
                    </p>
                    <p className="text-gray-600">
                      Status:{" "}
                      <span className="font-bold text-orange-500">
                        {order.orderStatus}
                      </span>
                    </p>
                  </div>
                  <Link
                    to={`/myaccount/myorders/${order._id}`}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View Order Details
                  </Link>
                  <div className="text-gray-400 text-sm font-semibold mt-4">
                    {order.products.length} product In this Order
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
