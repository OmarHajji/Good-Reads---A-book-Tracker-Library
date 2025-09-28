import React from "react";
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <img
          src="/404-img.png"
          alt="Books on shelf"
          className="absolute top-0 left-1/2 -translate-x-1/2"
        />
      </div>

      <h1 className="text-6xl md:text-4xl font-bold text-yellow-500 mb-4">
        404
      </h1>

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 text-center">
        Looks like you've got lost...
      </h2>

      <p className="text-gray-600 text-center mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="bg-brown hover:bg-dark-brown text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
      >
        Go Home
      </Link>

      {/* Reading person illustration */}
      <div className="mt-8">
        <img
          src="/404-avatar.png"
          alt="Person reading a book"
          className="w-64 h-40 object-contain absolute bottom-0 right-1/2 translate-x-1/2 md:right-0 md:translate-x-0"
        />
      </div>
    </div>
  );
}

export default NotFoundPage;
