import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import decodeToken from '../utils/decodeToken'

const CreateProduct = () => {
  const [decoded, setDecoded] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = decodeToken(token);
      setDecoded(decodedToken);
    }
  }, []);

  const nameRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const discountRef = useRef();
  const imageRef = useRef();
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sizeOptions, setSizeOptions] = useState([]);

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSizes) => {
      if (prevSizes.includes(size)) {
        return prevSizes.filter((s) => s !== size);
      } else {
        return [...prevSizes, size];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("description", descriptionRef.current.value);
    formData.append("price", priceRef.current.value);
    formData.append("discount", discountRef.current.value);
    formData.append("owner", decoded.id);
    formData.append("category", selectedCategory);
    selectedSizes.forEach(size => formData.append("sizes", size));
  
    if (imageRef.current.files.length > 0) {
      for (let i = 0; i < imageRef.current.files.length; i++) {
        formData.append("images", imageRef.current.files[i]);
      }
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/owner/createproduct`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        setSuccessMessage("Product created successfully!");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Failed to create product. Please try again.");
    }
  };

  useEffect(() => {
    if (selectedCategory === "Shirt" || selectedCategory === "T-Shirts") {
      setSizeOptions(['S', 'M', 'L', 'XL', 'XXL']);
    } else if (selectedCategory === "Jeans" || selectedCategory === "Lower") {
      setSizeOptions(['26', '28', '30', '32', '34', '36']);
    } else {
      setSizeOptions([]);
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      {successMessage && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 p-3 rounded-md bg-blue-500">
          <span className="inline-block text-white">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 p-3 rounded-md bg-red-500">
          <span className="inline-block text-white">{errorMessage}</span>
        </div>
      )}

      <div className="container px-10 py-20 flex flex-grow">
        <main className="w-3/4 bg-white p-8 shadow ml-4">
          <h2 className="text-xl font-bold mb-4">Create New Product</h2>
          <form onSubmit={handleSubmit} autoComplete="off" encType="multipart/form-data">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Product Details</h3>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Product Image</label>
                <input type="file" name="image" ref={imageRef} multiple/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input ref={nameRef} name="name" type="text" placeholder="Product Name" className="border p-2 rounded w-full" />
                <input ref={descriptionRef} name="description" type="text" placeholder="Product Description" className="border p-2 rounded w-full" />
                <input ref={priceRef} name="price" type="text" placeholder="Product Price" className="border p-2 rounded w-full" />
                <input ref={discountRef} name="discount" type="text" placeholder="Discount Price" className="border p-2 rounded w-full" />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="category" className="block mb-2 font-medium">Select Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              >
                <option value="">Select a category</option>
                <option value="Shirt">Shirt</option>
                <option value="Jeans">Jeans</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Lower">Lower</option>
              </select>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Select Sizes</h3>
              <div className="grid grid-cols-2 gap-4">
                {sizeOptions.length > 0 ? (
                  sizeOptions.map(size => (
                    <label key={size} className="flex items-center">
                      <input
                        type={selectedCategory === "Jeans" || selectedCategory === "Lower" ? "checkbox" : "radio"}
                        value={size}
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        className="mr-2"
                      />
                      {size}
                    </label>
                  ))
                ) : (
                  <p className="text-gray-600">Please select a category to see sizes.</p>
                )}
              </div>
            </div>

            <button className="px-5 py-2 rounded mt-3 bg-blue-500 text-white" type="submit">Create New Product</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateProduct;
