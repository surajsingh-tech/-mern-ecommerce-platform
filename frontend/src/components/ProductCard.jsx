import React, { useState } from "react";
import { Button } from "./ui/button";
import { Edit, Loader2, ShoppingCart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "public/src/redux/productSlice";
import { useNavigate } from "react-router-dom";
import store from "public/src/redux/store";

export default function ProductCard({ product }) {
  if (!product) return null;
  const [loader, setLoader] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user.user || "");
  const addToCart = async (productId) => {
    try {
      setLoader(true);
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/cart/add`,
        { productId },
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

  return (
    <div className="shadow-lg rounded-lg overflow-hidden max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xs">
      {/* Image Section */}
      <div className="w-full aspect-square overflow-hidden  ">
        <img
          src={product?.productImage[0]?.url || "/fallback.png"}
          alt={product?.productName || "Product"}
          className="object-conatin w-full h-full transition-transform duration-300 hover:scale-105 rounded-sm"
          onClick={() => navigate(`/products/${product?._id}`)}
        />
      </div>

      {/* Text + Button Section */}
      <div className="px-3 py-2 space-y-2">
        <h1 className="font-semibold text-sm sm:text-base md:text-md h-12 line-clamp-2">
          {product?.productName}
        </h1>
        <h2 className="font-bold text-pink-700 text-base sm:text-lg md:text-xl">
          ₹ {new Intl.NumberFormat("en-IN").format(product?.productPrice)}
        </h2>
        {user?.role === "admin" ? (
          <Button
            className="bg-pink-600 w-full flex items-center justify-center hover:bg-pink-700 gap-2 text-sm sm:text-base"
            disabled={loader}
            onClick={() =>
              navigate(`/dashboard/products?product=${product._id}`)
            }
          >
            {loader ? (
              <Loader2 className="w-16 h-16 animate-spin " />
            ) : (
              <>
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" /> Edit Products
              </>
            )}
          </Button>
        ) : (
          <Button
            className="bg-pink-600 w-full flex items-center justify-center hover:bg-pink-700 gap-2 text-sm sm:text-base"
            onClick={() => addToCart(product._id)}
            disabled={loader}
          >
            {loader ? (
              <Loader2 className="w-16 h-16 animate-spin " />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> Add to Cart
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
