import Loader from "@/components/Loader";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SwiperProducts from "@/components/SwiperProducts";
import { toast } from "sonner";

export default function Home() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/product/getallproducts`,
      );
      if (res.data.success) {
        dispatch(setProduct(res.data.products));
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const productsData = useSelector((store) => store.product?.products || []);
  const allCategory = [...new Set(productsData?.map((p) => p?.category))];

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <div className="pt-10">
      <Hero />
      {loading ? (
        <Loader />
      ) : productsData?.length > 0 && allCategory?.length > 0 ? (
        allCategory?.map((category) => (
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
