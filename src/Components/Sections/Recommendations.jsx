import React, { useState, useEffect, useContext } from "react";
import { AuthAPI } from "../../Utils/authApi";
import api from "../../Utils/api"; // Public API for searching
import { AuthGoogleContext } from "../../Contexts/AuthGoogleContext";
import SavePopup from "./SavePopup";
import { Link } from "react-router";

function Recommendations() {
  const { isAuth } = useContext(AuthGoogleContext);
  const apiKey = import.meta.VITE_API_KEY;
  // Component states
  const [activeTab, setActiveTab] = useState("author");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [error, setError] = useState("");
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState({});

  // Load recommendations when component starts or tab changes
  useEffect(() => {
    if (isAuth) {
      loadFavoriteBooks();
    }
  }, [isAuth]);

  useEffect(() => {
    if (favoriteBooks.length > 0) {
      loadRecommendations();
    }
  }, [activeTab, favoriteBooks]);

  // Get user's favorite books using AuthAPI
  const loadFavoriteBooks = async () => {
    try {
      setError("");

      // Get books from favorites shelf (id: "0") using AuthAPI
      const response = await AuthAPI.getShelfVolumes("0");
      const books = response.data?.items || [];

      setFavoriteBooks(books);

      if (books.length === 0) {
        setError("Add some books to your favorites to get recommendations!");
      }
    } catch (error) {
      console.error("Failed to load favorite books:", error);
      setError("Failed to load your favorite books.");
    }
  };

  // Load recommendations based on active tab
  const loadRecommendations = async () => {
    if (favoriteBooks.length === 0) return;

    setLoading(true);
    setError("");

    try {
      if (activeTab === "author") {
        await loadAuthorBasedRecommendations();
      } else {
        await loadGenreBasedRecommendations();
      }
    } catch (error) {
      console.error("Failed to load recommendations:", error);
      setError("Failed to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get recommendations based on authors from favorites
  const loadAuthorBasedRecommendations = async () => {
    // Extract authors from favorite books
    const authorSet = new Set();

    favoriteBooks.forEach((book) => {
      const authors = book.volumeInfo?.authors || [];
      authors.forEach((author) => authorSet.add(author));
    });

    const favoriteAuthors = Array.from(authorSet).slice(0, 5); // Top 5 authors

    const allRecommendations = [];

    // Get books by each favorite author using public API
    for (const author of favoriteAuthors) {
      try {
        const response = await api.get("", {
          params: {
            q: `inauthor:"${author}"`,
            maxResults: 4,
          },
        });

        const authorBooks = response.data?.items || [];

        // Filter out books already in favorites
        const newBooks = authorBooks.filter(
          (book) => !favoriteBooks.some((fav) => fav.id === book.id)
        );

        // Add a few books from this author
        allRecommendations.push(...newBooks.slice(0, 3));
      } catch (error) {
        console.warn(`Failed to get books by author ${author}:`, error);
      }
    }

    // Remove duplicates and limit results
    const uniqueRecommendations = allRecommendations.filter(
      (book, index, self) => index === self.findIndex((b) => b.id === book.id)
    );

    setRecommendations(uniqueRecommendations.slice(0, 8));
  };

  // Get recommendations based on categories from favorites
  const loadGenreBasedRecommendations = async () => {
    // Extract categories from favorite books
    const categorySet = new Set();

    favoriteBooks.forEach((book) => {
      const categories = book.volumeInfo?.categories || [];
      categories.forEach((category) => {
        const cleanCategory = category.split("/")[0].trim();
        categorySet.add(cleanCategory);
      });
    });

    const favoriteCategories = Array.from(categorySet).slice(0, 4); // Top 4 categories

    if (favoriteCategories.length === 0) {
      // Fallback to popular books using public API
      const response = await api.get("", {
        params: {
          q: "bestseller",
          maxResults: 4,
          orderBy: "relevance",
        },
      });
      const books = response.data?.items || [];
      setRecommendations(books.slice(0, 8));
      return;
    }

    const allRecommendations = [];

    // Get books from each favorite category using public API
    for (const category of favoriteCategories) {
      try {
        const response = await api.get("", {
          params: {
            q: `subject:${category}`,
            maxResults: 4,
            orderBy: "relevance",
          },
        });

        const categoryBooks = response.data?.items || [];

        // Filter out books already in favorites
        const newBooks = categoryBooks.filter(
          (book) => !favoriteBooks.some((fav) => fav.id === book.id)
        );

        // Add a few books from this category
        allRecommendations.push(...newBooks.slice(0, 3));
      } catch (error) {
        console.warn(`Failed to get books in category ${category}:`, error);
      }
    }

    // Remove duplicates and limit results
    const uniqueRecommendations = allRecommendations.filter(
      (book, index, self) => index === self.findIndex((b) => b.id === book.id)
    );

    setRecommendations(uniqueRecommendations.slice(0, 8));
  };

  // Check if book is in favorites
  const isBookFavorited = (bookId) => {
    return favoriteBooks.some((fav) => fav.id === bookId);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (e, book) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (!isAuth) return;

    setFavoriteLoading((prev) => ({ ...prev, [book.id]: true }));

    try {
      const isFavorited = isBookFavorited(book.id);

      if (isFavorited) {
        // Remove from favorites
        await AuthAPI.removeVolume("0", book.id);
        setFavoriteBooks((prev) => prev.filter((fav) => fav.id !== book.id));
      } else {
        // Add to favorites
        await AuthAPI.addVolume("0", book.id);
        setFavoriteBooks((prev) => [...prev, book]);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [book.id]: false }));
    }
  };

  // Handle add to library (opens SavePopup)
  const handleAddToLibrary = (e, book) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    setSelectedBook(book);
    setShowSavePopup(true);
  };

  // Close save popup
  const handleCloseSavePopup = () => {
    setShowSavePopup(false);
    setSelectedBook(null);
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-3 h-3 ${
            i < fullStars ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  // Book Card Component using your design
  const BookCard = ({ book }) => {
    const title = book.volumeInfo?.title || "Unknown Title";
    const authors = book.volumeInfo?.authors || ["Unknown Author"];
    const thumbnail = book.volumeInfo?.imageLinks?.thumbnail;
    const averageRating = book.volumeInfo?.averageRating || 0;
    const isFavorited = isBookFavorited(book.id);
    const isLoadingFavorite = favoriteLoading[book.id];

    return (
      <Link
        to={`/book/${book.id}`}
        className="bg-white rounded-xl p-3 w-full xs:w-[100px] sm:w-[200px] h-[500px] sm:h-[300px] hover:scale-105 transition-all duration-300 block"
      >
        {/* Book Cover Section */}
        <div className="relative mb-2">
          <div className="bg-gray-200 rounded-lg w-full h-100 sm:h-60 flex items-center justify-center overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={`${title} cover`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-full h-full flex items-center justify-center text-gray-400 ${
                thumbnail ? "hidden" : "flex"
              }`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
              </svg>
            </div>
          </div>

          {/* Favorite Heart Icon */}
          <button
            onClick={(e) => handleFavoriteToggle(e, book)}
            disabled={isLoadingFavorite}
            className={`
              absolute top-2 right-2 bg-white rounded-md p-1 shadow-md hover:shadow-lg transition-all
              ${
                isLoadingFavorite
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-110"
              }
            `}
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isLoadingFavorite ? (
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
          <div className="text-center mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">
              {title.length >= 20 ? title.slice(0, 15) + "..." : title}
            </h3>
            <p className="text-gray-600 text-sm">
              {authors[0].length >= 10
                ? authors[0].slice(0, 10) + "..."
                : authors[0]}
            </p>
          </div>
        </div>

        {/* Rating Display */}
        <div className="flex justify-center mb-2">
          {renderStars(averageRating)}
        </div>

        {/* Add to Library Action */}
        <div className="text-center">
          <button
            onClick={(e) => handleAddToLibrary(e, book)}
            className="w-full bg-brown hover:bg-dark-brown text-white py-1.5 px-2 rounded-md text-sm font-medium transition-colors"
          >
            Add to Library
          </button>
        </div>
      </Link>
    );
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setRecommendations([]); // Clear current recommendations
  };

  // Refresh recommendations
  const handleRefresh = () => {
    loadFavoriteBooks();
  };

  // If user is not signed in
  if (!isAuth) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Book Recommendations
          </h2>
          <p className="text-gray-600">
            Sign in to get personalized book recommendations based on your
            favorites
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Book Recommendations
            </h2>
            <p className="text-gray-600">based on your favorite books</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-lg p-1 max-w-md w-full">
              <button
                onClick={() => handleTabChange("author")}
                className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === "author"
                    ? "bg-brown text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                By Author
              </button>

              <button
                onClick={() => handleTabChange("genre")}
                className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === "genre"
                    ? "bg-brown text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                By Category
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <p className="text-yellow-800">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="ml-auto text-yellow-700 hover:text-yellow-900 font-medium text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="h-6 w-6 border-2 border-brown border-t-transparent rounded-full animate-spin"></div>
                <span>Finding perfect books for you...</span>
              </div>
            </div>
          )}

          {/* Recommendations Grid */}
          {!loading && recommendations.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {activeTab === "author"
                    ? "More Books by Your Favorite Authors"
                    : "More Books in Your Favorite Categories"}
                </h3>
                <button
                  onClick={loadRecommendations}
                  className="text-brown hover:text-dark-brown font-medium text-sm flex items-center gap-1"
                >
                  🔄 Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendations.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading &&
            recommendations.length === 0 &&
            !error &&
            favoriteBooks.length > 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-600">
                  No recommendations available right now.
                </p>
                <button
                  onClick={loadRecommendations}
                  className="mt-4 px-4 py-2 bg-brown text-white rounded-lg hover:bg-dark-brown transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
        </div>
      </div>

      {/* Save Popup */}
      {showSavePopup && selectedBook && (
        <SavePopup
          bookId={selectedBook.id}
          bookTitle={selectedBook.volumeInfo?.title || "Unknown Title"}
          bookAuthors={selectedBook.volumeInfo?.authors || ["Unknown Author"]}
          onClose={handleCloseSavePopup}
          onSave={handleCloseSavePopup}
        />
      )}
    </>
  );
}

export default Recommendations;
