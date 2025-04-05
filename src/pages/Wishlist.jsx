import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import decodeToken from "../utils/decodeToken";
import Header from "../features/navigation/header";

const Wishlist = () => {
  const token = Cookies.get("token");
  const decoded = decodeToken(token);
  const userId = decoded.id;
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchWishlist = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/getwishlist/${userId}`
      );
      setWishlist(response.data.wishlist);
      setLoading(false);
    };
    fetchWishlist();
  }, [userId]);


  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-medium mb-8">Your Wishlist ({wishlist.length})</h1>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-6">Loading...</p>
            </div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-6">Your wishlist is empty</p>
              <Link 
                to="/" 
                className="inline-block border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-colors"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              <div className="col-span-12">
                {wishlist.map((item) => (
                  <div key={item._id} className="flex gap-6 py-6 border-b">
                    
                    <div className="w-32 aspect-[3/4]">
                      <Link to={`/product/${item._id}`}>
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>

                    
                    <div className="flex-1">
                      <div className="flex justify-between mb-4">
                        <Link to={`/product/${item._id}`}>
                          <h3 className="font-medium">{item.name.toUpperCase()}</h3>
                        </Link>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span>Price: INR {item.price}</span>
                          {item.discount > 0 && (
                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                              {Math.round((item.discount / item.price) * 100)}% OFF
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                        <div>
                          <span className="font-medium">Sizes:</span>
                          <div className="flex space-x-2">
                            {item.sizes.map((size, index) => (
                              <span key={index} className="border border-gray-300 px-2 py-1 rounded">
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      
                      </div>
                     
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
