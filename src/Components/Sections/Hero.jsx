import React from "react";
import Container from "../UI/Container.jsx";
import PrimaryButton from "../UI/PrimaryButton.jsx";
function Hero() {
  return (
    <section className="relative bg-white">
      <Container>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl font-pattaya sm:text-5xl lg:text-6xl  leading-tight text-gray-900">
                What Book Are
                <br />
                You Looking For ?
              </h1>

              <div className="mt-8 space-y-2 text-gray-700">
                <p className="font-semibold">Not Sure What To Read Next?</p>
                <p className="text-sm sm:text-base">
                  Our solution will cost you 5 minutes to find your next best.
                </p>
              </div>

              <div className="mt-8 inline-flex items-stretch border border-brown hover:border-dark-brown rounded-r-md shadow-lg">
                <div className="px-5 py-3 bg-white text-gray-900 text-sm sm:text-base hover:bg-gray-50 transition">
                  Explore Now
                </div>
                <button type="button" aria-label="Go">
                  <PrimaryButton
                    imageUrl={"/arrow-submit.png"}
                    className={"h-12  active:translate-x-0.5 rounded-l-none"}
                    link={"/categories"}
                  />
                </button>
              </div>
            </div>

            <div className="relative min-h-[320px] md:min-h-[350px]  order-1 md:order-2">
              <div className="absolute -top-2 left-6 sm:left-12 w-44 h-56 sm:w-56 sm:h-72 bg-teal-700 rounded-md shadow-2xl rotate-[-6deg] overflow-hidden">
                <div className="h-full p-4 sm:p-6 flex flex-col">
                  <img
                    className="w-full h-full object-cover"
                    src="/hero-book.png"
                    alt=""
                  />
                </div>
              </div>

              <div className="absolute top-16 right-2 sm:right-8 w-44 h-56 sm:w-56 sm:h-72 bg-yellow-400 rounded-md shadow-2xl rotate-[10deg] flex items-center justify-center">
                <img
                  className="w-full h-full object-cover"
                  src="/hero-book2.png"
                  alt=""
                />
              </div>

              <div className="absolute bottom-2 left-0 sm:left-6 bg-white rounded-xl shadow-lg p-4 w-56 sm:w-64">
                <p className="font-semibold text-gray-900 mb-3">
                  Our Community
                </p>
                <div className="flex -space-x-2 mb-2 ">
                  <img
                    src="/community-1.png"
                    className="w-8 h-8 rounded-full ring-2 ring-white"
                  />
                  <img
                    src="/community-2.png"
                    className="w-8 h-8 rounded-full ring-2 ring-white"
                  />
                  <img
                    src="/community-3.png"
                    className="w-8 h-8 rounded-full ring-2 ring-white"
                  />
                  <img
                    src="/community-4.png"
                    className="w-8 h-8 rounded-full ring-2 ring-white"
                  />
                  <img
                    src="/community-5.png"
                    className="w-8 h-8 rounded-full ring-2 ring-white"
                  />
                </div>
                <p className="text-xs text-gray-600">+40k Book Lovers Joined</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="  w-full mt-20">
        <div className="flex">
          <div className="h-4 sm:h-6 bg-yellow-200 w-1/2" />{" "}
          <div className="h-4 sm:h-6 bg-yellow-400 w-1/2" />
        </div>
        <div className="flex">
          <div className="h-4 sm:h-6 bg-orange-200 w-2/5" />
          <div className="h-4 sm:h-6 bg-orange-400 w-3/5" />
        </div>
        <div className="flex">
          <div className="h-4 sm:h-6 bg-red-300 w-3/10" />
          <div className="h-4 sm:h-6 bg-red-500 w-7/10" />
        </div>
        <div className="flex">
          <div className="h-4 sm:h-6 bg-pink-300 w-2/10" />
          <div className="h-4 sm:h-6 bg-pink-700 w-8/10" />
        </div>

        <div className="h-4 sm:h-6 bg-purple-900 w-full" />
      </div>
    </section>
  );
}

export default Hero;
