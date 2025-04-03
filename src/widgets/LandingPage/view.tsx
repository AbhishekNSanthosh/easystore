import Header from "@widgets/Header";
import React from "react";
import HomeSection from "./components/HomeSection";
import Footer from "@widgets/Footer";
import QuickAndEasy from "./components/Section";
import TestimonialCarousel from "./components/Testo";
import FAQSection from "./components/Faq";

export default function LandingPageView() {
  return (
    <main>
      <Header />
      <HomeSection />
      <QuickAndEasy/>
      <TestimonialCarousel/>
      <FAQSection/>
      <Footer/>
    </main>
  );
}
