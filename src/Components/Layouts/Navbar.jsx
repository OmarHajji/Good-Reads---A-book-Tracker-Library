import Search from "../UI/Search";
import React, { useState, useEffect, useRef } from "react";
import PrimaryButton from "../UI/PrimaryButton";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthGoogleContext } from "../../Contexts/AuthGoogleContext";
import { NavLink } from "react-router";
import { CgProfile } from "react-icons/cg";

function Navbar() {
  const { isAuth, user } = useContext(AuthGoogleContext);
  const [menu, setMenu] = useState(true);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum distance to trigger swipe (in pixels)
  const minSwipeDistance = 50;

  // Handle book title search from navbar
  const handleBookSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      // Navigate to categories page with search query
      navigate(`/categories?search=${encodeURIComponent(searchTerm.trim())}`);
      // Close mobile menu after search
      setMenu(true);
    }
  };

  // Handle touch start
  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Handle touch move
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Handle touch end
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -minSwipeDistance; // Swipe right (to close)

    // Close menu on right swipe (swipe away from left edge)
    if (isRightSwipe) {
      setMenu(true);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(true);
      }
    };

    if (!menu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menu]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          menu ? "opacity-0 pointer-events-none" : "opacity-100"
        } z-10 md:hidden`}
        onClick={() => setMenu(true)}
      />

      <nav className="w-full h-[70px] flex items-center justify-between px-4 lg:px-8 z-20">
        {/* Mobile Logo */}
        <a
          href="/"
          className="logo font-inter text-brown-200 text-3xl md:hidden hover:cursor-pointer"
        >
          good<span className="text-brown hover:cursor-pointer">reads</span>
        </a>

        {/* Mobile Menu Button */}
        <button
          className="toggler w-[45px] h-[45px] md:hidden focus:outline-none"
          onClick={() => setMenu(false)}
          aria-label="Open menu"
        >
          <img src="/menu-icon.png" alt="Menu" />
        </button>

        {/* Mobile Sliding Menu */}
        <div
          ref={menuRef}
          className={`bg-white w-80 h-full fixed top-0 right-0 z-50 ${
            menu ? "translate-x-full" : "translate-x-0"
          } transition-transform duration-300 ease-in-out shadow-lg md:translate-x-0 md:static md:h-auto md:shadow-none rounded-bl-lg md:rounded-none md:w-full`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="wrapper w-full p-4 flex flex-col gap-6 h-full  md:flex-row md:items-center md:justify-around">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between md:justify-start">
              <a
                href="/"
                className="logo font-inter text-brown-200 text-3xl hover:cursor-pointer"
              >
                good<span className="text-brown">reads</span>
              </a>
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
                onClick={() => setMenu(true)}
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* auth */}
            {isAuth && (
              <div className="flex flex-col md:flex-row gap-4 text-white md:justify-center">
                <NavLink
                  className={({ isActive }) =>
                    `text-lg ${
                      isActive ? "text-brown underline" : "text-black"
                    }`
                  }
                  to="/home"
                >
                  Home
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `text-lg ${
                      isActive ? "text-brown underline" : "text-black"
                    }`
                  }
                  to="/Mybooks"
                >
                  My books
                </NavLink>{" "}
                <NavLink
                  className={({ isActive }) =>
                    `text-lg ${
                      isActive ? "text-brown underline" : "text-black"
                    }`
                  }
                  to="/categories"
                >
                  Browse
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `text-lg ${
                      isActive ? "text-brown underline " : "text-black"
                    }`
                  }
                  to="/community"
                >
                  Community
                </NavLink>
              </div>
            )}
            {/* Search Bar */}
            <div className={` flex gap-6 ${!isAuth && "md:w-1/3"} `}>
              <Search
                placeholder="Need help finding your book ?"
                onSearch={handleBookSearch}
              />
              {isAuth && (
                <NavLink to="/profile">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-8 h-7 rounded-full object-cover hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <CgProfile className="text-3xl text-brown hover:text-dark-brown transition-colors" />
                  )}
                </NavLink>
              )}
            </div>
            {/* Action Buttons */}
            {!isAuth && (
              <div className="flex items-center justify-between gap-4">
                <PrimaryButton
                  className="active:scale-95 transition-transform"
                  text="Sign In"
                  link="/login"
                />
                <PrimaryButton
                  className="active:scale-95 transition-transform"
                  text="Sign up"
                  link="/signup"
                />
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
