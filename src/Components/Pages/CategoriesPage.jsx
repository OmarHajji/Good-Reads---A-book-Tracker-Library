import React from "react";
import FilterCategories from "../Sections/FilterCategories.jsx";
import Container from "../UI/Container.jsx";
import BooksList from "../Sections/BooksList.jsx";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

function CategoriesPage() {
  const AllCategories = [
    "computers",
    "science",
    "education",
    "islam studies",
    "fiction",
    "graphic novels",
  ];

  const [searchParams] = useSearchParams();

  // Initialize based on URL parameters
  const initialSearchQuery = searchParams.get("search");
  const initialCategory = searchParams.get("category");

  const [categories, setCategories] = useState(() => {
    if (initialSearchQuery) return []; // Empty if searching by title
    if (initialCategory) return [initialCategory]; // Single category if specified
    return AllCategories; // All categories by default
  });

  const [authorFilter, setAuthorFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [pagesFilter, setPagesFilter] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState(initialSearchQuery || "");
  const [resetTrigger, setResetTrigger] = useState(0);
  const [viewerFilter, setViewerFilter] = useState("");

  // Check for URL parameters when component loads or URL changes
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    const categoryQuery = searchParams.get("category");

    if (searchQuery) {
      // Title search mode
      setTitleFilter(searchQuery);
      setCategories([]);
    } else if (categoryQuery) {
      // Category filter mode
      setTitleFilter("");
      setCategories([categoryQuery]);
    } else {
      // Default mode - show all categories
      setTitleFilter("");
      setCategories(AllCategories);
    }
  }, [searchParams]);

  function filterByCategory(selected) {
    // Clear title filter and URL search parameter
    setTitleFilter("");
    window.history.replaceState(
      {},
      "",
      `/categories?category=${encodeURIComponent(selected)}`
    );

    const filteredCategories = AllCategories.filter(
      (category) => category === selected
    );
    setCategories(filteredCategories);
  }

  function showAllCategories() {
    // Clear title filter and URL parameters
    setTitleFilter("");
    window.history.replaceState({}, "", window.location.pathname);

    setCategories(AllCategories);
  }

  function resetAllFilters() {
    setCategories(AllCategories);
    setAuthorFilter("");
    setRatingFilter("");
    setPagesFilter("");
    setPublishedFilter("");
    setTitleFilter("");
    setViewerFilter("");
    window.history.replaceState({}, "", window.location.pathname);
    // Trigger reset for Search components
    setResetTrigger((prev) => prev + 1);
  }

  function handleAuthorFilter(author) {
    setAuthorFilter(author);
  }

  function handleRatingFilter(rating) {
    setRatingFilter(rating);
  }

  function handlePagesFilter(pages) {
    setPagesFilter(pages);
  }

  function handlePublishedFilter(published) {
    setPublishedFilter(published);
  }

  // Get display title based on current state
  const getDisplayTitle = () => {
    if (titleFilter) {
      return `Search Results for "${titleFilter}"`;
    }
    if (categories.length === 1 && categories[0] !== AllCategories[0]) {
      return `${
        categories[0].charAt(0).toUpperCase() + categories[0].slice(1)
      } Books`;
    }
    return "Books";
  };

  return (
    <Container className={"py-10 flex flex-col md:flex-row gap-8"}>
      <FilterCategories
        filterByCategory={filterByCategory}
        showAllCategories={showAllCategories}
        resetAllFilters={resetAllFilters}
        categories={categories}
        AllCategories={AllCategories}
        onAuthorFilter={handleAuthorFilter}
        onRatingFilter={handleRatingFilter}
        onPagesFilter={handlePagesFilter}
        onPublishedFilter={handlePublishedFilter}
        onViewerFilter={setViewerFilter}
        authorFilter={authorFilter}
        ratingFilter={ratingFilter}
        pagesFilter={pagesFilter}
        publishedFilter={publishedFilter}
        titleFilter={titleFilter}
        viewerFilter={viewerFilter}
        resetTrigger={resetTrigger}
      />
      <div className="flex-1 flex flex-col items-start">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          {getDisplayTitle()}
        </h2>
        {/* Pass titleFilter to BooksList */}
        <BooksList
          categories={categories}
          authorFilter={authorFilter}
          ratingFilter={ratingFilter}
          pagesFilter={pagesFilter}
          publishedFilter={publishedFilter}
          titleFilter={titleFilter}
          viewerFilter={viewerFilter}
        />
      </div>
    </Container>
  );
}

export default CategoriesPage;
