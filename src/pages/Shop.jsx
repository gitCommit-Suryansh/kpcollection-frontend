import React, { useEffect, useState } from "react";
import Header from "../features/navigation/header";
import axios from "axios";
import { Buffer } from "buffer";
import { Link} from "react-router-dom";
import Cookies from "js-cookie";
import decodeToken from "../utils/decodeToken";
import carousel1 from "../assets/images/carousel1.png";
import carousel2 from "../assets/images/carousel2.png";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const images = [carousel1, carousel2];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/products/allproducts`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setProducts(response.data.products);
          setLoading(false);
        } else {
          setError("Failed to fetch products");
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    fetchProductsByCategory("Shirt");
  }, []);

  const fetchProductsByCategory = async (category) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/products/fetchproduct/${category}`
      );
      setFetchedProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
    }
  };

  const token = Cookies.get("token");
  let userId;

  if (token) {
    try {
      const decodedToken = decodeToken(token);
      userId = decodedToken.id;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-500"></div>
      <div className="animate-pulse text-zinc-500 pl-3">Loading...</div>
    </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Carousel Component */}
      <div className="relative w-full h-64 sm:h-screen overflow-hidden mt-16">
        <img
          src={images[currentImageIndex]}
          alt="Carousel"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        />
      </div>

      <div className="text-center mt-4">
        <button className="px-4 py-2 text-white bg-black rounded-3xl">
          NEW DROPS
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 mt-2">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product, index) => (
            <div
              key={product._id}
              className={`group z-2 ${
                window.innerWidth > 1024 ? "scale-[90%]" : ""
              }`}
            >
              <Link to={`/product/${product._id}`} className="block relative ">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 ">
                  <img
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    src={`data:image/jpg;base64,${Buffer.from(
                      product.images[0].data
                    ).toString("base64")}`}
                    alt={product.name}
                  />
                </div>
              </Link>
              <div className="mt-4 text-center">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-900">INR {product.price}</p>
                </Link>
                <div className="mt-2 flex justify-center space-x-2 border-t-2 border-b-2 border-gray-300">
                  {product.sizes.map((size) => (
                    <span key={size} className="text-xs text-gray-600">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border border-black px-8 py-2 text-sm hover:bg-black hover:text-white transition-colors duration-300">
            VIEW ALL
          </button>
        </div>
      </main>

      <div className="flex justify-center mt-8 mb-8">
        {["Shirt", "Jeans", "T-Shirts", "Lower"].map((category) => (
          <button
            key={category}
            onClick={() => fetchProductsByCategory(category)}
            className="mx-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Display Fetched Products */}
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {fetchedProducts.map((product, index) => (
            <div
              key={index}
              className={`group z-2 ${
                window.innerWidth > 1024 ? "scale-[90%]" : ""
              }`}
            >
              <Link to={`/product/${product._id}`} className="block relative">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    src={`data:image/jpg;base64,${Buffer.from(
                      product.images[0].data
                    ).toString("base64")}`}
                    alt={product.name}
                  />
                </div>
              </Link>
              <div className="text-center mt-2">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-900">INR {product.price}</p>
                </Link>
                <div className="mt-2 flex justify-center space-x-2 border-t-2 border-b-2 border-gray-300 pt-2 pb-2">
                  {product.sizes.map((size) => (
                    <span key={size} className="text-xs text-gray-600">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
