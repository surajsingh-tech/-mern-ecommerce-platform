import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "@/redux/productSlice";
import { Loader2 } from "lucide-react";

export default function AddProduct() {
  const [loader, setLoader] = useState(false);
  const [prodectData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDesc: "",
    brand: "",
    category: "",
    productImage: [],
  });
  const products = useSelector((store) => store.product.products || []);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (prodectData.productImage.length > 5) {
      toast.error("Only upto 5 images are Allowed");
      return;
    }

    const chkValidPrice = prodectData.productPrice.trim();

    //  if any letter includes
    if (/[a-zA-Z]/.test(chkValidPrice)) {
      toast.error("Price must contain only numbers");
      return;
    }

    // (remove commas, ₹, spaces)
    const price = Number(chkValidPrice.replace(/[^0-9]/g, ""));

    //  final validation
    if (isNaN(price) || price <= 0) {
      toast.error("Enter valid Price");
      return;
    }

    if (!prodectData.productName) return toast.error("Product name required");
    if (!prodectData.brand) return toast.error("Brand is required");
    if (!prodectData.category) return toast.error("Category is required");
    if (!prodectData.productDesc) return toast.error("Description is required");
    if (!prodectData.productPrice)
      return toast.error("productPrice is required");
    const formDAta = new FormData();

    formDAta.append("productName", prodectData.productName.trim());
    formDAta.append("productPrice", price);
    formDAta.append("productDesc", prodectData.productDesc.trim());
    formDAta.append("brand", prodectData.brand.trim());
    formDAta.append("category", prodectData.category.trim());

    if (prodectData.productImage.length === 0) {
      toast.error("Please Select atleast one Image");
      return;
    }
    prodectData.productImage.forEach((img) => formDAta.append("files", img));
    try {
      setLoader(true);
      const res = await axios.post(
        "https://mern-ecommerce-platform-l9bi.onrender.com/api/v1/product/add",
        formDAta,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setProduct([...products, res.data.product]));
        toast.success(res.data.message);
        setProductData({
          productName: "",
          productPrice: "",
          productDesc: "",
          brand: "",
          category: "",
          productImage: [],
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mt-5 mx-auto px-3 sm:px-5 md:px-6">
      <Card className="shadow-sm w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            Add Product
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Enter Product Details Below
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            {/* Product Name */}
            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input
                name="productName"
                placeholder="Ex: iPhone 15"
                value={prodectData.productName}
                onChange={handleProductChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Price */}
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  name="productPrice"
                  placeholder="Ex: 59999"
                  value={prodectData.productPrice}
                  onChange={handleProductChange}
                />
              </div>

              {/* Brand */}
              <div className="grid gap-2">
                <Label>Brand</Label>
                <Input
                  name="brand"
                  placeholder="Ex: Apple"
                  value={prodectData.brand}
                  onChange={handleProductChange}
                />
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  name="category"
                  placeholder="Ex: Mobile"
                  value={prodectData.category}
                  onChange={handleProductChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter product description..."
                name="productDesc"
                value={prodectData.productDesc}
                onChange={handleProductChange}
                className="min-h-[100px]"
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              productImages={prodectData.productImage}
              setProductData={setProductData}
            />
          </div>

          {/* Button */}
          <CardFooter className="mt-6 px-0">
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-2"
              onClick={submitHandler}
              disabled={loader}
            >
              {loader ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Please wait...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
