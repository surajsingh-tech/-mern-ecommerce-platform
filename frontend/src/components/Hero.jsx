import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl mt-4 md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Latest Electronics <br className="hidden sm:block" /> at Best
              Prices
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 max-w-xl mx-auto md:mx-0">
              Discover cutting-edge technology with unbeatable deals on
              smartphones, laptops and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-xl shadow-lg"
                onClick={() => {
                  navigate("products");
                }}
              >
                Shop Now
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  navigate("products");
                }}
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent px-6 py-2 rounded-xl"
              >
                View Deals
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
              <img
                src="./images/sliders/s_4.webp"
                alt="Electronics"
                className="rounded-2xl  w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
