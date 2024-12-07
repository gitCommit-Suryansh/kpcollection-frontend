import React, { useEffect, useState } from "react";
import Header from "../features/navigation/header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import decodeToken from "../utils/decodeToken";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/products/allproducts`,
          {
            withCredentials: true, // Include credentials (cookies)
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
        console.error(err); // Log the error for debugging
        setError("Failed to fetch products");
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  ;

  const token = Cookies.get("token");
  console.log(token);
  console.log(document.cookie);

  if (token) {
    try {
      const decodedToken = decodeToken(token);
      var userId = decodedToken.id;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  } else {
    console.log("No token found");
  }

  const addToCart = async (id) => {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/cart/addtocart/${id}`,
      { userId }
    );
    if (response.status === 200) {
      setSuccess("Product added to cart");
      
    } else {
      setSuccess("Error Adding Item To Cart");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      {success && success.length > 0 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-md bg-blue-500">
          <span className="inline-block mt-1 mb-1 text-white">{success}</span>
        </div>
      )}

      <style>
        {`
          @media (max-width: 1024px) {
            .side-nav {
              display: none;
            }
            .product-main-div {
              width: auto;
            }
            .cards {
              width: 48vw;
            }
            .card-img {
              height: 23vh;
            }
            .main-div {
              padding: 10vh 1.5px 5px 1.5px;
              margin-bottom: 5px;
            }
            .panel {
              height: 10vh;
            }
          }
        `}
      </style>

      <div className="main-div w-full h-screen flex items-start px-20 py-20">
        <div className="side-nav w-[25%] flex h-screen flex-col items-start">
          <div className="flex items-center gap-2">
            <h3>Sort by</h3>
            <form action="/shop">
              <select className="border-[1px] px-2 py-1" name="sortby">
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
              </select>
            </form>
          </div>

          <div className="flex flex-col mt-20">
            <a className="block w-fit mb-2" href="">
              New Collection
            </a>
            <a className="block w-fit mb-2" href="">
              All Products
            </a>
            <a className="block w-fit mb-2" href="">
              Discounted Products
            </a>
          </div>

          <div className="mt-32">
            <a className="block w-fit mb-2" href="">
              Filter by :
            </a>
            <a className="block w-fit mb-2" href="">
              Availability
            </a>
            <a className="block w-fit mb-2" href="">
              Discount
            </a>
          </div>
        </div>

        <div className="product-main-div w-[75%] flex flex-col gap-5 h-screen ">
          <div className="flex flex-wrap gap-3 ">
            {products.map((product, index) => (
              <div
                key={index}
                className="cards w-60 rounded-md overflow-hidden "
              >
                <div
                  className="card-img w-full h-52 flex items-center relative"
                  style={{ backgroundColor: product.bgcolor }}
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      className="h-[12rem] w-full object-fit"
                      src={`data:image/png;base64,${btoa(
                        String.fromCharCode.apply(
                          null,
                          new Uint8Array(product.images[0].data)
                        )
                      )}`}
                      alt={product.name}
                    />
                  </Link>
                </div>
                <div
                  className="panel flex justify-between h-[13vh] pr-3"
                  style={{
                    backgroundColor: product.panelcolor,
                    color: product.textcolor,
                  }}
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="font-semibold px-3 py-4 overflow-hidden">
                      <h3 className="w-[12vw] h-[7vh] overflow-hidden">
                        {product.name}
                      </h3>
                      <h4>₹ {product.price}</h4>
                    </div>
                  </Link>
                  <a
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-black mt-8"
                    onClick={() => addToCart(product._id)}
                  >
                    <i className="ri-add-line"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
