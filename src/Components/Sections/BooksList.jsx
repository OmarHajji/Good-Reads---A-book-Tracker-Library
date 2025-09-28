import { useEffect, useState } from "react";
import api from "../../Utils/api";
import Book from "./Book";

function BookList({
  categories = ["book"],
  authorFilter = "",
  ratingFilter = "",
  pagesFilter = "",
  publishedFilter = "",
  titleFilter = "",
  viewerFilter = "", // Add this new prop
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 20;
  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        let allBooks = [];

        if (titleFilter) {
          let query = `intitle:${titleFilter}`;

          if (authorFilter) {
            query += `+inauthor:${authorFilter}`;
          }

          const res = await api.get(`?q=${query}&maxResults=12`);
          const items = res.data.items || [];

          const mappedBooks = items.map((item, index) => ({
            id: `${item.id}`,
            title: item.volumeInfo.title || "No title",
            author: item.volumeInfo.authors?.join(", ") || "Unknown",
            cover:
              item.volumeInfo.imageLinks?.extraLarge?.replace(
                "http://",
                "https://"
              ) ||
              item.volumeInfo.imageLinks?.large?.replace(
                "http://",
                "https://"
              ) ||
              item.volumeInfo.imageLinks?.thumbnail?.replace(
                "http://",
                "https://"
              ) ||
              null,
            rating: item.volumeInfo.averageRating || 0,
            pageCount: item.volumeInfo.pageCount || 0,
            publishedDate: item.volumeInfo.publishedDate || "",
            category: "search-result",
            // Add viewer availability info
            hasViewer:
              item.accessInfo?.viewability === "ALL_PAGES" ||
              item.accessInfo?.viewability === "PARTIAL" ||
              item.accessInfo?.publicDomain === true ||
              item.accessInfo?.embeddable === true,
          }));

          allBooks = mappedBooks;
        } else {
          for (const category of categories) {
            let query = `subject:${category}`;

            if (authorFilter) {
              query += `+inauthor:${authorFilter}`;
            }

            const res = await api.get(`?q=${query}&maxResults=12`);
            const items = res.data.items || [];

            const mappedBooks = items.map((item, index) => ({
              id: `${item.id}`,
              title: item.volumeInfo.title || "No title",
              author: item.volumeInfo.authors?.join(", ") || "Unknown",
              cover:
                item.volumeInfo.imageLinks?.extraLarge?.replace(
                  "http://",
                  "https://"
                ) ||
                item.volumeInfo.imageLinks?.large?.replace(
                  "http://",
                  "https://"
                ) ||
                item.volumeInfo.imageLinks?.medium?.replace(
                  "http://",
                  "https://"
                ) ||
                item.volumeInfo.imageLinks?.thumbnail?.replace(
                  "http://",
                  "https://"
                ) ||
                null,
              rating: item.volumeInfo.averageRating || 0,
              pageCount: item.volumeInfo.pageCount || 0,
              publishedDate: item.volumeInfo.publishedDate || "",
              category: category,
              // Add viewer availability info
              hasViewer:
                item.accessInfo?.viewability === "ALL_PAGES" ||
                item.accessInfo?.viewability === "PARTIAL" ||
                item.accessInfo?.publicDomain === true ||
                item.accessInfo?.embeddable === true,
            }));

            allBooks = [...allBooks, ...mappedBooks];
          }
        }

        const uniqueBooks = allBooks.filter(
          (book, index, self) =>
            index ===
            self.findIndex(
              (b) =>
                b.title.toLowerCase() === book.title.toLowerCase() &&
                b.author.toLowerCase() === book.author.toLowerCase()
            )
        );

        const filteredBooks = applyFilters(
          uniqueBooks,
          ratingFilter,
          pagesFilter,
          publishedFilter,
          viewerFilter // Add this parameter
        );

        setBooks(filteredBooks);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [
    categories,
    authorFilter,
    ratingFilter,
    pagesFilter,
    publishedFilter,
    titleFilter,
    viewerFilter, // Add this dependency
  ]);

  // Helper function to apply filters
  function applyFilters(books, rating, pages, published, viewer) {
    let filtered = [...books];

    // Rating filter
    if (rating) {
      const minRating = parseInt(rating);
      filtered = filtered.filter((book) => book.rating >= minRating);
    }

    // Pages filter
    if (pages) {
      filtered = filtered.filter((book) => {
        const pageCount = book.pageCount;
        switch (pages) {
          case "short":
            return pageCount > 0 && pageCount <= 200;
          case "medium":
            return pageCount > 200 && pageCount <= 400;
          case "long":
            return pageCount > 400;
          default:
            return true;
        }
      });
    }

    // Published date filter
    if (published) {
      const now = new Date();
      filtered = filtered.filter((book) => {
        if (!book.publishedDate) return false;
        const publishDate = new Date(book.publishedDate);

        switch (published) {
          case "today":
            return publishDate.toDateString() === now.toDateString();
          case "this-week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return publishDate >= weekAgo;
          case "this-month":
            return (
              publishDate.getMonth() === now.getMonth() &&
              publishDate.getFullYear() === now.getFullYear()
            );
          case "this-year":
            return publishDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Viewer filter - Add this new filter
    if (viewer === "available") {
      filtered = filtered.filter((book) => book.hasViewer === true);
    }

    return filtered;
  }

  // Pagination logic
  const totalPages = Math.ceil(books.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = books.slice(startIndex, endIndex);

  function goToNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <div className="w-full">
      {!loading && books.length > 0 && (
        <div className="relative  flex items-end justify-end w-full">
          <p className="text-gray-600 absolute -top-17 ">
            {books.length} books found
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-y-25 lg:gap-y-20 mb-25 gap-x-6 items-center justify-center min-h-[400px]">
        {loading ? (
          <div className="text-center flex flex-col items-center justify-center w-full">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brown mx-auto"></div>

            <p className="text-zinc-700 dark:text-zinc-400 mt-3 text-center">
              Loading...
            </p>
          </div>
        ) : currentBooks.length === 0 ? (
          <div className="text-center flex flex-col items-center justify-center w-full">
            <p className="text-zinc-600 dark:text-zinc-400">No books found</p>
          </div>
        ) : (
          currentBooks.map((book) => <Book key={book.id} bookData={book} />)
        )}
      </div>

      {!loading && books.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-brown text-white hover:bg-dark-brown"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-brown text-white hover:bg-dark-brown"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default BookList;
