import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setBuyNow, setCart } from "public/src/redux/productSlice";
import { Loader2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductDesc({ product }) {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const [qty, setQTY] = useState(1);
  const navigate = useNavigate();
  const [readMore, setReadMore] = useState(false);
  const [loader, setLoader] = useState(false);

  const user = useSelector((store) => store?.user?.user || "");
  const isAdmin = user?.role === "admin";

  const addToCart = async (productId) => {
    try {
      setLoader(true);

      if (!user) {
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/cart/add`,
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

  const handleBuyNow = async (productId) => {
    try {
      setLoader(true);

      if (!user) {
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/cart/add`,
        { productId, quantity: qty },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        navigate("/cart");
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
  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full px-3 sm:px-4 md:px-0">
      {/* Title */}
      <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900">
        {product?.productName}
      </h1>

      {/* Category + Brand */}
      <p className="text-gray-500 text-xs sm:text-sm flex flex-wrap gap-1">
        <span className="font-medium text-gray-700">{product?.category}</span>
        <span>•</span>
        <span className="text-pink-500 font-medium">{product?.brand}</span>
      </p>

      {/* Price */}
      <div className="flex items-center gap-3">
        <h2 className="text-pink-600 font-bold text-lg sm:text-xl">
          ₹ {new Intl.NumberFormat("en-IN").format(product?.productPrice)}
        </h2>
        <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-md">
          In Stock
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <p
          className={`text-gray-700 text-sm sm:text-base leading-relaxed transition-all duration-300 ${
            readMore ? "" : "line-clamp-3 sm:line-clamp-4"
          }`}
        >
          {product?.productDesc}
        </p>

        <button
          onClick={() => setReadMore(!readMore)}
          className="text-pink-600 text-sm font-medium hover:underline w-fit"
        >
          {readMore ? "Read Less ▲" : "Read More ▼"}
        </button>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-3 mt-2 flex-wrap">
        <p className="font-semibold text-sm w-full sm:w-auto">Qty:</p>

        <div className="flex items-center border rounded-lg overflow-hidden w-fit">
          {/* Minus */}
          <button
            type="button"
            onClick={() => handleQtyValue(qty - 1)}
            disabled={qty <= 1}
            className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-base sm:text-lg"
          >
            -
          </button>

          {/* Input */}
          <Input
            readOnly={isAdmin}
            type="number"
            value={qty}
            min={1}
            max={1000}
            onChange={(e) => handleQtyValue(Number(e.target.value))}
            className="w-12 sm:w-16 text-center border-none focus-visible:ring-0 text-sm sm:text-base"
          />

          {/* Plus */}
          <button
            type="button"
            onClick={() => handleQtyValue(qty + 1)}
            disabled={qty >= 1000}
            className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-base sm:text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
        <Button
          onClick={() => addToCart(product?._id)}
          disabled={loader || isAdmin}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {loader ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => handleBuyNow(product?._id)}
          className="border-pink-500 text-pink-600 hover:bg-pink-50 px-6 py-2 rounded-xl w-full sm:w-auto"
          disabled={loader || isAdmin}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
