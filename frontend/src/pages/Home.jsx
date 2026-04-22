import Features from "@/components/Features";
import Hero from "@/components/Hero";
import SwiperProducts from "@/components/SwiperProducts";
import React from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const productsData = useSelector((store) => store.product.products || []);
  const allCategory = [...new Set(productsData?.map((p) => p?.category))];

  return (
    <div className="pt-10">
      <Hero />
      {productsData.length > 0 && allCategory.length > 0 ? (
        allCategory.map((category) => (
          <SwiperProducts
            key={category} 
            category={category}
            products={productsData?.filter((p) => p?.category === category)}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No products available right now.
        </p>
      )}
      <Features />
    </div>
  );
}
