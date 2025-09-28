import React from "react";
import { useState } from "react";
import PrimaryButton from "../UI/PrimaryButton.jsx";
function CarouselSlider() {
  const [slide, setSlide] = useState(false);

  return (
    <section className="carousel-slider h-100 relative flex  gap-6 py-10 justify-center items-center overflow-hidden">
      <div
        className={` ${
          slide ? "translate-x-full" : "-translate-x-full"
        } absolute  carousel-card2    rounded-lg flex flex-col lg:flex-row-reverse items-center justify-center gap-6`}
      >
        <div className="carousel-card-content flex flex-col gap-6 items-center justify-center text-center ">
          <h3 className="font-bold text-2xl ">
            New books awaiting for you to enjoy!
          </h3>
          <div className="flex items-center justify-between gap-4 ">
            <PrimaryButton className={"active:scale-95"} text={"Sign In"} />
            <PrimaryButton className={"active:scale-95"} text={"Sign up"} />
          </div>
        </div>
        <div className="carousel-card-cover flex items-center justify-center gap-2 pl-5 overflow-hidden">
          <img
            src="/cover-slider2.png"
            alt="Carousel Cover"
            loading="lazy"
            className="h-30 sm:h-42 md:h-52 lg:h-52 w-auto mt-6"
          />
          <img
            src="/cover-slider1.png"
            alt="Carousel Cover"
            loading="lazy"
            className="h-30 sm:h-42 md:h-52 lg:h-52 w-auto mt-6"
          />
        </div>
      </div>
      <div
        className={` ${
          !slide ? "translate-x-0" : "-translate-x-full"
        } absolute transition-all duration-700 ease-in-out carousel-card1  flex flex-col lg:flex-row lg:items-center  gap-6 rounded-lg m-0 px-10 `}
      >
        <div className="carousel-card-content flex flex-col gap-4 items-center lg:items-center text-center ">
          <h3 className="font-bold text-2xl ">
            Explore Our Collection of <br className="hidden sm:block" />{" "}
            Award-Winning Books
          </h3>
          <PrimaryButton
            text={"Explore Now"}
            link={"/categories"}
            imageUrl={"/slide-right.png"}
          />
        </div>

        <div className="carousel-card-books flex flex-row flex-wrap items-center justify-center lg:justify-start gap-1">
          <img
            src="/book-slider1.png"
            alt="Book 1"
            loading="lazy"
            className="h-32 sm:h-32 md:h-40 w-auto"
          />
          <img
            src="/book-slider2.png"
            alt="Book 2"
            loading="lazy"
            className="h-32 sm:h-32 md:h-40 w-auto"
          />
          <img
            src="/book-slider3.png"
            alt="Book 3"
            loading="lazy"
            className="hidden md:block h-32 sm:h-32 md:h-40 w-auto"
          />
          <img
            src="/hero-book.png"
            alt="Book 4"
            loading="lazy"
            className="hidden lg:block h-32 sm:h-28 md:h-40 w-auto"
          />
          <img
            src="/hero-book2.png"
            alt="Book 5"
            loading="lazy"
            className="hidden lg:block h-32 sm:h-28 md:h-40 w-auto"
          />
        </div>
      </div>
      <div
        className={` ${
          slide ? "translate-x-0" : "translate-x-full"
        } absolute transition-all duration-700 ease-in-out carousel-card2    rounded-lg flex flex-col lg:flex-row-reverse items-center justify-center gap-6`}
      >
        <div className="carousel-card-content flex flex-col gap-6 items-center justify-center text-center">
          <h3 className="font-bold text-2xl ">
            New books awaiting for you to enjoy!
          </h3>
          <div className="flex items-center justify-between gap-4 ">
            <PrimaryButton className={"active:scale-95"} text={"Sign In"} link="/login"/>
            <PrimaryButton className={"active:scale-95"} text={"Sign up"} link="/signup"/>
          </div>
        </div>
        <div className="carousel-card-cover flex items-center justify-center gap-2 pl-5 overflow-hidden">
          <img
            src="/cover-slider2.png"
            alt="Carousel Cover"
            loading="lazy"
            className="h-30 sm:h-42 md:h-52 lg:h-52 w-auto mt-6"
          />
          <img
            src="/cover-slider1.png"
            alt="Carousel Cover"
            loading="lazy"
            className="h-30 sm:h-42 md:h-52 lg:h-52 w-auto mt-6"
          />
        </div>
      </div>

      <button
        onClick={() => setSlide(!slide)}
        className="absolute right-3 md:right-10 lg:right-20 w-10 h-10 flex justify-center items-center  bg-brown hover:bg-dark-brown active:translate-x-0.5 p-2 rounded-full shadow-lg"
      >
        <img
          src="/slide-right.png"
          alt="Next"
          className="w-8 h-8 cursor-pointer"
        />
      </button>
      <button
        onClick={() => setSlide(!slide)}
        className="absolute left-3 md:left-10  lg:left-20 w-10 h-10 flex justify-center items-center  bg-brown hover:bg-dark-brown active:-translate-x-0.5 p-2 rounded-full shadow-lg"
      >
        <img
          src="/slide-left.png"
          alt="Next"
          className="w-8 h-8 cursor-pointer"
        />
      </button>
    </section>
  );
}

export default CarouselSlider;
