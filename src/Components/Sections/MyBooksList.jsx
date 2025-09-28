import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthGoogleContext } from "../../Contexts/AuthGoogleContext";
import { AuthAPI } from "../../Utils/authApi";

// Filter options for the buttons
const FILTER_OPTIONS = [
  { key: "all", label: "All Shelves", icon: "📚" },
  { key: "favorites", label: "Favorites", icon: "⭐" },
  { key: "want-to-read", label: "Want to Read", icon: "📕" },
  { key: "currently-reading", label: "Currently Reading", icon: "📖" },
  { key: "finished", label: "Finished", icon: "✅" },
];

// Normalize shelf titles/IDs to our filter keys
function normalizeShelfKey(shelf) {
  const title = (shelf?.title || "").trim().toLowerCase();
  const id = String(shelf?.id ?? "");

  // Match by known titles
  if (title === "favorites") return "favorites";
  if (title === "to read" || title === "want to read") return "want-to-read";
  if (title === "reading now" || title === "currently reading")
    return "currently-reading";
  if (title === "have read" || title === "finished" || title === "read")
    return "finished";

  // Fallback by Google's default IDs
  if (id === "0") return "favorites";
  if (id === "2") return "want-to-read";
  if (id === "3") return "currently-reading";
  if (id === "4") return "finished";

  return "other";
}

