import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/productSlice";
import { Loader2, ShoppingCart } from "lucide-react";

export default function ProductDesc({ product }) {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const [qty, setQTY] = useState(1);
  const [loader, setLoader] = useState(false);
  //check user is admin
  const user = useSelector(store=>store.user.user||'')
  const isAdmin = user.role==="admin"
  const addToCart = async (productId) => {
    try {
      setLoader(true);
      const res = await axios.post(
        `http://localhost:3000/api/v1/cart/add`,
        { productId, quantity: qty },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("Server not responding ⚠️");
      } else {
        toast.error("Something went wrong ❌");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleQtyValue = (qty) => {
    if (qty > 0 && qty < 1000) {
      setQTY(qty);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full px-2 sm:px-4 md:px-0">
      {/* Title */}
      <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-snug">
        {product?.productName}
      </h1>

      {/* Category + Brand */}
      <p className="text-gray-500 text-xs sm:text-sm md:text-base flex flex-wrap gap-1">
        <span className="font-medium text-gray-700">{product?.category}</span>
        <span>•</span>
        <span className="text-pink-500 font-medium">{product?.brand}</span>
      </p>

      {/* Price + Stock */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-pink-600 font-bold text-xl ">
          ₹ {new Intl.NumberFormat("en-IN").format(product?.productPrice)}
        </h2>
        <span className="text-green-600 text-xs sm:text-sm font-medium bg-green-100 px-2 py-1 rounded-md">
          In Stock
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed text-sm sm:text-base line-clamp-4 sm:line-clamp-6">
        {product?.ProductDescription}
      </p>

      {/* Quantity */}
      <div className="flex items-center gap-3 mt-2">
        <p className="font-semibold text-sm sm:text-base">Qty:</p>
        <Input
          readOnly={isAdmin}
          type="number"
          value={qty}
          min={1}
          max={1000}
          className="w-16 sm:w-20 text-center border-gray-300 focus:border-pink-500 focus:ring-pink-500"
          onChange={(e) => handleQtyValue(Number(e.target.value))}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
        <Button
          onClick={() => addToCart(product?._id)}
          disabled={loader || isAdmin}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition w-full sm:w-auto"
        >
          {loader ? (
            <Loader2 className="w-16 h-16 animate-spin " />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> Add to Cart
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="border-pink-500 text-pink-600 hover:bg-pink-50 px-6 py-2 rounded-xl w-full sm:w-auto"
          disabled={loader||isAdmin}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
