import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import NoDataAvailable from "@/components/NoDataAvailable";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "@/redux/productSlice";
import { useSearchParams } from "react-router-dom";

export default function Products() {
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const allProduct = useSelector((store) => store.product.products || []);
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "All";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categoryFromUrl);
  const [brand, setBrand] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  const dispatch = useDispatch();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:3000/api/v1/product/getallproducts",
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

  const filteredProducts = useMemo(() => {
    if (allProduct.length === 0) return [];

    let filtered = [...allProduct];

    if (search.trim() !== "") {
      const value = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p?.productName.toLowerCase().includes(value) ||
          p?.productDesc.toLowerCase().includes(value) ||
          p?.category.toLowerCase().includes(value) ||
          p?.brand.toLowerCase().includes(value),
      );
    }

    if (category !== "All") {
      filtered = filtered?.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      filtered = filtered?.filter((p) => p.brand === brand);
    }

    filtered = filtered?.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1],
    );

    if (sortOrder === "lowToHigh") {
      filtered = [...filtered].sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered = [...filtered].sort((a, b) => b.productPrice - a.productPrice);
    }

    return filtered;
  }, [search, category, brand, sortOrder, priceRange, allProduct]);

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : allProduct.length > 0 ? (
        <div className="pt-20 pb-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-8 px-4 sm:px-6">
            {/* MOBILE FILTER BUTTON */}
            <button
              className="md:hidden w-full mb-4 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-sm hover:bg-gray-800 transition flex items-center justify-center gap-2"
              onClick={() => setShowFilter(true)}
            >
              🔍 Filters
            </button>

            {/* MOBILE SIDEBAR */}
            {showFilter && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
                <div className="w-[80%] max-w-xs bg-white h-full p-4 shadow-xl">
                  <Button
                    className="mb-4 text-white bg-pink-600 hover:bg-pink-700 float-end"
                    onClick={() => setShowFilter(false)}
                  >
                    Close ✖
                  </Button>
                  <FilterSidebar
                    allProduct={allProduct}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    search={search}
                    setSearch={setSearch}
                    brand={brand}
                    setBrand={setBrand}
                    category={category}
                    setCategory={setCategory}
                  />
                </div>
              </div>
            )}

            {/* DESKTOP SIDEBAR */}
            <div className="hidden md:block w-[260px] shrink-0">
              <FilterSidebar
                allProduct={allProduct}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                search={search}
                setSearch={setSearch}
                brand={brand}
                setBrand={setBrand}
                category={category}
                setCategory={setCategory}
              />
            </div>

            {filteredProducts.length > 0 ? (
              <div className="flex flex-col flex-1">
                {/* SORT + HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <p className="text-sm font text-gray-500">
                    Showing {filteredProducts.length} products
                  </p>
                  <Select onValueChange={(value) => setSortOrder(value)}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Sort by price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="lowToHigh">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="highToLow">
                          Price: High to Low
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* PRODUCT GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {filteredProducts.map((p) => (
                    <div
                      key={p._id}
                      className="w-full transition-transform duration-200 hover:scale-[1.02]"
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <NoDataAvailable
                title={"No products found"}
                description={
                  "We couldn’t find any products matching your criteria. Try adjusting your filters or search again."
                }
                buttonText={"goto Home Page"}
                navigateTo={"/"}
              />
            )}
          </div>
        </div>
      ) : (
        <NoDataAvailable
          title={"No products found"}
          description={
            "We couldn’t find any products matching your criteria. Try adjusting your filters or search again."
          }
          buttonText={"goto Home Page"}
          navigateTo={"/"}
        />
      )}
    </div>
  );
}
