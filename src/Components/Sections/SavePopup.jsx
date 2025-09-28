import React, { useState, useEffect, useContext } from "react";
import { AuthAPI } from "../../Utils/authApi";
import { AuthGoogleContext } from "../../Contexts/AuthGoogleContext";

function SavePopup({ bookId, bookTitle, bookAuthors, onClose, onSave }) {
  const { isAuth } = useContext(AuthGoogleContext);
  const [selectedShelves, setSelectedShelves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shelves, setShelves] = useState([]);
  const [error, setError] = useState("");

  // Main shelf configuration
  const MAIN_SHELVES = [
    { id: "0", title: "Favorites", icon: "⭐" },
    { id: "2", title: "Want to read", icon: "📖" },
    { id: "3", title: "Currently reading", icon: "📕" },
    { id: "4", title: "Have read", icon: "✅" },
  ];

  // Load user's shelves and current book status
  useEffect(() => {
    if (isAuth) {
      loadShelvesAndStatus();
    } else {
      setError("Please sign in to access your shelves");
    }
  }, [bookId, isAuth]);

  const loadShelvesAndStatus = async () => {
    setLoading(true);
    setError("");

    try {

      
      // Load user's actual shelves from API
      const response = await AuthAPI.getShelves();
      const userShelves = response.data?.items ?? [];

      // Create shelves array from main shelves, updating with API data where available
      const finalShelves = MAIN_SHELVES.map((mainShelf) => {
        const apiShelf = userShelves.find((shelf) => shelf.id === mainShelf.id);
        return {
          ...mainShelf,
          volumeCount: apiShelf?.volumeCount || 0,
          title: apiShelf?.title || mainShelf.title, // Use API title if available
        };
      });
      setShelves(finalShelves);

      // Check which shelves currently contain this book
      await checkCurrentBookStatus();
    } catch (error) {
      console.error("Failed to load shelves:", error);
      setError("Failed to load shelves. Please check your connection.");
      // Still show main shelves even if API fails
      setShelves(MAIN_SHELVES.map((shelf) => ({ ...shelf, volumeCount: 0 })));
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentBookStatus = async () => {
    const currentShelves = [];

    for (const shelf of shelves.length > 0 ? shelves : MAIN_SHELVES) {
      try {
        const booksResponse = await AuthAPI.getShelfVolumes(shelf.id);
        const books = booksResponse.data?.items ?? [];

        if (books.some((book) => book.id === bookId)) {
          currentShelves.push(shelf.id);
        }
      } catch (error) {
        console.warn(`Failed to check shelf ${shelf.id}:`, error);
      }
    }

    setSelectedShelves(currentShelves);
  };

  const toggleShelf = (shelfId) => {
    setSelectedShelves((prev) =>
      prev.includes(shelfId)
        ? prev.filter((id) => id !== shelfId)
        : [...prev, shelfId]
    );
  };

  const handleSave = async () => {
    if (!isAuth) {
      showNotification("Please sign in to save books", "error");
      return;
    }

    setSaving(true);

    try {
      // Get current shelf status
      const initialShelves = [];

      for (const shelf of MAIN_SHELVES) {
        try {
          const booksResponse = await AuthAPI.getShelfVolumes(shelf.id);
          const books = booksResponse.data?.items ?? [];
          if (books.some((book) => book.id === bookId)) {
            initialShelves.push(shelf.id);
          }
        } catch (error) {
          console.warn(`Failed to check shelf ${shelf.id}:`, error);
        }
      }

      // Calculate changes needed
      const toAdd = selectedShelves.filter(
        (id) => !initialShelves.includes(id)
      );
      const toRemove = initialShelves.filter(
        (id) => !selectedShelves.includes(id)
      );

      let successCount = 0;
      let errorCount = 0;


      // Add to new shelves
      for (const shelfId of toAdd) {
        try {
          await AuthAPI.addVolume(shelfId, bookId);
          successCount++;
          const shelfName =
            shelves.find((s) => s.id === shelfId)?.title || "shelf";
        } catch (error) {
          errorCount++;
          console.error(`❌ Failed to add to shelf ${shelfId}:`, error);
        }
      }

      // Remove from old shelves
      for (const shelfId of toRemove) {
        try {
          await AuthAPI.removeVolume(shelfId, bookId);
          successCount++;
          const shelfName =
            shelves.find((s) => s.id === shelfId)?.title || "shelf";
        } catch (error) {
          errorCount++;
          console.error(` Failed to remove from shelf ${shelfId}:`, error);
        }
      }

      // Show result and close popup
      if (errorCount === 0 && (toAdd.length > 0 || toRemove.length > 0)) {
        showNotification(
          `Successfully updated "${bookTitle}" in your library!`
        );
        onSave && onSave(selectedShelves);
        onClose();
      } else if (successCount > 0) {
        showNotification(
          ` Partially saved "${bookTitle}" (${successCount} succeeded, ${errorCount} failed)`,
          "warning"
        );
      } else if (toAdd.length === 0 && toRemove.length === 0) {
        showNotification(`ℹ️ No changes needed for "${bookTitle}"`, "info");
        onClose();
      } else {
        showNotification(` Failed to save "${bookTitle}" to library`, "error");
      }
    } catch (error) {
      console.error("Error saving book:", error);
      showNotification(` Failed to save book: ${error.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    const bgColor =
      type === "error"
        ? "bg-red-600"
        : type === "warning"
        ? "bg-yellow-600"
        : type === "info"
        ? "bg-blue-600"
        : "bg-green-600";

    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${bgColor} text-white max-w-sm`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  };

  if (!isAuth) {
    return (
      <div className="fixed inset-0 flex bg-black items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to save books to your library.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brown text-white rounded hover:bg-dark-brown transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Show shelves to use (either loaded ones or main shelves as fallback)
  const displayShelves =
    shelves.length > 0
      ? shelves
      : MAIN_SHELVES.map((shelf) => ({ ...shelf, volumeCount: 0 }));

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="rounded-t-lg">
          <div className="flex items-center gap-3 p-4">
            <div className="w-8 h-8  rounded flex items-center justify-center">
              <img src="/popup.png" alt="" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Save to your bookshelf
              </h2>
              <p className="text-sm text-gray-600 line-clamp-1">{bookTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
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

          <div className="px-4 py-3 border-b border-dotted border-gray-300">
            <p className="text-sm text-gray-600">
              Choose the bookshelves you want to add to:
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}

        {/* Bookshelf Options */}
        <div className="p-4 space-y-0 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="h-4 w-4 rounded-full border-2 border-brown border-b-transparent animate-spin"></div>
                <span>Loading shelves...</span>
              </div>
            </div>
          ) : (
            displayShelves.map((shelf) => (
              <div
                key={shelf.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer rounded transition-colors"
                onClick={() => toggleShelf(shelf.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{shelf.icon}</span>
                  <div>
                    <span className="text-gray-700 font-medium">
                      {shelf.title}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                    selectedShelves.includes(shelf.id)
                      ? "bg-brown border-brown"
                      : "border-gray-300 bg-gray-100 hover:border-brown"
                  }`}
                >
                  {selectedShelves.includes(shelf.id) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-brown hover:text-dark-brown transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2 bg-brown text-white rounded hover:bg-dark-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SavePopup;
