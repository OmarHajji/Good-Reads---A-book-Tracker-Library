import React, { useState, useEffect } from "react";

function Search({ placeholder, value = "", onSearch, clearTrigger }) {
  const [searchTerm, setSearchTerm] = useState(value);

  // Clear search when clearTrigger changes
  useEffect(() => {
    if (clearTrigger) {
      setSearchTerm("");
    }
  }, [clearTrigger]);

  // Update searchTerm when value prop changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim()); // Send search term to parent component
      setSearchTerm("");
      document.activeElement.blur(); // Remove focus from input field
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
  };

  // Handle clear button
  const handleClear = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch(""); // Clear the search
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex justify-center items-center gap-3 border border-gray-300 rounded-sm px-2 py-1"
    >
      <button type="submit" aria-label="Search">
        <img src="/search-icon.png" alt="Search" />
      </button>
      <input
        className="w-full outline-none"
        type="text"
        name="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
      />
      {/* Clear button - only show when there's text */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 p-1"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </form>
  );
}

export default Search;
