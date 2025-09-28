import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import Container from "../UI/Container";
import { AuthGoogleContext } from "../../Contexts/AuthGoogleContext";
import { AuthAPI } from "../../Utils/authApi";
import {
  IoPersonOutline,
  IoMailOutline,
  IoLogOutOutline,
  IoCameraOutline,
  IoSaveOutline,
  IoCloseOutline,
} from "react-icons/io5";

function Profile() {
  const { user, logout, isAuth } = useContext(AuthGoogleContext);
  const navigate = useNavigate();

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.name || "");
  const [editedProfilePic, setEditedProfilePic] = useState(user?.picture || "");
  const [previewImage, setPreviewImage] = useState(user?.picture || "");

  // Statistics states
  const [stats, setStats] = useState({
    favorites: 0,
    wantToRead: 0,
    currentlyReading: 0,
    haveRead: 0,
    loading: false,
  });

  // File upload ref
  const fileInputRef = useRef(null);

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setEditedProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes
  const handleSaveChanges = () => {
    // In a real app, you would send this to your backend
 

    // Update local storage with new data
    const updatedUser = {
      ...user,
      name: editedUsername,
      picture: editedProfilePic,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Exit edit mode
    setIsEditMode(false);

    // Show success message (you could add a toast notification here)
    alert("Profile updated successfully!");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditedUsername(user?.name || "");
    setEditedProfilePic(user?.picture || "");
    setPreviewImage(user?.picture || "");
    setIsEditMode(false);
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  // Default avatar if no profile picture
  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format";

  return (
    <Container className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className=" inline-block relative top-10 bg-black left-1/2 -translate-x-1/2 rounded-full -translate-y-1/2 mt-6 mb-4">
              <img
                src={previewImage || user?.picture || defaultAvatar}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />

              {isEditMode && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-brown text-white p-2 rounded-full shadow-lg hover:bg-dark-brown transition-colors"
                >
                  <IoCameraOutline className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* User Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                {isEditMode ? (
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-brown"
                    placeholder="Enter username"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {user?.name || "Guest User"}
                  </h1>
                )}

                <div className="flex items-center text-gray-600 mt-2">
                  <IoMailOutline className="w-4 h-4 mr-2" />
                  <span>{user?.email || "No email"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {!isEditMode ? (
                  <>
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="flex items-center px-4 py-2 bg-brown text-white rounded-lg hover:bg-dark-brown transition-colors"
                    >
                      Edit Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <IoLogOutOutline className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      disabled={!editedUsername.trim()}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IoSaveOutline className="w-4 h-4 mr-2" />
                      Save
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <IoCloseOutline className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <IoPersonOutline className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium text-gray-900">
                    {user?.name || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <IoMailOutline className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {user?.email || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-green-600">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Profile;
