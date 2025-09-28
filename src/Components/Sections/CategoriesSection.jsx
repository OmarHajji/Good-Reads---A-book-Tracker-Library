import React, { useState } from "react";
import Container from "../UI/Container.jsx";
import { useNavigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function CategoriesSection() {
  const navigate = useNavigate();
  const [swiperInstance, setSwiperInstance] = useState(null);

  const categories = [
    { name: "Computers" },
    { name: "Science" },
    { name: "Education" },
    { name: "Islam Studies" },
    { name: "Fiction" },
    { name: "Graphic Novels" },
  ];

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    // Convert to lowercase to match the category format in CategoriesPage
    const categoryKey = categoryName.toLowerCase();
    navigate(`/categories?category=${encodeURIComponent(categoryKey)}`);
  };

  return (
    <Container>
      <h3 className="font-semibold text-2xl">
        Choose the category for your next trip
      </h3>

      <div className="mt-16 relative">
        <div className="px-10 sm:px-0">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            onSwiper={setSwiperInstance}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="categories-swiper"
          >
            {categories.map((category, idx) => {
              const colorClass =
                idx % 3 === 0
                  ? "bg-beige text-dark-brown"
                  : idx % 2 === 0
                  ? "bg-dark-brown text-white"
                  : "bg-brown text-white";

              return (
                <SwiperSlide key={idx} className="h-auto">
                  <button
                    onClick={() => handleCategoryClick(category.name)}
                    className={`${colorClass} category-card flex justify-center items-center gap-2 w-full h-50 p-4 hover:scale-105 transition-transform duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brown focus:ring-offset-2 rounded-lg`}
                  >
                    <h2 className="font-semibold text-3xl text-center">
                      {category.name}
                    </h2>
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Custom Navigation Buttons */}
        <button
          className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-brown hover:bg-dark-brown rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
          onClick={() => swiperInstance?.slidePrev()}
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 text-white"
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
        </button>

        <button
          className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-brown hover:bg-dark-brown rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
          onClick={() => swiperInstance?.slideNext()}
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </Container>
  );
}

export default CategoriesSection;
