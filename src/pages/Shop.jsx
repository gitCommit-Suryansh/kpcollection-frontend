import React, { useEffect, useState } from "react";
import Header from "../features/navigation/header";
import axios from "axios";
import { Link } from "react-router-dom";
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
        <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl sm:text-3xl md:text-7xl font-bold mb-6 tracking-tight">
              ELEGANT ESSENTIALS
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light tracking-wide">
              Timeless pieces for the modern wardrobe
            </p>
            <button className="px-8 py-3 bg-white text-black font-medium text-sm tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-xl">
              EXPLORE COLLECTION
            </button>
          </div>
        </div>
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
                    src={product.images[0]}
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
                    src={product.images[0]}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and About */}
            <div>
              <h3 className="text-lg font-bold mb-4">KP COLLECTION</h3>
              <p className="text-gray-400 text-sm mb-4">Premium clothing for the modern individual. Quality fabrics, timeless designs, exceptional comfort.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="https://www.instagram.com/_kp__collection?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0
2.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>

            

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-bold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us#contact-us" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/about-us#return-and-refund-policy" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</Link></li>
                {/*<li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>*/}
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a></li>
                <li><Link to="/about-us#privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/about-us" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
              <form className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-white"
                />
                <button className="px-4 py-2 bg-white text-gray-900 font-medium hover:bg-gray-200 transition-colors">
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} KP Collection. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-4">
                <p className="text-sm text-gray-400">
                  Developed by <a href="#" className="text-white hover:underline">Suryansh sharma</a>
                </p>
              </div>
             
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Shop;
