import React from "react";
import HeroSection from "../Sections/Hero.jsx";
import CarouselSlider from "../Sections/CarouselSlider.jsx";
import CategoriesSection from "../Sections/CategoriesSection.jsx";
import AuthorsSection from "../Sections/AuthorsSection.jsx";
import TestimonialSection from "../Sections/TestimonialSection.jsx";
function LandingPage() {
  return (
    <div>
      <HeroSection />
      <CarouselSlider />
      <CategoriesSection />
      <AuthorsSection />
      <TestimonialSection />
    </div>
  );
}

export default LandingPage;
