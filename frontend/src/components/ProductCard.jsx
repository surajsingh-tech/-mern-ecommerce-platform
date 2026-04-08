import React from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="shadow-lg rounded-lg overflow-hidden m-3 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xs">
      {/* Image Section */}
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={product?.productImage[0]?.url || "/fallback.png"}
          alt={product?.productName || "Product"}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Text + Button Section */}
      <div className="px-3 py-2 space-y-2">
        <h1 className="font-semibold text-sm sm:text-base md:text-lg h-12 line-clamp-2">
          {product?.productName}
        </h1>
        <h2 className="font-bold text-pink-700 text-base sm:text-lg md:text-xl">
          ₹ {product?.productPrice}
        </h2>
        <Button className="bg-pink-600 w-full flex items-center justify-center hover:bg-pink-700 gap-2 text-sm sm:text-base">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
