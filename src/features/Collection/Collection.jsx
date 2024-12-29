import React, { useEffect, useState } from "react";
import Header from "../navigation/header";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";

const Collection = () => {
  const { category } = useParams(); // Extract category from URL parameters
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minPrice, setMinPrice] = useState(0); // Separate state for min price
  const [maxPrice, setMaxPrice] = useState(10000); // Separate state for max price
  const [isFilterVisible, setIsFilterVisible] = useState(false); // State for filter visibility

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/products/fetchproduct/${category}`
        );
        setProducts(response.data.products);
        setFilteredProducts(response.data.products); // Initialize filtered products
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again.");
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [category]);

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = products;

      // Filter by size
      if (selectedSizes.length > 0) {
        filtered = filtered.filter((product) =>
          product.sizes.some((size) => selectedSizes.includes(size))
        );
      }

      // Filter by price
      filtered = filtered.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [selectedSizes, minPrice, maxPrice, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="animate-pulse text-blue-500 pl-3">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex flex-1 relative">
        {/* Filter Sidebar */}
        <aside
          className={`fixed top-16 left-0 w-64 h-screen p-4 border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out z-9 transform ${
            isFilterVisible ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ zIndex: 99 }}
        >
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="mb-4">
            <h3 className="font-medium">Price Range</h3>
            <input
              type="range"
              min="0"
              max="10000"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #007bff ${
                  minPrice / 100
                }% , #e0e0e0 ${minPrice / 100}%)`,
              }}
            />
            <input
              type="range"
              min="0"
              max="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #007bff ${
                  maxPrice / 100
                }% , #e0e0e0 ${maxPrice / 100}%)`,
              }}
            />
            <p>
              Price: INR {minPrice} - INR {maxPrice}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Sizes</h3>
            {Array.from(
              new Set(products.flatMap((product) => product.sizes))
            ).map((size) => (
              <div key={size}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                  {size}
                </label>
              </div>
            ))}
          </div>
          <div>
            <button
              className="fixed left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg"
              onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
              {isFilterVisible ? "Apply" : ""}
            </button>
          </div>
        </aside>
        <main className="flex-1 max-w-[1440px] mx-auto px-4 mt-16">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {category.toUpperCase()}
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
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
        </main>
      </div>
      {/* Toggle Button for Mobile View */}
      <button
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg"
        onClick={() => setIsFilterVisible(!isFilterVisible)}
      >
        {isFilterVisible ? "Hide Filters" : "Show Filters"}
      </button>
    </div>
  );
};

export default Collection;
