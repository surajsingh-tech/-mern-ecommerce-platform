import React from "react";
import BreadCrumbs from "./BreadCrumb";
import ProductImage from "/src/components/ProductImage";
import ProductDesc from "/src/components/ProductDesc";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SingleProduct() {
  const { id } = useParams();
  const { products } = useSelector((store) => store.product || []);
  const product = products?.find((p) => p._id === id);

  return (
    <div className="pt-20 pb-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
          <BreadCrumbs product={product} />
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start bg-white p-6 rounded-2xl shadow-xl">
          <ProductImage images={product?.productImage} />
          <ProductDesc product={product} />
        </div>
      </div>
    </div>
  );
}
