import React, { useState } from "react";
import Search from "../UI/Search";
import { FaRegEye } from "react-icons/fa";

function FilterCategories({
  filterByCategory,
  showAllCategories,
  resetAllFilters,
  categories,
  AllCategories,
  onAuthorFilter,
  onRatingFilter,
  onPagesFilter,
  onPublishedFilter,
  onViewerFilter, // Add this new prop
  authorFilter,
  ratingFilter,
  pagesFilter,
  publishedFilter,
  viewerFilter, // Add this new prop
}) {
  // Handle author search - this function will be called when user searches
  function handleAuthorSearch(searchTerm) {
    onAuthorFilter(searchTerm);
  }

  function handleResetAll() {
    resetAllFilters();
  }

  return (
    <>
      <div className="hidden md:block w-75">
        <div className="filter-title flex justify-around items-center mb-6">
          <h4 className="font-semi-bold text-3xl">Filter Options</h4>
          <button
            onClick={handleResetAll}
            className="text-base text-red-500 hover:text-red-700"
          >
            Reset All
          </button>
        </div>

        <div className="categories flex flex-col gap-8">
          {/* Categories Section */}
          <div className="bg-brown flex items-center gap-2 text-white p-3 rounded-md">
            <img src="/categories-icon.png" alt="" /> Categories
          </div>
          <div className="flex items-center flex-col gap-3 px-2">
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="category"
                value="all"
                checked={categories.length === AllCategories.length}
                onChange={showAllCategories}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>All</span>
            </label>
            {AllCategories.map((category) => (
              <label
                key={category}
                className="flex items-center justify-start gap-3 w-full"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={
                    categories.length === 1 && categories[0] === category
                  }
                  onChange={(e) => filterByCategory(e.target.value)}
                  className="form-radio accent-brown w-5 h-5"
                />
                <span className="capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Author Section */}
        <div className="flex flex-col gap-4 my-8">
          <div className="bg-brown flex items-center gap-2 text-white p-3 rounded-md">
            <img src="/author-icon.png" alt="" /> Author
          </div>
          <div className="px-2">
            <Search
              placeholder="Search author "
              value={authorFilter}
              onSearch={handleAuthorSearch}
            />
          </div>
        </div>

        {/* Viewer Availability Section - Add this new section */}
        <div className="viewer-section my-8">
          <div className="bg-brown flex items-center gap-2 text-white p-3 rounded-md">
            <FaRegEye />
            Web Reader
          </div>
          <div className="flex flex-col gap-3 mt-4 px-2">
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="viewer"
                value=""
                checked={viewerFilter === ""}
                onChange={(e) => onViewerFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>All Books</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="viewer"
                value="available"
                checked={viewerFilter === "available"}
                onChange={(e) => onViewerFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>With Reader Only</span>
            </label>
          </div>
        </div>

        {/* Pages Section */}
        <div className="pages-section my-8">
          <div className="bg-brown flex items-center gap-2 text-white p-3 rounded-md">
            <img className="w-[24px] h-[24px]" src="/page-count.png" alt="" />
            Pages
          </div>
          <div className="flex flex-col gap-3 mt-4 px-2">
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="pages"
                value=""
                checked={pagesFilter === ""}
                onChange={(e) => onPagesFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>All</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="pages"
                value="short"
                checked={pagesFilter === "short"}
                onChange={(e) => onPagesFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>Short Reads (1-200 pages)</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="pages"
                value="medium"
                checked={pagesFilter === "medium"}
                onChange={(e) => onPagesFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>Medium Reads (201-400 pages)</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="pages"
                value="long"
                checked={pagesFilter === "long"}
                onChange={(e) => onPagesFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>Long Reads (400+ pages)</span>
            </label>
          </div>
        </div>

        {/* Published Section */}
        <div className="published-section my-8">
          <div className="bg-brown flex items-center gap-2 text-white p-3 rounded-md">
            <img
              className="w-[24px] h-[24px]"
              src="/date-published.png"
              alt=""
            />
            Published at
          </div>
          <div className="flex flex-col gap-3 mt-4 px-2">
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="published"
                value=""
                checked={publishedFilter === ""}
                onChange={(e) => onPublishedFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>All</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="published"
                value="today"
                checked={publishedFilter === "today"}
                onChange={(e) => onPublishedFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>Today</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="published"
                value="this-week"
                checked={publishedFilter === "this-week"}
                onChange={(e) => onPublishedFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>This Week</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="published"
                value="this-month"
                checked={publishedFilter === "this-month"}
                onChange={(e) => onPublishedFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>This Month</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="published"
                value="this-year"
                checked={publishedFilter === "this-year"}
                onChange={(e) => onPublishedFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>This Year</span>
            </label>
          </div>
        </div>

        {/* Rating Section */}
        <div className="availability-section my-8">
          <div className="bg-brown flex items-center gap-2 text-white p-3 rounded-md">
            <img src="/star-filtering.png" alt="" /> Rating
          </div>
          <div className="flex flex-col gap-3 mt-4 px-2">
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="rating"
                value=""
                checked={ratingFilter === ""}
                onChange={(e) => onRatingFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>All Ratings</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="rating"
                value="5"
                checked={ratingFilter === "5"}
                onChange={(e) => onRatingFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>5 Stars</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="rating"
                value="4"
                checked={ratingFilter === "4"}
                onChange={(e) => onRatingFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>4 Stars & Up</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="rating"
                value="3"
                checked={ratingFilter === "3"}
                onChange={(e) => onRatingFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>3 Stars & Up</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="rating"
                value="2"
                checked={ratingFilter === "2"}
                onChange={(e) => onRatingFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>2 Stars & Up</span>
            </label>
            <label className="flex items-center justify-start gap-3 w-full">
              <input
                type="radio"
                name="rating"
                value="1"
                checked={ratingFilter === "1"}
                onChange={(e) => onRatingFilter(e.target.value)}
                className="form-radio accent-brown w-5 h-5"
              />
              <span>1 Star & Up</span>
            </label>
          </div>
        </div>
      </div>

      {/* Mobile Filter Design */}
      <div className="md:hidden mx-auto mt-6">
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-4 px-4">
          <h4 className="font-semibold text-xl">Filter Options</h4>
          <button
            onClick={handleResetAll}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4 px-4">
          {/* Categories */}
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-300 px-3 py-2">
            <span className="text-gray-600 text-sm flex items-center gap-3 rounded-md">
              <img src="/categories2-icon.png" alt="" />
              Categories
            </span>
            <select
              className="bg-transparent outline-none text-sm cursor-pointer"
              value={
                categories.length === AllCategories.length
                  ? "all"
                  : categories[0] || ""
              }
              onChange={(e) =>
                e.target.value === "all"
                  ? showAllCategories()
                  : filterByCategory(e.target.value)
              }
            >
              <option value="all">All</option>
              {AllCategories.map((category) => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className="bg-white rounded-lg border border-gray-300">
            <Search
              placeholder="Author"
              value={authorFilter}
              onSearch={handleAuthorSearch}
            />
          </div>

          {/* Viewer Filter - Add this new mobile filter */}
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-300 px-3 py-2">
            <span className="text-gray-600 text-sm flex items-center gap-3 rounded-md">
              <FaRegEye />
              Web Reader
            </span>
            <select
              className="bg-transparent outline-none text-sm cursor-pointer"
              value={viewerFilter}
              onChange={(e) => onViewerFilter(e.target.value)}
            >
              <option value="">All Books</option>
              <option value="available">With Reader</option>
            </select>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-300 px-3 py-2">
            <span className="text-gray-600 text-sm flex items-center gap-3  rounded-md">
              <img src="/star-filtering2.png" alt="" />
              Rating
            </span>
            <select
              className="bg-transparent outline-none text-sm cursor-pointer"
              value={ratingFilter}
              onChange={(e) => onRatingFilter(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars & Up</option>
              <option value="3">3 Stars & Up</option>
              <option value="2">2 Stars & Up</option>
              <option value="1">1 Star & Up</option>
            </select>
          </div>

          {/* Page Count */}
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-300 px-3 py-2">
            <span className="text-gray-600 text-sm flex items-center gap-3  rounded-md">
              <img src="/page-count2.png" alt="" />
              Page Count
            </span>
            <select
              className="bg-transparent outline-none text-sm cursor-pointer"
              value={pagesFilter}
              onChange={(e) => onPagesFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="short">Short (1-200)</option>
              <option value="medium">Medium (201-400)</option>
              <option value="long">Long (400+)</option>
            </select>
          </div>

          {/* Book Published at */}
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-300 px-3 py-2">
            <span className="text-gray-600 text-sm flex items-center gap-3  rounded-md">
              <img src="/date-published2.png" alt="" />
              Book Published at
            </span>
            <select
              className="bg-transparent outline-none text-sm cursor-pointer"
              value={publishedFilter}
              onChange={(e) => onPublishedFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="this-year">This Year</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterCategories;
