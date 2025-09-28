import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AuthAPI } from "../../Utils/authApi";
import { AuthGoogleContext } from "../../Contexts/AuthGoogleContext";

function Book({
  bookData = {
    id: 1,
    title: "Book name",
    author: "Author",
    cover: null,
    rating: 1,
    isFavorited: false,
  },
}) {
  const { isAuth } = useContext(AuthGoogleContext);
  const [isFavorited, setIsFavorited] = useState(bookData.isFavorited || false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if book is favorited on mount
  useEffect(() => {
    if (isAuth) {
      checkFavoriteStatus();
    }
  }, [isAuth, bookData.id]);

  const checkFavoriteStatus = async () => {
    try {
      const favorited = await AuthAPI.checkFavorite(bookData.id);
      setIsFavorited(favorited);
    } catch (error) {
      console.warn("Failed to check favorite status:", error);
    }
  };

  // Generate array of 5 stars for rating display (non-interactive)
  const renderStars = (rating, size = "w-3 h-3") => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= rating;

      return (
        <div key={index} className={`${size}`}>
          <svg
            viewBox="0 0 24 24"
            fill={isFilled ? "#D97706" : "none"}
            stroke={isFilled ? "#D97706" : "#D1D5DB"}
            strokeWidth="1"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      );
    });
  };

  const handleFavoriteToggle = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (!isAuth) {
      alert("Please sign in to add books to favorites");
      return;
    }

    setIsLoading(true);
    const newFavoriteState = !isFavorited;

    try {
      const result = await AuthAPI.trackFavorite(
        bookData.id,
        bookData.title,
        [bookData.author],
        newFavoriteState
      );

      if (result.success) {
        setIsFavorited(newFavoriteState);

        // Show success message
        const message = newFavoriteState
          ? `"${bookData.title}" added to favorites!`
          : `"${bookData.title}" removed from favorites!`;

        // You could replace this with a toast notification
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
      alert("Failed to update favorite. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadBook = async (e) => {
    e.preventDefault(); // Prevent Link navigation

    if (isAuth) {
      // Track the book as being read/viewed
      try {
        await AuthAPI.trackBookView(bookData.id, bookData.title, [
          bookData.author,
        ]);
      } catch (error) {
        console.warn("Failed to track book view:", error);
      }
    }

    // Navigate to book viewer
    window.location.href = `/book/${bookData.id}/read`;
  };

  return (
    <Link
      to={`/book/${bookData.id}`}
      className="bg-white rounded-xl p-3 w-full xs:w-[100px] sm:w-[200px] h-[500px] sm:h-[300px] hover:scale-105 transition-all duration-300 block"
    >
      {/* Book Cover Section */}
      <div className="relative mb-2">
        <div className="bg-gray-200 rounded-lg w-full h-100 sm:h-60 flex items-center justify-center overflow-hidden">
          {bookData.cover ? (
            <img
              src={bookData.cover}
              alt={`${bookData.title} cover`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-full h-full flex items-center justify-center text-gray-400 ${
              bookData.cover ? "hidden" : "flex"
            }`}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            </svg>
          </div>
        </div>

        {/* Favorite Heart Icon */}
        <button
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          className={`
            absolute top-2 right-2 bg-white rounded-md p-1 shadow-md hover:shadow-lg transition-all
            ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
          `}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-brown border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill={isFavorited ? "#D97706" : "none"}
                stroke={isFavorited ? "#D97706" : "#6B7280"}
                strokeWidth="2"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          )}
        </button>

        {/* Book Info */}
        <div className="text-center mb-2"></div>

        {/* Book Info */}
        {bookData.title.length >= 20
          ? bookData.title.slice(0, 15) + "..."
          : bookData.title}
        <p className="text-gray-600 text-sm">
          {bookData.author.length >= 10
            ? bookData.author.slice(0, 10) + "..."
            : bookData.author}
        </p>
      </div>

      {/* Rating Display */}
      <div className="flex justify-center mb-2">
        {renderStars(bookData.rating)}
      </div>

      {/* Read Count and Action */}
      <div className="text-center">
        <button
          onClick={handleReadBook}
          className="w-full bg-brown hover:bg-dark-brown text-white py-1.5 px-2 rounded-md text-sm font-medium transition-colors"
        >
          Read Now
        </button>
      </div>
    </Link>
  );
}

export default Book;
