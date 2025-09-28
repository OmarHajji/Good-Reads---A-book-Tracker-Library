import React from "react";

function Footer() {
  return (
    <footer className="bg-light-beige">
      <div className=" flex flex-col gap-6 items-center justify-between px-4  pt-6 relative md:flex-row md:items-start  md:px-12 lg:px-24  lg:gap-12  lg:py-12">
        <a
          href="/"
          className="logo font-inter text-brown-200 text-3xl hidden md:block hover:cursor-pointer   "
        >
          good<span className="text-brown ">reads</span>
        </a>
        <div className="md:flex md:flex-col md:gap-6 md:items-center md:justify-start">
          <h6 className="text-xl font-semibold  pb-6 md:pb-0">Our Company</h6>
          <ul className="flex flex-col gap-6 justify-center items-center text-base md:items-start md:pl-3 ">
            <li>
              <a href="/about">About us</a>
            </li>
            <li>
              <a href="">Careers</a>
            </li>
            <li>
              <a href="">Terms</a>
            </li>
            <li>
              <a href="">Privacy</a>
            </li>
            <li>
              <a href="">Interest Based Ads</a>
            </li>
            <li>
              <a href="">Add preferences</a>
            </li>
            <li>
              <a href="">Help</a>
            </li>
          </ul>
        </div>
        <div className="md:flex md:flex-col md:gap-6 md:items-center md:justify-start">
          <h6 className="text-xl font-semibold pb-6 md:pb-0">Work With Us</h6>
          <ul className="flex flex-col gap-6 justify-center items-center md:items-start text-base  md:pl-3">
            <li>
              <a href="">Authors</a>
            </li>
            <li>
              <a href="">Advertise</a>
            </li>
            <li>
              <a href="">Authors & dds blog</a>
            </li>
            <li>
              <a
                href="https://developers.google.com/books/docs/overview"
                target="_blank"
              >
                API
              </a>
            </li>
          </ul>
        </div>
        <div className="md:flex md:flex-col md:gap-6  md:justify-start ">
          <label
            htmlFor="footer-email"
            className="hidden md:block text-xl font-semibold pb-6 md:pb-0 "
          >
            Subscribe to our Newsletter
          </label>
          <form className="flex items-center justify-between h-12 w-full max-w-md mx-auto mb-20  bg-white pl-3 rounded-2xl">
            <input
              className="h-full w-full rounded-l-lg border-r-0 px-0"
              type="email"
              id="footer-email"
              placeholder="Enter your email..."
            />
            <button
              className="bg-brown h-full px-6 flex items-center active:translate-x-0.5 hover:bg-dark-brown  justify-center rounded-r-lg hover:cursor-pointer  hover:bg-opacity-90 transition-all border-l-0"
              type="submit"
            >
              <img
                className="w-[24px] h-[20px]"
                src="/arrow-submit.png"
                alt="Submit"
              />
            </button>
          </form>
        </div>
      </div>

      <div className="relative w-full flex flex-col gap-6 items-center mb-0 pb-0 ">
        <svg
          className="absolute  -bottom-15 left-0 block w-full h-64 bg-beige   md:scale-y-150 lg:scale-y-100 "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 C400,0 800,0 1200,120 L1200,0 L0,0 Z"
            className="fill-light-beige "
          ></path>
        </svg>

        <h3 className="font-bold text-2xl md:text-4xl z-10 mt-15">
          CONTACT US
        </h3>
        <div className="flex gap-6  justify-between items-center z-0 mb-0 ">
          <a href="">
            <img
              className="w-[48px] h-[48px] "
              src="/facebook-icon.png"
              alt=""
            />
          </a>
          <a className=" " href="">
            <img className="" src="/insta-icon.png" alt="" />
          </a>
          <a href="">
            <img src="/x-icon.png" alt="" />
          </a>
          <a href="">
            <img src="/youtube-icon.png" alt="" />
          </a>
          <a href="">
            <img src="/linkedin-icon.png" alt="" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
