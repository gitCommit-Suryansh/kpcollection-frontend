import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import decodeToken from "../../utils/decodeToken";
import defaultProfile from "../../assets/images/add-image-1-48.png";
import Header from "../navigation/header";

const MyProfile = () => {
  const token = Cookies.get("token");
  const decoded = decodeToken(token);
  const [userDets, setUserDets] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [profile, setProfile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  success && setTimeout(() => setSuccess(""), 3000);

  const [passwordMatch, setPasswordMatch] = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/get-profile/${decoded.id}`
        );
        if (response.status === 200) {
          setUserDets(response.data.user);
          setName(response.data.user.name);
          setEmail(response.data.user.email);
          setProfile(response.data.user.profile);
          setLoading(false);
        } else {
          setError("Failed to fetch profile");
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, [userDets]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append("profile", selectedImage);
      }
      if (password) {
        formData.append("password", password);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/update-profile/${decoded.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        setSuccess("Profile updated successfully");
      } else {
        setSuccess(response.data.message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value === password) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="animate-pulse text-blue-500 pl-3">Loading...</div>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      {success && success.length > 0 && (
        <div
          className={`absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-md ${
            success === "Profile updated successfully"
              ? "bg-blue-500"
              : "bg-red-500"
          }`}
        >
          <span className="inline-block mt-1 mb-1 text-white">{success}</span>
        </div>
      )}
      <div className="max-w-3xl mx-auto p-8 mt-16 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Profile
        </h2>
        <form onSubmit={handleUpdateProfile} encType="multipart/form-data">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="flex flex-col items-center mb-4">
                <div
                  className="w-32 h-32 rounded-full flex justify-center items-center bg-gray-200 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundImage: `url(${
                      imagePreview
                        ? imagePreview
                        : profile
                        ? `data:image/jpg;base64,${Buffer.from(
                            profile.data
                          ).toString("base64")}`
                        : defaultProfile
                    })`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                  onClick={() => profileRef.current.click()}
                >
                  <input
                    type="file"
                    className="hidden"
                    name="profile"
                    ref={profileRef}
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-gray-600 text-sm">
                  Click to change profile picture
                </p>
                {selectedImage && (
                  <p className="text-green-500 text-sm">
                    Image selected successfully
                  </p>
                )}
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  value={name}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  value={email}
                  disabled
                />
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Change Your Password
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <input
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        passwordMatch === true
                          ? "border-green-500"
                          : passwordMatch === false
                          ? "border-red-500"
                          : ""
                      }`}
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <button
            className={`${
              selectedImage ? "bg-orange-500" : "bg-blue-700"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type="submit"
          >
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
};

export default MyProfile;
