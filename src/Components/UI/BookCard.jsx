import React, { useState } from "react";
import SavePopup from "../Sections/SavePopup";

function BookCard({ book, showAddButton = true }) {
  const [showSavePopup, setShowSavePopup] = useState(false);

  // Get book details
  const title = book.volumeInfo?.title || "Unknown Title";
  const authors = book.volumeInfo?.authors || ["Unknown Author"];
  const thumbnail =
    book.volumeInfo?.imageLinks?.thumbnail || "/placeholder-book.jpg";
  const publishedDate = book.volumeInfo?.publishedDate || "";
  const categories = book.volumeInfo?.categories || [];
  const averageRating = book.volumeInfo?.averageRating || 0;
  const pageCount = book.volumeInfo?.pageCount || 0;

  // Handle add to library
  const handleAddToLibrary = () => {
    setShowSavePopup(true);
  };

  // Close save popup
  const handleCloseSavePopup = () => {
    setShowSavePopup(false);
  };

  // Handle successful save
  const handleSaveSuccess = () => {
    setShowSavePopup(false);
    // You could add additional success handling here
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Book Cover */}
        <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder-book.jpg";
            }}
          />
        </div>

        {/* Book Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm">
            {title}
          </h3>

          {/* Authors */}
          <p className="text-sm text-gray-600 line-clamp-1 mb-2">
            by {authors.join(", ")}
          </p>

          {/* Rating and Pages */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            {averageRating > 0 && (
              <div className="flex items-center">
                <span className="text-yellow-500">⭐</span>
                <span className="ml-1">{averageRating.toFixed(1)}</span>
              </div>
            )}
            {pageCount > 0 && <span>{pageCount} pages</span>}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-3">
              <span className="inline-block bg-brown/10 text-brown text-xs px-2 py-1 rounded-full">
                {categories[0].split("/")[0]}
              </span>
            </div>
          )}

          {/* Published Date */}
          {publishedDate && (
            <p className="text-xs text-gray-400 mb-3">
              Published {publishedDate.substring(0, 4)}
            </p>
          )}

          {/* Add Button */}
          {showAddButton && (
            <button
              onClick={handleAddToLibrary}
              className="w-full bg-brown hover:bg-dark-brown text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200"
            >
              Add to Library
            </button>
          )}
        </div>
      </div>

      {/* Save Popup */}
      {showSavePopup && (
        <SavePopup
          bookId={book.id}
          bookTitle={title}
          bookAuthors={authors}
          onClose={handleCloseSavePopup}
          onSave={handleSaveSuccess}
        />
      )}
    </>
  );
}

export default BookCard;
