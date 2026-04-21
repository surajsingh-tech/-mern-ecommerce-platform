import React from "react";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import Features from "@/components/Features";

export default function About() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 px-3 sm:px-6  pt-20">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800">
            About Our Store
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
            Your one-stop destination for the latest and greatest electronics.
            We provide high-quality gadgets at the best prices with trusted
            service.
          </p>
        </div>
        {/* About Content */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 md:gap-10 items-center mb-10 sm:mb-14">
          {/* Image */}
          <img
            // src="./electronic_images1.jpg"
            // src="./images/electronic_images.png"
            src="./electronic_banner.webp"
            alt="electronics"
            className="rounded-2xl shadow-md object-cover w-full 
                     h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]"
          />
          {/* Text */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
              We are a passionate team dedicated to bringing you the best in
              electronics — from smartphones and laptops to accessories and
              smart devices. Our mission is to make technology accessible,
              affordable, and reliable for everyone.
            </p>
          </div>
        </div>
        <Separator className="max-w-5xl mx-auto mb-5 sm:mb-14" />
        {/* features component */}
        <Features />
        {/* Footer */}
        <div className="max-w-5xl mx-auto text-center mt-12 sm:mt-16">
          <p className="text-gray-500 text-xs sm:text-sm">
            © {new Date().getFullYear()} Your Electronics Store. All rights
            reserved.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
