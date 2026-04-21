import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Autoplay, Navigation } from "swiper/modules";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { heroSlides } from "../data/heroSlides";

export default function HeroSlider() {
  const navigate = useNavigate();

  return (
    <Swiper
      modules={[Autoplay, Navigation]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      navigation={true}
      loop={true}
      className="heroSwiper"
    >
      {heroSlides.map((slide, index) => (
        <SwiperSlide key={index}>
          <section
            className={`${slide.bg} text-white transition-all duration-500`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left Content */}
                <div className="text-center md:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                    {slide.title}
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 max-w-xl mx-auto md:mx-0">
                    {slide.desc}
                  </p>

                  <Button
                    className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-xl shadow-lg"
                    onClick={() =>
                      navigate(`/products?category=${slide.category}`)
                    }
                  >
                    {slide.buttonText}
                  </Button>
                </div>

                {/* Right Image */}
                <div className="flex justify-center">
                  <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-[300px] sm:h-[350px] md:h-[400px]">
                    <img
                      src={slide.image}
                      alt="hero"
                      className="w-full h-full object-contain drop-shadow-2xl "
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