// Book Card Component with Move Functionality
function BookCard({
  book,
  currentShelfId,
  shelves,
  onMove,
  onFavorite,
  onRemove, // New prop
  isFavorited,
  isLoadingFav,
}) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false); // New state

  // Handle moving book to different shelf
  const handleMoveBook = async (targetShelfId, targetShelfTitle) => {
    setIsMoving(true);
    try {
      const result = await onMove(
        book.id,
        currentShelfId,
        targetShelfId,
        book.volumeInfo?.title
      );
      if (result.success) {
        setShowMoveMenu(false);
        // Show success message
        const message = ` Moved "${book.volumeInfo?.title}" to ${targetShelfTitle}`;
        showNotification(message);
      } else {
        showNotification(` Failed to move book: ${result.error}`, "error");
      }
    } catch (error) {
      showNotification("Failed to move book. Please try again.", "error");
    } finally {
      setIsMoving(false);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await onFavorite(book.id, book.volumeInfo?.title, book.volumeInfo?.authors);
  };

  // Handle removing book from current shelf
  const handleRemoveBook = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsRemoving(true);
    try {
      const result = await onRemove(
        book.id,
        currentShelfId,
        book.volumeInfo?.title
      );
      if (result.success) {
        setShowMoveMenu(false);
        showNotification(`Removed "${book.volumeInfo?.title}" from shelf`);
      } else {
        showNotification(`Failed to remove book: ${result.error}`, "error");
      }
    } catch (error) {
      showNotification("Failed to remove book. Please try again.", "error");
    } finally {
      setIsRemoving(false);
    }
  };

  // Show notification helper
  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
      type === "error" ? "bg-dark-brown" : "bg-brown"
    } text-white`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Generate stars for rating
  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= rating;

      return (
        <div key={index} className="w-3 h-3">
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

  return (
    <Link
      to={`/book/${book.id}`}
      className="bg-white rounded-xl p-3 hover:scale-105 h-[500px] transition-all duration-300 block relative group"
    >
      {/* Book Cover Section */}
      <div className="relative mb-2">
        <div className="bg-gray-200 rounded-lg w-full h-64 flex items-center justify-center overflow-hidden">
          {book.volumeInfo?.imageLinks?.thumbnail ? (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={`${book.volumeInfo?.title} cover`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Action Buttons - Show on Hover */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Favorite Heart Icon */}
          <button
            onClick={handleFavoriteToggle}
            disabled={isLoadingFav}
            className={`
              bg-white rounded-md p-1 shadow-md hover:shadow-lg transition-all
              ${
                isLoadingFav
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-110"
              }
            `}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            {isLoadingFav ? (
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

          {/* Move Menu Button */}
          {shelves.length > 1 && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMoveMenu(!showMoveMenu);
                }}
                className="bg-white rounded-md p-1 shadow-md hover:shadow-lg transition-all hover:scale-110"
                title="Move or remove book"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>

              {/* Move/Remove Dropdown Menu */}
              {showMoveMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-[150px]">
                  <div className="p-2">
                    {/* Remove Button */}
                    <button
                      onClick={handleRemoveBook}
                      disabled={isRemoving}
                      className="w-full text-left px-2 py-2 text-sm hover:bg-red-50 rounded flex items-center gap-2 disabled:opacity-50 text-red-600 hover:text-red-700 border-b border-gray-100 mb-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove from shelf
                      {isRemoving && (
                        <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin ml-auto"></div>
                      )}
                    </button>

                    {/* Move to section */}
                    <div className="text-xs font-medium text-gray-500 mb-1 mt-2">
                      Move to:
                    </div>
                    {shelves
                      .filter((shelf) => shelf.id !== currentShelfId)
                      .map((shelf) => (
                        <button
                          key={shelf.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMoveBook(shelf.id, shelf.title);
                          }}
                          disabled={isMoving}
                          className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2 disabled:opacity-50"
                        >
                          <span>
                            {normalizeShelfKey(shelf) === "favorites" && "⭐"}
                            {normalizeShelfKey(shelf) === "want-to-read" &&
                              "📕"}
                            {normalizeShelfKey(shelf) === "currently-reading" &&
                              "📖"}
                            {normalizeShelfKey(shelf) === "finished" && "✅"}
                            {normalizeShelfKey(shelf) === "other" && "📚"}
                          </span>
                          {shelf.title}
                          {isMoving && (
                            <div className="w-3 h-3 border-2 border-brown border-t-transparent rounded-full animate-spin ml-auto"></div>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Book Info */}
      <div className="text-center mb-2">
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
          {book.volumeInfo?.title?.length >= 20
            ? book.volumeInfo.title.slice(0, 15) + "..."
            : book.volumeInfo?.title || "Untitled"}
        </h3>
        <p className="text-gray-600 text-sm">
          {book.volumeInfo?.authors?.[0]?.length >= 10
            ? book.volumeInfo.authors[0].slice(0, 10) + "..."
            : book.volumeInfo?.authors?.[0] || "Unknown Author"}
        </p>
      </div>

      {/* Rating Display */}
      <div className="flex justify-center mb-2">
        {renderStars(book.volumeInfo?.averageRating)}
      </div>

      {/* Read Button */}
      <div className="text-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `/book/${book.id}/read`;
          }}
          className="w-full bg-brown hover:bg-dark-brown text-white py-1.5 px-2 rounded-md text-sm font-medium transition-colors"
        >
          Read Now
        </button>
      </div>
    </Link>
  );
}

function MyBooksList() {
  const { user, isAuth, loading: authLoading } = useContext(AuthGoogleContext);

  // State management
  const [shelvesData, setShelvesData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedShelf, setExpandedShelf] = useState(null);
  const [shelfBooks, setShelfBooks] = useState({});
  const [booksLoading, setBooksLoading] = useState({});
  const [favoritesMap, setFavoritesMap] = useState({}); // Track favorite status
  const [favoritesLoading, setFavoritesLoading] = useState({}); // Track loading state

  // Filter shelves based on active filter
  const getFilteredShelves = () => {
    if (activeFilter === "all") {
      // Filter out empty shelves and only show main shelves
      return shelvesData.filter((shelf) => {
        const shelfKey = normalizeShelfKey(shelf);
        const isMainShelf = [
          "favorites",
          "want-to-read",
          "currently-reading",
          "finished",
        ].includes(shelfKey);
        // Always show favorites shelf regardless of volumeCount, check others normally
        const hasBooks =
          shelfKey === "favorites" || (shelf.volumeCount ?? 0) > 0;
        return isMainShelf && hasBooks;
      });
    }
    return shelvesData.filter(
      (shelf) => normalizeShelfKey(shelf) === activeFilter
    );
  };

  // Get active shelf for single shelf view
  const getActiveShelf = () => {
    if (activeFilter === "all") return null;
    return (
      shelvesData.find((shelf) => normalizeShelfKey(shelf) === activeFilter) ||
      null
    );
  };

  // Load My Library shelves using AuthAPI
  const loadShelves = async () => {
    if (!isAuth) return;

    setLoading(true);
    setError("");

    try {
      const response = await AuthAPI.getShelves();
      const shelves =
        response.data?.items.filter(
          (shelf) =>
            shelf.id == 0 || shelf.id == 2 || shelf.id == 3 || shelf.id == 4
        ) ?? [];

      setShelvesData(shelves);
    } catch (e) {
      console.error("Error loading shelves:", e);
      setShelvesData([]);
      setError(
        e?.message ||
          "Failed to load shelves. Please ensure you're signed in with Google Books access."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load books for specific shelf using AuthAPI
  const loadShelfBooks = async (shelfId, shelfTitle = "") => {
    setBooksLoading((prev) => ({ ...prev, [shelfId]: true }));

    try {
      const response = await AuthAPI.getShelfVolumes(shelfId);
      const books = response.data?.items ?? [];

      setShelfBooks((prev) => ({ ...prev, [shelfId]: books }));

      // Load favorite status for each book
      loadFavoriteStatus(books);
    } catch (e) {
      console.error(`Error loading books for shelf ${shelfId}:`, e);
      setShelfBooks((prev) => ({ ...prev, [shelfId]: [] }));
    } finally {
      setBooksLoading((prev) => ({ ...prev, [shelfId]: false }));
    }
  };

  // Load favorite status for books
  const loadFavoriteStatus = async (books) => {
    try {
      const favoritesResponse = await AuthAPI.getShelfVolumes(0); // Favorites shelf
      const favoriteBooks = favoritesResponse.data?.items || [];
      const favoriteIds = favoriteBooks.map((book) => book.id);

      const newFavoritesMap = {};
      books.forEach((book) => {
        newFavoritesMap[book.id] = favoriteIds.includes(book.id);
      });

      setFavoritesMap((prev) => ({ ...prev, ...newFavoritesMap }));
    } catch (error) {
      console.warn("Failed to load favorite status:", error);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (bookId, title, authors) => {
    setFavoritesLoading((prev) => ({ ...prev, [bookId]: true }));

    try {
      const currentlyFavorited = favoritesMap[bookId] || false;
      const newFavoriteState = !currentlyFavorited;

      const result = await AuthAPI.trackFavorite(
        bookId,
        title,
        authors,
        newFavoriteState
      );

      if (result.success) {
        setFavoritesMap((prev) => ({ ...prev, [bookId]: newFavoriteState }));

        // Show success message
        const message = newFavoriteState
          ? ` "${title}" added to favorites!`
          : ` "${title}" removed from favorites!`;

        showNotification(message);

        // Refresh shelves to update counts
        await loadShelves();
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
      showNotification("Failed to update favorite. Please try again.", "error");
    } finally {
      setFavoritesLoading((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  // Handle moving books between shelves
  const handleMoveBook = async (
    volumeId,
    fromShelfId,
    toShelfId,
    bookTitle
  ) => {
    try {
      const result = await AuthAPI.moveBookBetweenShelves(
        volumeId,
        fromShelfId,
        toShelfId,
        bookTitle
      );

      if (result.success) {
        // Refresh affected shelves
        if (fromShelfId) {
          await loadShelfBooks(fromShelfId);
        }
        await loadShelfBooks(toShelfId);

        // Refresh shelf counts
        await loadShelves();

        return { success: true };
      }

      return result;
    } catch (error) {
      console.error("Failed to move book:", error);
      return { success: false, error: error.message };
    }
  };

  // Remove book from shelf
  const handleRemoveBook = async (volumeId, shelfId, bookTitle) => {
    try {
      await AuthAPI.removeVolume(shelfId, volumeId);

      // Refresh the current shelf
      await loadShelfBooks(shelfId);

      // Refresh shelf counts
      await loadShelves();

      return { success: true };
    } catch (error) {
      console.error("Failed to remove book:", error);
      return { success: false, error: error.message };
    }
  };

  // Show notification helper
  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
      type === "error" ? "bg-dark-brown" : "bg-brown"
    } text-white`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Handle filter button clicks
  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setExpandedShelf(null); // Reset expanded shelf when changing filters

    // Auto-load books if switching to a specific shelf
    if (filterKey !== "all") {
      const targetShelf = shelvesData.find(
        (shelf) => normalizeShelfKey(shelf) === filterKey
      );
      if (targetShelf && !shelfBooks[targetShelf.id]) {
        loadShelfBooks(targetShelf.id, targetShelf.title);
      }
    }
  };

  // Toggle shelf expansion (for "all" view)
  const toggleShelf = (shelf) => {
    const newExpandedShelf = expandedShelf === shelf.id ? null : shelf.id;
    setExpandedShelf(newExpandedShelf);

    // Load books if expanding and not already loaded
    if (newExpandedShelf && !shelfBooks[shelf.id]) {
      loadShelfBooks(shelf.id, shelf.title);
    }
  };

  // Load shelves when component mounts or authentication changes
  useEffect(() => {
    if (isAuth && !authLoading) {
      loadShelves();
    }
  }, [isAuth, authLoading]);

  // Render authentication check
  if (!isAuth) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            My Books Library
          </h2>
          <p className="text-gray-600 mb-4">
            Sign in with Google to access your personal book shelves and reading
            collection.
          </p>
          <div className="text-gray-400">📚 Your books are waiting...</div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="h-6 w-6 rounded-full border-2 border-brown border-b-transparent animate-spin"></div>
            <span>Loading your library...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-red-800 mb-2">
            Error Loading Library
          </h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
        <button
          onClick={loadShelves}
          className="px-4 py-2 bg-brown text-white rounded-lg hover:bg-brown-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const filteredShelves = getFilteredShelves();
  const activeShelf = getActiveShelf();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Books Library</h2>
        <button
          onClick={loadShelves}
          className="text-brown hover:text-brown-dark font-medium text-sm self-start sm:self-auto"
        >
          Refresh Library
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_OPTIONS.map((option) => {
          const isActive = activeFilter === option.key;
          const count =
            option.key === "all"
              ? filteredShelves.length
              : shelvesData.find(
                  (shelf) => normalizeShelfKey(shelf) === option.key
                )?.volumeCount ?? 0;

          return (
            <button
              key={option.key}
              onClick={() => handleFilterChange(option.key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-brown text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
              {count > 0 && (
                <span
                  className={`
                  px-2 py-0.5 rounded-full text-xs
                  ${
                    isActive
                      ? "bg-white text-brown"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content based on active filter */}
      {activeFilter !== "all" ? (
        // SINGLE SHELF VIEW
        <div>
          {!activeShelf ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No shelf found for "{activeFilter.replace("-", " ")}"
              </p>
              <button
                onClick={() => handleFilterChange("all")}
                className="mt-2 text-brown hover:text-brown-dark font-medium"
              >
                View All Shelves
              </button>
            </div>
          ) : (
            <div>
              {/* Single shelf header */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activeShelf.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {activeShelf.volumeCount ?? 0} books
                  </p>
                </div>
              </div>

              {/* Books grid */}
              {booksLoading[activeShelf.id] ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="h-5 w-5 rounded-full border-2 border-brown border-b-transparent animate-spin"></div>
                    <span>Loading books...</span>
                  </div>
                </div>
              ) : (shelfBooks[activeShelf.id] ?? []).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📖</div>
                  <p className="text-gray-500">No books in this shelf yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {(shelfBooks[activeShelf.id] ?? []).map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      currentShelfId={activeShelf.id}
                      shelves={shelvesData}
                      onMove={handleMoveBook}
                      onFavorite={handleFavoriteToggle}
                      onRemove={handleRemoveBook} // Add this prop
                      isFavorited={favoritesMap[book.id] || false}
                      isLoadingFav={favoritesLoading[book.id] || false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // ALL SHELVES VIEW
        <div>
          {filteredShelves.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-gray-500">No shelves found in your library.</p>
              <p className="text-gray-400 text-sm mt-2">
                Start adding books to create your collection!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShelves.map((shelf) => (
                <div
                  key={shelf.id}
                  className="bg-white border rounded-lg shadow-sm"
                >
                  <button
                    onClick={() => toggleShelf(shelf)}
                    className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {normalizeShelfKey(shelf) === "favorites" && "⭐"}
                        {normalizeShelfKey(shelf) === "want-to-read" && "📖"}
                        {normalizeShelfKey(shelf) === "currently-reading" &&
                          "📕"}
                        {normalizeShelfKey(shelf) === "finished" && "✅"}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {shelf.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shelf.volumeCount ?? 0} books
                        </div>
                      </div>
                    </div>
                    <span className="text-brown text-lg">
                      {expandedShelf === shelf.id ? "▼" : "▶"}
                    </span>
                  </button>

                  {expandedShelf === shelf.id && (
                    <div className="border-t px-6 py-4">
                      {booksLoading[shelf.id] ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="h-4 w-4 rounded-full border-2 border-brown border-b-transparent animate-spin"></div>
                          <span>Loading books...</span>
                        </div>
                      ) : (shelfBooks[shelf.id] ?? []).length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No books in this shelf.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                          {(shelfBooks[shelf.id] ?? []).map((book) => (
                            <BookCard
                              key={book.id}
                              book={book}
                              currentShelfId={shelf.id}
                              shelves={shelvesData}
                              onMove={handleMoveBook}
                              onFavorite={handleFavoriteToggle}
                              onRemove={handleRemoveBook} // Add this prop
                              isFavorited={favoritesMap[book.id] || false}
                              isLoadingFav={favoritesLoading[book.id] || false}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyBooksList;
