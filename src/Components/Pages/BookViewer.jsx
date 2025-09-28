import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router";
import api from "../../Utils/api";
import { AuthAPI } from "../../Utils/authApi";
import { AuthGoogleContext } from "../../Contexts/AuthGoogleContext";
import Container from "../UI/Container";

function BookViewer() {
  const { bookId } = useParams();
  const { isAuth } = useContext(AuthGoogleContext);
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookShelfStatus, setBookShelfStatus] = useState(null);

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`${bookId}`);
        const data = res.data;
        const { volumeInfo, accessInfo } = data;

        const bookData = {
          id: data.id,
          title: volumeInfo.title || "No title",
          authors: volumeInfo.authors || ["Unknown Author"],
          webReaderLink: accessInfo.webReaderLink || null,
          previewLink: accessInfo.previewLink || null,
          viewability: accessInfo.viewability || "NO_PAGES",
          embeddable: accessInfo.embeddable || false,
          publicDomain: accessInfo.publicDomain || false,
          cover:
            volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") ||
            null,
        };

        setBookDetails(bookData);

        // Check book status for display purposes only
        if (isAuth) {
          await checkBookShelfStatus(bookData);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to load book details");
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId, isAuth]);

  // Check if book is already in any shelf (for display only)
  const checkBookShelfStatus = async (bookData) => {
    try {
      const response = await AuthAPI.getShelves();
      const shelves = response.data?.items || [];

      let currentShelf = null;

      // Check each shelf for this book
      for (const shelf of shelves) {
        try {
          const shelfResponse = await AuthAPI.getShelfVolumes(shelf.id);
          const books = shelfResponse.data?.items || [];

          if (books.some((book) => book.id === bookData.id)) {
            currentShelf = {
              id: shelf.id,
              title: shelf.title,
            };
            break;
          }
        } catch (error) {
          console.warn(`Failed to check shelf ${shelf.title}:`, error);
        }
      }

      setBookShelfStatus(currentShelf);
    } catch (error) {
      console.warn("Failed to check book shelf status:", error);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brown"></div>
          <p className="text-zinc-700 mt-3 text-center">
            Loading book viewer...
          </p>
        </div>
      </Container>
    );
  }

  if (error || !bookDetails) {
    return (
      <Container className="py-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Book Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "This book is not available for viewing."}
          </p>
          <Link
            to="/categories"
            className="bg-brown hover:bg-dark-brown text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Browse Other Books
          </Link>
        </div>
      </Container>
    );
  }

  // Check if book is viewable
  const isViewable =
    bookDetails.viewability === "ALL_PAGES" ||
    bookDetails.viewability === "PARTIAL" ||
    bookDetails.publicDomain ||
    bookDetails.embeddable;

  return (
    <Container className="py-4 max-w-7xl">
      <div className="mb-6 flex justify-between items-center">
        <Link
          to={`/book/${bookId}`}
          className="flex items-center gap-2 text-brown hover:text-dark-brown transition-colors"
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
          Back to Details
        </Link>

        {/* Show current shelf status */}
        {bookShelfStatus && (
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            In: {bookShelfStatus.title}
          </div>
        )}
      </div>

      {/* Book Viewer */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
        {isViewable ? (
          <div className="w-full relative">
            {bookDetails.webReaderLink ? (
              <div className="relative w-full h-[800px] overflow-hidden">
                <iframe
                  src={`https://books.google.com/books?id=${bookId}&lpg=PP1&pg=PP1&output=embed&hl=en&ie=UTF-8&oe=UTF-8`}
                  width="100%"
                  height="820"
                  title={`${bookDetails.title} - Book Viewer`}
                  className="w-full h-[820px] border-0"
                />
                {/* Overlay to hide Google branding at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-white pointer-events-none z-10"></div>
              </div>
            ) : bookDetails.previewLink ? (
              <div className="relative w-full h-[800px] overflow-hidden">
                <iframe
                  src={`${bookDetails.previewLink}&hl=en&ie=UTF-8&oe=UTF-8`}
                  width="100%"
                  height="820"
                  title={`${bookDetails.title} - Preview`}
                  className="w-full h-[820px] border-0"
                />
                {/* Overlay to hide Google branding at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-white pointer-events-none z-10"></div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Book Viewer Loading...
                  </h3>
                  <p className="text-gray-600">
                    If the book doesn't load, try opening it in Google Books.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Preview Not Available
              </h3>
              <p className="text-gray-600 mb-6">
                This book is not available for preview. You may be able to find
                it on external platforms.
              </p>

              <div className="space-y-3">
                {bookDetails.webReaderLink && (
                  <button
                    onClick={() =>
                      window.open(bookDetails.webReaderLink, "_blank")
                    }
                    className="w-full bg-brown hover:bg-dark-brown text-white px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Try Google Books
                  </button>
                )}

                <Link
                  to={`/book/${bookId}`}
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors text-center"
                >
                  Back to Book Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book Info Footer */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            Viewability:{" "}
            <strong className="text-gray-800">{bookDetails.viewability}</strong>
          </span>
          <span>
            Embeddable:{" "}
            <strong className="text-gray-800">
              {bookDetails.embeddable ? "Yes" : "No"}
            </strong>
          </span>
          <span>
            Public Domain:{" "}
            <strong className="text-gray-800">
              {bookDetails.publicDomain ? "Yes" : "No"}
            </strong>
          </span>
        </div>
      </div>
    </Container>
  );
}

export default BookViewer;
