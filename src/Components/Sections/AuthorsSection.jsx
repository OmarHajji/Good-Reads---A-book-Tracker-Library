import React, { useState } from "react";
import Container from "../UI/Container.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const authors = [
  { id: 1, name: "Jonathan Rivera", img: "/Author1.png" },
  { id: 2, name: "Samuel Thompson", img: "/Author2.png" },
  { id: 3, name: "Michael Collins", img: "/Author3.png" },
  { id: 4, name: "Benjamin Parker", img: "/Author4.png" },
  { id: 5, name: "David Lewis", img: "/Author5.png" },
  { id: 6, name: "Ava Robinson", img: "/Author6.png" },
  { id: 7, name: "Jonathan Rivera", img: "/Author7.png" },
];

function Author({ name, img }) {
  return (
    <div className="flex flex-col items-center w-28">
      <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-200">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <p
        className={`${
          name.length > 14 ? "text-xs" : "text-sm"
        } text-center mt-2`}
      >
        {name}
      </p>
    </div>
  );
}

export default function AuthorsSection() {
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <Container>
      <section className="py-20 bg-gray-50">
        <div>
          <h2 className="text-lg md:text-2xl font-semibold mb-6">
            Readers Favorite Authors
          </h2>

          <div className="relative">
            <div className="px-10 sm:px-0">
              <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={3}
                navigation={{
                  prevEl: ".swiper-button-prev-authors",
                  nextEl: ".swiper-button-next-authors",
                }}
                onSwiper={setSwiperInstance}
                breakpoints={{
                  640: {
                    slidesPerView: 4,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 5,
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 6,
                    spaceBetween: 20,
                  },
                  1280: {
                    slidesPerView: 7,
                    spaceBetween: 20,
                  },
                }}
                className="authors-swiper"
              >
                {authors.map((author) => (
                  <SwiperSlide key={author.id} className="h-auto">
                    <Author name={author.name} img={author.img} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Custom Navigation Buttons */}
            <button
              className="swiper-button-prev-authors absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-brown hover:bg-dark-brown rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
              onClick={() => swiperInstance?.slidePrev()}
              aria-label="Previous authors"
            >
              <svg
                className="w-5 h-5 text-white"
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
              className="swiper-button-next-authors absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-brown hover:bg-dark-brown rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
              onClick={() => swiperInstance?.slideNext()}
              aria-label="Next authors"
            >
              <svg
                className="w-5 h-5 text-white"
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
        </div>
      </section>
    </Container>
  );
}
