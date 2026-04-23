import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

export default function FilterSidebar({
  allProduct,
  priceRange,
  setPriceRange,
  search,
  setSearch,
  brand,
  setBrand,
  category,
  setCategory,
}) {
  const uniqueCategory = [
    "All",
    ...new Set(allProduct?.map((p) => p?.category)),
  ];

  const uniqueBrand = ["All", ...new Set(allProduct?.map((p) => p?.brand))];

  const handleCategory = (value) => {
    setCategory(value);
  };

  const handleBrandChange = (value) => {
    setBrand(value);
  };

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange[1]) setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0]) setPriceRange([priceRange[0], value]);
  };

  // Local state for search
  const [localSearch, setLocalSearch] = useState(search);

  //use custom debaunce hook
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch]);

  const resetFilters = () => {
    setSearch("");
    setPriceRange([0, 999999]);
    setBrand("All");
    setCategory("All");
  };

  return (
    <div className="bg-white shadow-xl mt-6 p-5 sm:p-6 rounded-2xl h-full w-full border border-gray-100">
      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <Input
          type="text"
          placeholder="Search products..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="bg-gray-50 pl-11 pr-3 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 w-full shadow-sm"
        />
      </div>

      {/* Category */}
      <h1 className="mt-6 font-semibold text-lg text-gray-800 border-b pb-2">
        Category
      </h1>

      <div className="flex flex-col gap-2 mt-3">
        {uniqueCategory?.map((item, indx) => (
          <label
            key={indx}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-sm
          ${
            category === item
              ? "bg-pink-100 text-pink-600 font-medium"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          >
            <div className="flex items-center gap-2">
              <input
                onChange={() => handleCategory(item)}
                name="category"
                value={item}
                type="radio"
                checked={category === item}
                className="w-4 h-4 accent-pink-600 cursor-pointer"
              />
              {item}
            </div>
          </label>
        ))}
      </div>

      {/* Brand */}
      <h1 className="mt-6 font-semibold text-lg text-gray-800 border-b pb-2">
        Brands
      </h1>

      <select
        className="bg-gray-50 w-full mt-3 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm shadow-sm"
        onChange={(e) => handleBrandChange(e.target.value)}
        value={brand}
      >
        {uniqueBrand?.map((brand, indx) => (
          <option value={brand} key={indx}>
            {brand.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Price Range */}
      <h1 className="mt-6 mb-3 font-semibold text-lg text-gray-800 border-b pb-2">
        Price Range
      </h1>

      <div className="flex flex-col gap-3">
        {/* Price Badge */}
        <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg w-fit">
          ₹ {priceRange[0]} - ₹ {priceRange[1]}
        </div>

        {/* Inputs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="number"
            value={priceRange[0]}
            onChange={handleMinChange}
            min="0"
            max="5000"
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
          />

          <span className="hidden sm:block text-gray-400">-</span>

          <input
            type="number"
            min="0"
            max="999999"
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>

        {/* Range Sliders */}
        <div className="flex flex-col gap-2">
          <input
            onChange={handleMinChange}
            value={priceRange[0]}
            type="range"
            min="0"
            max="5000"
            step="100"
            className="w-full accent-pink-500 cursor-pointer"
          />
          <input
            onChange={handleMaxChange}
            value={priceRange[1]}
            type="range"
            min="0"
            max="999999"
            step="100"
            className="w-full accent-pink-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Reset Button */}
      <Button
        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white mt-6 w-full hover:scale-[1.02] hover:shadow-lg rounded-xl transition-all duration-200"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
}
