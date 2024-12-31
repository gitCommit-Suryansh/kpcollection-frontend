import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Header from "../navigation/header";

const OrderDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSummaryTab, setActiveSummaryTab] = useState('products');

  const bufferToImage = (buffer) => {
    if (!buffer || !buffer.data) return "";
    try {
      return `data:image/jpeg;base64,${Buffer.from(buffer.data).toString("base64")}`;
    } catch (error) {
      console.error("Error converting image:", error);
      return "";
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/order/getorderbyid/${id}`
        );
        setOrderDetails(response.data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const renderPaymentDetails = (paymentDetails) => {
    const { data, code } = paymentDetails;
    const { paymentInstrument } = data;

    const commonDetails = [
      {
        label: "Transaction ID",
        value: data.transactionId
      },
      {
        label: "Payment Mode",
        value: paymentInstrument.type
      },
      {
        label: "Payment Stage",
        value: data.state
      },
      {
        label: "Payment Status",
        value: code
      }
    ];

    const cardSpecificDetails = paymentInstrument.type === "CARD" ? [
      {
        label: "Card Type",
        value: paymentInstrument.cardType
      },
      {
        label: "BRN",
        value: paymentInstrument.brn
      }
    ] : [];

    const upiSpecificDetails = paymentInstrument.type === "UPI" ? [
      {
        label: "UTR",
        value: paymentInstrument.utr
      },
      {
        label: "Account Holder",
        value: paymentInstrument.accountHolderName
      }
    ] : [];

    const allDetails = [...commonDetails, ...(paymentInstrument.type === "CARD" ? cardSpecificDetails : upiSpecificDetails)];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {allDetails.map((detail, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">{detail.label}</p>
            <p className="font-medium text-gray-800 break-words">{detail.value || "N/A"}</p>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-500"></div>
            <div className="animate-pulse text-zinc-500 pl-3">Loading...</div>
          </div>
  );

  if (error || !orderDetails) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-600 bg-red-50 p-4 rounded-lg">
        {error || "Order not found"}
      </div>
    </div>
  );

  const { paymentDetails, productDetails, userDetails, createdAt } = orderDetails;
  const orderStatus = orderDetails.orderStatus;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
              <p className="text-gray-500 mt-1">Order #{id}</p>
              <p className="text-sm text-gray-500">
                Placed on {new Date(createdAt).toLocaleString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-center">
              <span className={`inline-flex items-center px-4 py-2 rounded-full 
               ${
                orderStatus === "Processing" ? "bg-yellow-400 text-black" : 
                orderStatus === "Shipped" ? "bg-blue-400 text-white" : 
                orderStatus === "Completed" ? "bg-green-500 text-white" : 
                orderStatus === "FAILED" ? "bg-red-600 text-white" : 
                "bg-gray-100 text-gray-800"
              }`}>
                {orderStatus}
              </span>
              <p className="mt-2 text-lg font-semibold">
                Total: ₹{paymentDetails.data.amount / 100}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Products & Payment */}
          <div className="lg:w-2/3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="flex border-b">
                <button
                  className={`flex-1 px-6 py-3 text-center ${
                    activeSummaryTab === 'products' 
                      ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveSummaryTab('products')}
                >
                  Products
                </button>
                <button
                  className={`flex-1 px-6 py-3 text-center ${
                    activeSummaryTab === 'payment'
                      ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveSummaryTab('payment')}
                >
                  Payment Details
                </button>
              </div>

              <div className="p-6">
                {activeSummaryTab === 'products' ? (
                  <div className="space-y-4">
                    {productDetails.map((product, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={bufferToImage(product.productId.images[0])}
                          alt={product.productId.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <Link to={`/product/${product.productId._id}`}><h3 className="font-medium text-gray-800">{product.productId.name}</h3></Link>
                          <p className="text-sm text-gray-600 mt-1">{product.productId.description}</p>
                          <div className="mt-2 flex flex-wrap gap-4">
                            <span className="text-sm text-gray-600">Size: {product.size}</span>
                            <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
                            <span className="text-sm font-medium text-gray-800">₹{product.productId.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {renderPaymentDetails(paymentDetails)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Delivery Details */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <p className="font-medium text-gray-800">{userDetails.name}</p>
                  <p className="text-gray-600">{userDetails.mobileNumber}</p>
                  <p className="text-gray-600">{userDetails.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-2">Shipping Address</p>
                  <p className="text-gray-600">{userDetails.address.street}</p>
                  <p className="text-gray-600">{userDetails.address.city}</p>
                  <p className="text-gray-600">PIN: {userDetails.address.postalCode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;