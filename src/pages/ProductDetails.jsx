import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import decodeToken from "../utils/decodeToken";
import Header from "../features/navigation/header";
import { Link } from "react-router-dom";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productDets, setProductDets] = useState();
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [showReturnsInfo, setShowReturnsInfo] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const token = Cookies.get("token");
  const decodedToken = decodeToken(token);
  if(decodedToken){
    var userId = decodedToken.id;
  }

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/products/product/${id}`
        );
        if (response.status === 200) {
          setProductDets(response.data.product);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const addToWishlist = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/addtowishlist/${id}`,
        { userId }
      );
      if (response.status === 200) {
        setMessage("Product added to wishlist");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Error Adding product To Wishlist");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error Adding Item To Cart");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const addToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      setMessage("Please select a size.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/cart/addtocart/${id}`,
        { userId, selectedSize, quantity }
      );
      setMessage(
        response.status === 200
          ? "Product added to cart"
          : "Error Adding Item To Cart"
      );
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error Adding Item To Cart");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const capitalizeWords = (str) => {
    return str.toUpperCase();
  };

  if (!productDets)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-500"></div>
            <div className="animate-pulse text-zinc-500 pl-3">Loading...</div>
          </div>
    );

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-20">
        {message && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-[0.65rem] z-50 mt-16
            ${[message === "Product added to cart", message === "Product added to wishlist", message === "Please select a size"].includes(true) 
                ? "bg-green-500" 
                : "bg-red-500"
            } 
            text-white rounded-lg shadow-lg backdrop-blur-md bg-opacity-90`}
          >
            {message}
          </div>
        )}

        <div
          className={`grid ${
            window.innerWidth > 1024 ? "grid-cols-12" : "grid-cols-1"
          } gap-8`}
        >
          {/* Left Sidebar - Thumbnail Images */}
          {window.innerWidth > 1024 ? (
            <div className="col-span-1">
              <div className="space-y-2">
                {productDets.images.map((image, index) => (
                  <img
                    key={index}
                    src={`data:image/jpg;base64,${Buffer.from(
                      image.data
                    ).toString("base64")}`}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-full aspect-square object-cover cursor-pointer border
                ${
                  selectedImage === index ? "border-black" : "border-gray-200"
                }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* Main Image */}
          <div
            className={`col-span-1 ${
              window.innerWidth > 1024 ? "md:col-span-6" : ""
            }`}
          >
            <img
              src={`data:image/jpg;base64,${Buffer.from(
                productDets.images[selectedImage].data
              ).toString("base64")}`}
              alt="Main Product"
              className="w-full aspect-[3/4] object-cover"
            />
            <Link to={`/collection/${productDets.category}`}>
              <button className="mt-4 w-full py-2 border border-gray-300 text-gray-700">
                VIEW SIMILAR
              </button>
            </Link>
          </div>

          {/* Thumbnail Images for Mobile View */}
          {window.innerWidth <= 1024 && (
            <div className="flex overflow-x-auto space-x-2 mb-4">
              {productDets.images.map((image, index) => (
                <img
                  key={index}
                  src={`data:image/jpg;base64,${Buffer.from(
                    image.data
                  ).toString("base64")}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 aspect-square object-cover cursor-pointer border
                ${
                  selectedImage === index ? "border-black" : "border-gray-200"
                }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}

          {/* Product Details */}
          <div
            className={`col-span-1 ${
              window.innerWidth > 1024 ? "md:col-span-5" : ""
            }`}
          >
            <h1 className="text-xl font-medium mb-4">
              {capitalizeWords(productDets.name)}
            </h1>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  INR {productDets.price - productDets.discount}
                </span>
                <span className="text-gray-500 line-through text-sm">
                  INR {productDets.price}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">(incl. of all taxes)</p>
            </div>

            {/* Discount Offers */}
            <div className="space-y-2 mb-6">
              <div className="text-sm">
                <span className="text-gray-600">
                  Get this for INR {productDets.price - productDets.discount}
                </span>
                
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">SELECT A SIZE</span>
                <button className="text-sm underline">SIZE CHART</button>
              </div>
              <div className="flex gap-2">
                {productDets.sizes.map((size) => (
                  <button
                    key={size}
                    className={`w-12 h-12 border flex items-center justify-center text-sm hover:border-black 
                    ${
                      selectedSize === size
                        ? "border-2 border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <label htmlFor="quantity" className="text-sm font-medium">
                SELECT QUANTITY
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="mt-2 border border-gray-300 rounded p-2 ml-3"
              >
                {[1, 2, 3, 4, 5].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={addToWishlist}
                className="w-full py-3 border border-black text-black font-medium hover:bg-black hover:text-white transition-colors"
              >
                Add to Wishlist
              </button>
              <button
                onClick={addToCart}
                className="w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
              >
                ADD TO BAG
              </button>
            </div>

            {/* Accordion sections */}
            <div className="mt-8 space-y-4">
              <div className="border-t border-b py-4">
                <button
                  className="w-full text-left font-medium"
                  onClick={() => setShowDescription(!showDescription)}
                >
                  DESCRIPTION
                </button>
                {showDescription && (
                  <p className="mt-2 text-sm text-gray-600">
                    {productDets.description}
                  </p>
                )}
              </div>
              <div className="border-b py-4">
                <button
                  className="w-full text-left font-medium"
                  onClick={() => setShowReturnsInfo(!showReturnsInfo)}
                >
                  RETURNS & EXCHANGE INFORMATION
                </button>
                {showReturnsInfo && (
                  <p className="mt-2 text-sm text-gray-600">
                    Returns and Exchange are not available for this product.
                  </p>
                )}
              </div>
              <div className="border-b py-4">
                <button className="w-full text-left font-medium">
                  MORE INFORMATION
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
