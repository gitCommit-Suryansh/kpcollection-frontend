import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCcw,
  Package,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrdersDashboard = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/order/allorders`
        );
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  console.log(orders)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount) => {
    return (amount / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userDetails.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.userDetails.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (paymentcode) => {
    switch (paymentcode.toLowerCase()) {
      case "completed":
        return `bg-green-600`;
      case "pending":
        return "bg-yellow-600";
      case "failed":
        return "bg-red-600";
      default:
        return "bg-red-600";
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/order/allorders`
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/order/updateStatus`,
        { orderId, status: newStatus }
      );
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        console.log(response.data.message)
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="w-full p-2 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-2xl font-bold text-gray-900">
              Manage Orders
            </h1>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isLoading}
            >
              <RefreshCcw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID, Email, or Customer Name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="hidden sm:table-header-group">
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-left font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Created At
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Customer
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Status
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Amount
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Payment Status
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Change Status
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  {/* Mobile Order Card */}
                  <tr className="sm:hidden block p-4 border-b border-gray-200 hover:bg-gray-50">
                    <div
                      className="space-y-3 cursor-pointer"
                      onClick={() =>
                        setSelectedOrderId(
                          selectedOrderId === order._id ? null : order._id
                        )
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">
                            {order.userDetails.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.userDetails.email}
                          </p>
                        </div>

                        <div className="flex gap-2 justify-center items-center">
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${getPaymentColor(
                              order.paymentDetails.code
                            )}`}
                          ></span>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                      <div className=" flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Order ID: {order._id}
                        </span>
                        <span className="font-medium">
                          {formatAmount(order.paymentDetails.data.amount)}
                        </span>
                      </div>
                      <div className=" flex justify-between items-center text-sm">
                        <div className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="p-4">
                          <select
                            value={order.orderStatus} // This sets the default selected value
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)} // Updates the state on change
                            className="border border-gray-300 rounded-md p-1"
                          >
                            <option value="Processing">Processing</option>
                        <option value="PENDING">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="FAILED">Failed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </tr>

                  {/* Desktop Order Row */}
                  <tr
                    className="hidden sm:table-row border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() =>
                      setSelectedOrderId(
                        selectedOrderId === order._id ? null : order._id
                      )
                    }
                  >
                    <td className="p-4 text-gray-800 font-medium">
                      {order._id}
                    </td>
                    <td className="p-4 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-gray-800">
                          {order.userDetails.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {order.userDetails.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-gray-800 font-medium">
                      {formatAmount(order.paymentDetails.data.amount)}
                    </td>
                    <td className="p-4 flex items-center justify-center">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${getPaymentColor(
                          order.paymentDetails.code
                        )}`}
                      ></span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border border-gray-300 rounded-md p-1"
                      >
                        <option value="Processing">Processing</option>
                        <option value="PENDING">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="FAILED">Failed</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {selectedOrderId === order._id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Details Section */}
                  {selectedOrderId === order._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Customer & Payment Info Column */}
                          <div className="space-y-6">
                            {/* Customer Details Card */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h3 className="font-semibold text-gray-800 mb-4">
                                Customer Details
                              </h3>
                              <div className="space-y-2 text-sm">
                                <p className="flex justify-between">
                                  <span className="text-gray-600">Name:</span>
                                  <span className="font-medium">
                                    {order.userDetails.name}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-600">Email:</span>
                                  <span className="font-medium">
                                    {order.userDetails.email}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-600">Mobile:</span>
                                  <span className="font-medium">
                                    {order.userDetails.mobileNumber}
                                  </span>
                                </p>
                                <div className="pt-2 border-t border-gray-200 mt-2">
                                  <p className="text-gray-600 mb-1">
                                    Shipping Address:
                                  </p>
                                  <p className="font-medium">
                                    {order.userDetails.address.street},<br />
                                    {order.userDetails.address.city},{" "}
                                    {order.userDetails.address.state},<br />
                                    {order.userDetails.address.postalCode}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Payment Details Card */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h3 className="font-semibold text-gray-800 mb-4">
                                Payment Details
                              </h3>
                              <div className="space-y-2 text-sm">
                                <p className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className="font-medium">
                                    {order.paymentDetails.code}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-600">
                                    Transaction ID:
                                  </span>
                                  <span className="font-medium">
                                    {order.paymentDetails.data.paymentDetails[0].transactionId}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-600">Amount:</span>
                                  <span className="font-medium">
                                    {formatAmount(
                                      order.paymentDetails.data.amount
                                    )}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-600">
                                    Payment Method:
                                  </span>
                                  <span className="font-medium">
                                    {
                                      order.paymentDetails.data.paymentDetails[0].paymentMode
                                    }
                                  </span>
                                </p>
                                
                              </div>
                            </div>
                          </div>

                          {/* Products Column */}
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-4">
                              Products
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {order.productDetails.map((product) => (
                                <Link
                                  to={`/product/${product.productId}`}
                                  key={product._id}
                                >
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                      <Package className="w-8 h-8 text-blue-500" />
                                      <div>
                                        <h4 className="font-medium text-gray-800">
                                          Product ID
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                          {product.productId}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div className="bg-gray-50 p-2 rounded">
                                        <p className="text-gray-600">Size</p>
                                        <p className="font-medium">
                                          {product.size}
                                        </p>
                                      </div>
                                      <div className="bg-gray-50 p-2 rounded">
                                        <p className="text-gray-600">
                                          Quantity
                                        </p>
                                        <p className="font-medium">
                                          {product.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersDashboard;
