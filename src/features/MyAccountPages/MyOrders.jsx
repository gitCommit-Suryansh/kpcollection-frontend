import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import decodeToken from "../../utils/decodeToken";
import Header from "../navigation/header";
import axios from "axios";
import { Calendar, Package, ArrowRight } from "lucide-react";

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

  const bufferToImage = (buffer) => {
    if (!buffer || !buffer.data) return '';
    try {
      return `data:image/jpeg;base64,${Buffer.from(buffer.data).toString('base64')}`;
    } catch (error) {
      console.error("Error converting image:", error);
      return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-500"></div>
            <div className="animate-pulse text-zinc-500 pl-3">Loading...</div>
          </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12 mt-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-light">Orders</h1>
          <Link 
            to="/shop"
            className="text-blue-600 hover:text-blue-800 transition flex items-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-light text-gray-600 mb-4">No orders yet</h2>
            <Link 
              to="/shop"
              className="inline-block px-8 py-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition rounded-full"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <Link 
                key={order._id}
                to={`/myaccount/myorders/${order._id}`}
                className="block group"
              >
                <div className="border border-gray-100 rounded-lg p-6 hover:shadow-lg transition duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Order ID: {order._id}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-1.5 rounded-full text-sm ${
                        order.paymentDetails.success
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {order.paymentDetails.message}
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex items-center">
                      {order.productDetails.slice(0, 3).map((product, index) => (
                        <div 
                          key={index} 
                          className="first:ml-0 -ml-6 relative group-hover:translate-x-0 transition-transform duration-300"
                          style={{ transform: `translateX(-${index * 8}px)` }}
                        >
                          <img
                            src={bufferToImage(product.productId.images[0])}
                            alt={product.productId.name}
                            className="w-20 h-20 rounded-lg object-cover border-2 border-white"
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      ))}
                      {order.productDetails.length > 3 && (
                        <div 
                          className="w-20 h-20 -ml-6 rounded-lg bg-gray-50 flex items-center justify-center border-2 border-white relative group-hover:translate-x-0 transition-transform duration-300"
                          style={{ transform: `translateX(-${3 * 8}px)` }}
                        >
                          <span className="text-gray-500 font-medium">+{order.productDetails.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">{order.productDetails.length} items</p>
                        <p className="text-2xl font-light">₹{(order.paymentDetails.data.amount/100).toLocaleString()}</p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-blue-600 group-hover:transform group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;