import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function SwiperProducts({ category, products }) {
  const navigate = useNavigate();

  return (
    <div className="my-10 px-2 sm:px-4 w-full max-w-screen-xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 capitalize text-pink-600">
        {category}
      </h2>

      <div className="relative">
        {/* ARROWS */}
        <div className="custom-prev absolute -left-3 sm:-left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border shadow rounded-full flex items-center justify-center">
          ❮
        </div>

        <div className="custom-next absolute -right-3 sm:-right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border shadow rounded-full flex items-center justify-center">
          ❯
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={18}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          loop={products?.length > 3}
          autoplay={{
            delay: 2200,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 1.3 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {products?.map((item) => (
            <SwiperSlide key={item._id} className="h-auto">
              {/* FIXED HEIGHT CARD */}
              <div
                onClick={() => navigate(`/products/${item._id}`)}
                className="h-[360px] bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col cursor-pointer p-4"
              >
                {/* IMAGE FIXED AREA */}
                <div className="h-[180px] flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={item?.productImage?.[0]?.url || "/placeholder.png"}
                    alt={item?.productName}
                    className="h-full object-contain hover:scale-105 transition"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col flex-1 mt-3">
                  <p className="text-xs text-gray-400 uppercase">
                    {item?.brand}
                  </p>
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-[40px]">
                    {item?.productName}
                  </h3>

                  <p className="text-pink-600 font-bold text-lg ">
                    ₹{" "}
                    {new Intl.NumberFormat("en-IN").format(item?.productPrice)}
                  </p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${item._id}`);
                    }}
                    className="mt-auto w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm py-2 rounded-lg transition"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
