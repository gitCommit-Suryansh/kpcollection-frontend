import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../features/navigation/header";
import decodeToken from "../utils/decodeToken";
import Cookies from 'js-cookie'

const ProductDetails = () => {
  const { id } = useParams();
  const [ProductDets, setProductDets] = useState();
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setmessage] = useState('')

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/products/product/${id}`
        );
        if (response.status === 200) {
          setProductDets(response.data.product);
        } else {
          console.error("Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!ProductDets) return <p>Loading...</p>;

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const token=Cookies.get('token')
  const decodedToken=decodeToken(token)
  const userId=decodedToken.id

  const addToCart=async(id)=>{
    const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cart/addtocart/${id}`,{userId})
    if(response.status===200){
      setmessage("Product added to cart")
    }
    else{
      setmessage("Error Adding Item To Cart")
    }
  }

  return (
   <>
   <Header/>
   {message && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-3 rounded-md z-999 ${message === "Product added to cart" ? 'bg-blue-500' : 'bg-red-500'}`}>
          <span className="inline-block text-white">{message}</span>
        </div>
      )}
   <div className="flex p-4 mt-[10vh]">
      
      <div className="w-1/6 flex flex-col items-center">
        <div className="flex flex-col space-y-2">
            {ProductDets.images.map((image, index) => (
          <img key={index}
            src={`data:image/png;base64,${btoa(
                String.fromCharCode.apply(
                  null,
                  new Uint8Array(image.data)
                )
              )}`}
            alt={`Thumbnail ${index + 1}`}
            className={`border p-1 object-cover h-[8vw] w-[8vw] cursor-pointer ${selectedImage === index ? 'border-blue-500' : ''}`}
            onClick={() => handleImageClick(index)}
          />
          ))}
        </div>
      </div>
      <div className="w-1/3">
        <div className="border p-2 mb-2">
          <img
            src={`data:image/png;base64,${btoa(
                String.fromCharCode.apply(
                  null,
                  new Uint8Array(ProductDets.images[selectedImage].data)
                )
              )}`}
            alt="Main product image"
            className="w-full"
          />
        </div>
      </div>
      <div className="w-1/2 pl-4">
        <div className="text-sm text-blue-600 mb-2">
          Visit the {ProductDets.owner.businessname} Store
        </div>
        <h1 className="text-2xl font-bold mb-2">{ProductDets.name}</h1>
        <div className="flex items-center mb-2">
          <div className="text-yellow-500">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star-half-alt"></i>
            <i className="far fa-star"></i>
          </div>
          <div className="text-sm text-gray-600 ml-2">3.8</div>
          <div className="text-sm text-blue-600 ml-2">1,810 ratings</div>
          <div className="text-sm text-blue-600 ml-2">| Search this page</div>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          200+ bought in past month
        </div>
        <div className="text-zinc-800 text-2xl font-bold mb-2"><span className="font-normal text-[1.2rem]">-{Math.round((ProductDets.discount / ProductDets.price) * 100)}% </span>₹{ProductDets.price-ProductDets.discount}</div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="line-through">M.R.P.: ₹{ProductDets.price}</span>
        </div>
        <div className="text-sm text-gray-600 mb-2">Inclusive of all taxes</div>
        <div className="text-sm text-gray-600 mb-2">
          EMI starts at ₹270 per month.{" "}
          <span className="text-blue-600">EMI options</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="bg-orange-500 text-white px-2 py-1 text-sm font-bold">
            Coupon:
          </div>
          <div className="ml-2">
            <input type="checkbox" className="mr-1" /> Apply ₹30 coupon{" "}
            <span className="text-blue-600">Terms</span>
          </div>
        </div>
        <div className="border p-2 mb-2">
          <div className="font-bold mb-1">Offers</div>
          <div className="flex space-x-2">
            <div className="border p-2 w-1/2">
              <div className="font-bold">Bank Offer</div>
              <div className="text-sm">
                Upto ₹4,000.00 discount on SBI Cr...
              </div>
              <div className="text-blue-600 text-sm">10 offers</div>
            </div>
            <div className="border p-2 w-1/2">
              <div className="font-bold">Partner Offer</div>
              <div className="text-sm">
                Get GST invoice and save up to 28% on...
              </div>
              <div className="text-blue-600 text-sm">1 offer</div>
            </div>
          </div>
        </div>
        <div className="flex items-center mb-2">
          <div className="text-md font-bold">₹{ProductDets.price-ProductDets.discount}</div>
          <div className="ml-2 text-sm text-green-600">
            FREE delivery {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })}. Order within 18 hrs 46 mins.{" "}
            <span className="text-blue-600">Details</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <i className="fas fa-map-marker-alt"></i> Delivering to Gwalior 474001
          - <span className="text-blue-600">Update location</span>
        </div>
        <div className="text-green-600 font-bold mb-2">In stock</div>
        <div className="text-sm text-gray-600 mb-2">
          Ships from <span className="text-blue-600">Amazon</span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          Sold by <span className="text-blue-600">{ProductDets.owner.businessname}</span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          Packaging{" "}
          <span className="text-blue-600">Ships in product packaging</span>
        </div>
        <div className="flex items-center mb-2">
          <label className="text-sm text-gray-600 mr-2">Quantity:</label>
          <select className="border p-1">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>
        <div className="flex space-x-2 mb-2">
          <button className="bg-yellow-400 text-black px-4 py-2 font-bold" onClick={()=>addToCart(id)}>
            Add to Cart
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 font-bold">
            Buy Now
          </button>
        </div>
        <div className="flex items-center mb-2">
          <i className="fas fa-lock"></i>{" "}
          <span className="ml-2 text-sm text-gray-600">Secure transaction</span>
        </div>
        <div className="flex items-center mb-2">
          <input type="checkbox" className="mr-1" />{" "}
          <span className="text-sm text-gray-600">Add gift options</span>
        </div>
        <button className="text-blue-600 text-sm">Add to Wish List</button>
      </div>
    </div>
   </>
  );
};

export default ProductDetails;
