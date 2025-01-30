import Header from "@widgets/Header";
import React from "react";
import HomeSection from "./components/HomeSection";
import Footer from "@widgets/Footer";

export default function LandingPageView() {
  return (
    <main>
      <Header />
      <HomeSection />
      <Footer/>
    </main>
  );
}
