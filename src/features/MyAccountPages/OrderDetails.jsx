import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../navigation/header";
import { Link } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (loading)
    return (
      <div className="text-lg text-gray-600">Loading order details...</div>
    );
  if (error) return <div className="text-lg text-red-600">Error: {error}</div>;
  if (!orderDetails)
    return <div className="text-lg text-gray-600">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col md:flex-row justify-center items-start pt-16">
        <div className="w-full md:w-3/5 xl:w-2/3 p-4 md:p-6 lg:p-12">
          <h2 className="text-3xl font-bold mb-4">Order Items</h2>
          <div className="first-div flex flex-col overflow-auto">
            {orderDetails.products.map((product, index) => (
               <div
               key={index}
               className="prods w-[59vw] h-[28vh] bg-zinc-100 flex gap-10 p-3 mb-8 relative"
             >
               <div className="w-[13vw] box-border rounded-md overflow-hidden">
                 <div className="w-full h-full flex justify-center align-center">
                   {product.productId.images && product.productId.images.length > 0 && (
                     <img
                       className="w-full h-full object-fit" src={`data:image/jpg;base64,${Buffer.from(product.productId.images[0].data).toString("base64")}`}
                       alt=""
                     />
                   )}
                 </div>
               </div>
               <div>
                 <div className="w-[40vw] h-full flex flex-col justify-between px-5 gap-4 py-4">
                   <div className="flex flex-col gap-3">
                     <Link to={`/product/${product.productId._id}`}>
                       <h3 className="text-lg text-zinc-800">{product.productId.name}</h3>
                     </Link>
                    
                   </div>
                   <div className="flex flex-col gap-1">
                     <div className="flex gap-3 align-center h-full">
                       <h1 className="text-[1.1rem]">
                         <span className="text-blue-900 font-semibold">
                           Price
                         </span>
                         : ₹ {product.productId.price}
                       </h1>
                       <h3 className="px-2 bg-blue-700 text-white inline-block rounded-xl flex justify-center align-center mt-[1.5px] text-[1rem] scale-90">
                         {parseFloat(
                           ((product.productId.discount / product.productId.price) * 100).toFixed(1)
                         )}
                         % off
                       </h3>
                     </div>
                     {product.productId.discount !== 0 && (
                       <h1 className="text-[1rem]">
                         <span className="text-orange-500 font-semibold">
                           Discount
                         </span>
                         : ₹ {product.productId.discount}
                       </h1>
                     )}
                   </div>
                 </div>
               </div>
               {/* <div>
                 <a onClick={() => removeFromCart(product.productId._id)}>
                   <i className="fa-solid fa-xmark absolute right-4 top-4"></i>
                 </a>
               </div> */}
             </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-2/5 xl:w-1/3 p-4 md:p-6 lg:p-12">
          <h2 className="text-3xl font-bold mb-4">Order Summary</h2>
          <p className="text-lg text-gray-600">Order ID: {orderDetails._id}</p>
          <p className="text-lg text-gray-600">
            Order Date: {new Date(orderDetails.orderDate).toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-600">
            Total Amount: ₹{orderDetails.totalAmount}
          </p>
          <h3 className="text-2xl font-bold mb-4">Shipping Address:</h3>
          <p className="text-lg text-gray-600">
            {orderDetails.shippingAddress.street},{" "}
            {orderDetails.shippingAddress.city},{" "}
            {orderDetails.shippingAddress.state} -{" "}
            {orderDetails.shippingAddress.postalCode}
          </p>
          <h3 className="text-2xl font-bold mb-4">Payment Details:</h3>
          <p className="text-lg text-gray-600">
            Method: {orderDetails.paymentMethod}
          </p>
          <p className="text-lg text-gray-600">
            Status: {orderDetails.paymentStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
