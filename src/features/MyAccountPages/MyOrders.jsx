import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import decodeToken from "../../utils/decodeToken";
import Header from "../navigation/header";
import axios from "axios";

const MyOrders = () => {
  const token = Cookies.get("token");
  const decoded = decodeToken(token);
  const userId = decoded.id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/order/getorders/${userId}`);
        if (response.data) {
          setOrders(response.data.orders);
          console.log(response.data.orders)
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
      
    };
    fetchOrders();
  }, [userId]);


  // Function to convert Buffer to base64 image
  const bufferToImage = (buffer) => {
    if (!buffer || !buffer.data) return '';
    try {
      return `data:image/jpeg;base64,${Buffer.from(buffer.data).toString('base64')}`;
    } catch (error) {
      console.error("Error converting image:", error);
      return '';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <div className="animate-pulse text-blue-500 pl-3">Loading...</div>
    </div>
  );


  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No orders found</p>
            <Link to="/shop" className="text-blue-500 hover:underline mt-2 inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
             <Link to={`/myaccount/myorders/${order._id}`}>
               <div
                key={order._id}
                className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
              >
                {/* Product Images */}
                <div className="flex -space-x-4 overflow-hidden mb-4">
                  {order.productDetails.slice(0, 3).map((product, index) => (
                    <img
                      key={index}
                      src={bufferToImage(product.productId.images[0])}
                      alt={product.productId.name}
                      className="w-16 h-16 object-cover border rounded-full"
                      onError={(e) => {
                        e.target.src = 'placeholder-image-url';
                        e.target.onerror = null;
                      }}
                    />
                  ))}
                  {order.productDetails.length > 3 && (
                    <div className="w-16 h-16 bg-gray-200 text-gray-600 flex items-center justify-center rounded-full">
                      +{order.productDetails.length - 3}
                    </div>
                  )}
                </div>

                {/* Order Details */}
                <div>
                  <p className="text-gray-600 text-sm">Order ID</p>
                  <p className="font-mono text-sm mb-2">{order._id}</p>
                  <p className="text-sm text-gray-600 mb-1">Date: {formatDate(order.createdAt)}</p>
                  <p className="text-sm text-gray-600 mb-1">Quantity: {order.productDetails.length}</p>
                  <p className="text-sm text-gray-600 mb-1">Total: ₹{order.paymentDetails.data.amount/100}</p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      order.paymentDetails.success
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.paymentDetails.message}
                  </span>
                </div>
              </div>
             </Link>
            ))}
          </div>
        )}

        
      </div>
    </>
  );
};

export default MyOrders;
