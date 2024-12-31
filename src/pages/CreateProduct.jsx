import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import decodeToken from '../utils/decodeToken';
import { ImagePlus, X } from "lucide-react";

const CreateProduct = () => {
  const [decoded, setDecoded] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sizeOptions, setSizeOptions] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const formRefs = {
    name: useRef(),
    description: useRef(),
    price: useRef(),
    discount: useRef(),
    image: useRef()
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) setDecoded(decodeToken(token));
  }, []);

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    const dt = new DataTransfer();
    const input = formRefs.image.current;
    const { files } = input;
    
    for(let i = 0; i < files.length; i++) {
      if(i !== index) dt.items.add(files[i]);
    }
    
    input.files = dt.files;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    const fields = ['name', 'description', 'price', 'discount'];
    
    fields.forEach(field => 
      formData.append(field, formRefs[field].current.value)
    );
    
    formData.append("owner", decoded.id);
    formData.append("category", selectedCategory);
    selectedSizes.forEach(size => formData.append("sizes", size));
    
    Array.from(formRefs.image.current.files).forEach(file => 
      formData.append("images", file)
    );

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/owner/createproduct`, 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      if (response.status === 200) {
        setSuccessMessage("Product created successfully!");
        setTimeout(() => setSuccessMessage(''), 3000);
        // Reset form
        e.target.reset();
        setPreviewImages([]);
        setSelectedSizes([]);
        setSelectedCategory("");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to create product. Please try again.");
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSizeOptions(
      selectedCategory === "Shirt" || selectedCategory === "T-Shirts"
        ? ['S', 'M', 'L', 'XL', 'XXL']
        : selectedCategory === "Jeans" || selectedCategory === "Lower"
          ? ['26', '28', '30', '32', '34', '36']
          : []
    );
    setSelectedSizes([]);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {successMessage && (
        <div className="fixed top-4 right-4 w-full max-w-sm bg-green-50 text-green-900 px-6 py-4 rounded-lg shadow-lg border-l-4 border-green-500 transform transition-all">
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-4 right-4 w-full max-w-sm bg-red-50 text-red-900 px-6 py-4 rounded-lg shadow-lg border-l-4 border-red-500 transform transition-all">
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800">Create New Product</h2>
          <p className="mt-1 text-sm text-gray-500">Fill in the details below to add a new product to your inventory.</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Product Images</label>
                <div className="flex flex-wrap gap-4">
                  {previewImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={url} 
                        alt="preview" 
                        className="w-28 h-28 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1.5 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="w-28 h-28 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
                    <input
                      type="file"
                      ref={formRefs.image}
                      onChange={handleImageChange}
                      multiple
                      className="hidden"
                      accept="image/*"
                    />
                    <ImagePlus className="w-6 h-6 text-gray-400" />
                    <span className="mt-2 text-xs text-gray-500">Add Images</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    ref={formRefs.name}
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                    required
                  >
                    <option value="">Select category</option>
                    {["Shirt", "Jeans", "T-Shirts", "Lower"].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      ref={formRefs.price}
                      type="number"
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      ref={formRefs.discount}
                      type="number"
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  ref={formRefs.description}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
                  placeholder="Enter product description"
                  required
                />
              </div>

              {sizeOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map(size => (
                      <label 
                        key={size} 
                        className={`
                          px-4 py-2 rounded-lg border cursor-pointer select-none transition-all duration-200
                          ${selectedSizes.includes(size) 
                            ? 'bg-blue-50 border-blue-500 text-blue-700' 
                            : 'border-gray-200 text-gray-600 hover:border-blue-500 hover:bg-blue-50'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeChange(size)}
                          className="hidden"
                        />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  }
                `}
              >
                {loading ? 'Creating Product...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;