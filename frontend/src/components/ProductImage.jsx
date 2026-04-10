import React, { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function ProductImage({ images }) {
  const [mainImage, setMainImage] = useState(images?.[0]?.url);

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2">
        {images?.map((img, indx) => (
          <img
            src={img?.url}
            onClick={() => setMainImage(img?.url)}
            alt="image"
            key={indx}
            className="cursor-pointer w-20 h-20 object-cover border-2 border-transparent hover:border-pink-500 rounded-lg shadow-md hover:scale-105 transition"
          />
        ))}
      </div>

      <div className="w-full flex justify-center items-center bg-gray-50 rounded-xl p-4 shadow-inner">
        <Zoom>
          <img
            src={mainImage}
            alt="product"
            className="
              w-[260px] h-[260px]
              sm:w-[320px] sm:h-[320px]
              md:w-[420px] md:h-[420px]
              lg:w-[500px] lg:h-[500px]
              object-contain rounded-xl shadow-lg hover:scale-105 transition duration-300
            "
          />
        </Zoom>
      </div>
    </div>
  );
}
