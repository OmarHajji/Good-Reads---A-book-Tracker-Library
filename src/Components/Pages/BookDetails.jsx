import React, { useState, useEffect, useRef } from "react";
import api from "../../Utils/api";
import Container from "../UI/Container";
import { Link } from "react-router";
import SavePopup from "../Sections/SavePopup";

function BookDetails() {
  const [bookDetails, setBookDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const linkCopied = useRef();
  const bookId = window.location.pathname.split("/").pop();

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        setLoading(true);
        const res = await api.get(`${bookId}`);
        const data = res.data;
        const { volumeInfo, saleInfo, accessInfo } = data;
        setBookDetails({
          id: data.id,
          title: volumeInfo.title || "No title",
          subtitle: volumeInfo.subtitle || "",
          publisher: volumeInfo.publisher || "Unknown",
          description: volumeInfo.description || "No description available.",
          authors: volumeInfo.authors?.map((author) => author) || ["Unknown"],
          publishedDate: volumeInfo.publishedDate || "Unknown",
          cover:
            volumeInfo.imageLinks?.extraLarge?.replace("http://", "https://") ||
            volumeInfo.imageLinks?.large?.replace("http://", "https://") ||
            volumeInfo.imageLinks?.medium?.replace("http://", "https://") ||
            volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") ||
            null,
          pageCount: volumeInfo.pageCount || 0,
          categories: volumeInfo.categories?.[0] || [],
          averageRating: volumeInfo.averageRating || 0,
          ratingsCount: volumeInfo.ratingsCount || 0,
          price: `$${(saleInfo.listPrice?.amount || 0).toFixed(2)}`,
          buyLink: saleInfo.buyLink || null,
          saleability: saleInfo.saleability || "NOT_FOR_SALE",
          epub: accessInfo.epub?.isAvailable || false,
          pdf: accessInfo.pdf?.isAvailable || false,
          webReaderLink: accessInfo.webReaderLink || null,
          viewability: accessInfo.viewability || "NO_PAGES",
          publicDomain: accessInfo.publicDomain || false,
        });
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookDetails();
  }, []);

  const handleSaveBook = () => {
    setShowSavePopup(true);
  };

  const handleSaveClose = () => {
    setShowSavePopup(false);
  };

  const handleSaveSuccess = (shelves) => {
    // You can add additional logic here if needed
  };

  return (
    <Container className="py-8 max-w-4xl">
      <Link
        to={`/categories`}
        className="flex items-center mb-4 gap-2 text-brown hover:text-dark-brown transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Categories
      </Link>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brown"></div>
          <p className="text-zinc-700 mt-3 text-center">Loading...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start justify-between border-b border-gray-200 pb-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {bookDetails.title}
                </h1>
                {bookDetails.subtitle && (
                  <span className="text-lg sm:text-xl text-gray-600">
                    ({bookDetails.subtitle})
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <img src="/Star.png" alt="Rating" className="w-4 h-4" />
                <span className="text-sm text-gray-600">
                  {bookDetails.averageRating} - {bookDetails.ratingsCount}{" "}
                  reviews
                </span>
              </div>
            </div>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() =>
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => {
                      linkCopied.current.classList.remove("hidden");
                      setTimeout(() => {
                        linkCopied.current.classList.add("hidden");
                      }, 1500);
                    })
                }
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <img src="/share.png" alt="Share" className="w-4 h-4" />
                Share
              </button>
              <p
                ref={linkCopied}
                className="hidden absolute top-full right-0 mt-2 px-3 py-1 bg-dark-brown text-white text-sm rounded shadow-lg z-10"
              >
                Copied!
              </p>
            </div>
          </div>
          {/* Book Cover - Full Width */}
          <div className="w-full">
            {bookDetails.cover ? (
              <div className="w-full h-80 bg-teal-600 rounded-lg flex items-center justify-center overflow-hidden relative">
                <img
                  src={bookDetails.cover}
                  alt={bookDetails.title}
                  className="h-72 max-w-[200px] object-contain   rotate-5 rounded shadow-lg"
                />
                {/* Overlay design elements to match the teal background */}
                <div className="absolute inset-0 bg-teal-500 -z-10"></div>
              </div>
            ) : (
              <div className="w-full h-80 bg-teal-500 rounded-lg flex items-center justify-center">
                <p className="text-white text-lg">No Cover Available</p>
              </div>
            )}
          </div>
          {/* Description Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Description
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Description Text */}
              <div className="lg:col-span-2">
                <div
                  className="text-gray-700 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: bookDetails.description.replace(/<[^>]*>/g, ""),
                  }}
                />
              </div>

              {/* Action Buttons - Right Side */}
              <div className="lg:col-span-1">
                <div className="space-y-3">
                  {bookDetails.webReaderLink && (
                    <Link
                      to={`/book/${bookDetails.id}/read`}
                      className="w-full flex items-center justify-between bg-brown hover:bg-dark-brown text-white px-6 py-3 rounded-md font-medium transition-colors text-center"
                    >
                      Want to read <img src="/white-icon.png" alt="" />
                    </Link>
                  )}

                  {bookDetails.buyLink &&
                    bookDetails.saleability === "FOR_SALE" && (
                      <button
                        onClick={() =>
                          window.open(bookDetails.buyLink, "_blank")
                        }
                        className="flex items-center justify-between w-full bg-transparent hover:bg-gray-50  border border-gray-300 px-6 py-3 rounded-md font-medium transition-colors text-center"
                      >
                        Buy now <img src="/black-icon.png" alt="" />
                      </button>
                    )}
                  <button
                    onClick={handleSaveBook}
                    className="flex items-center justify-center gap-2 bg-brown hover:bg-dark-brown text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Save to Library
                  </button>
                </div>

                {/* Reading Status */}
                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-2">
                      <img
                        src="/Author1.png"
                        alt="Reader"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                      <img
                        src="/Author2.png"
                        alt="Reader"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                      <img
                        src="/Author3.png"
                        alt="Reader"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                      <img
                        src="/Author4.png"
                        alt="Reader"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      257 people are currently reading
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    +52% people want to read it
                  </div>
                </div>

                {/* Formats Available */}
              </div>
            </div>

            {/* Authors Section - Below Description */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Authors</h4>
              <div className="flex flex-wrap gap-3 mb-6">
                {bookDetails.authors.map((author, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div>
                      <p className="font-medium text-gray-900">{author}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Book Info - Horizontal */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <span className="block text-gray-600">Publisher</span>
                  <span className="font-medium text-gray-900">
                    {bookDetails.publisher}
                  </span>
                  <p className="text-sm text-gray-600">
                    Published: {bookDetails.publishedDate}
                  </p>
                </div>
                <div className="text-center">
                  <span className="block text-gray-600">Pages</span>
                  <span className="font-medium text-gray-900">
                    {bookDetails.pageCount}
                  </span>
                </div>
                {bookDetails.categories && (
                  <div className="text-center">
                    <span className="block text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">
                      {bookDetails.categories}
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <span className="block text-gray-600">Rating</span>
                  <span className="font-medium text-gray-900">
                    {bookDetails.averageRating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSavePopup && (
        <SavePopup
          bookId={bookId}
          bookTitle={bookDetails?.title || ""}
          bookAuthors={bookDetails?.authors || []}
          onClose={handleSaveClose}
          onSave={handleSaveSuccess}
        />
      )}
    </Container>
  );
}

export default BookDetails;
