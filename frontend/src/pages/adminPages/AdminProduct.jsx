import { Input } from "public/src/components/ui/input";
import { Edit, Loader2, Search, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "public/src/components/ui/select";
import { Button } from "public/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "public/src/components/ui/dialog";
import { Field } from "public/src/components/ui/field";
import { Label } from "public/src/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "public/src/components/ui/card";
import ImageUpload from "public/src/components/ImageUpload";
import axios from "axios";
import { toast } from "sonner";
import { setProduct } from "public/src/redux/productSlice";
import { Textarea } from "public/src/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "public/src/components/ui/alert-dialog";
import useDebounce from "public/src/hooks/useDebounce";
import NoDataAvailable from "public/src/components/NoDataAvailable";
import { useSearchParams } from "react-router-dom";

export default function AdminProduct() {
  const allProducts = useSelector((store) => store.product.products || []);
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const [editProduct, setEditProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dltId, setDltId] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const searchValue = debouncedSearch?.toLowerCase()?.trim();

  //if user click edit product from home or order page
  const [searchParams] = useSearchParams();
  const product = searchParams.get("product" || "");
  const editItem = allProducts?.find((p) => p._id === product);

  const [sort, setSort] = useState("");

  const filterProducts = useMemo(() => {
    let result = allProducts?.filter((p) => {
      if (!searchValue) return true;

      return (
        p?.productName?.toLowerCase().includes(searchValue) ||
        p?.category?.toLowerCase().includes(searchValue) ||
        p?.brand?.toLowerCase().includes(searchValue) ||
        p?.productPrice?.toString().includes(searchValue)
      );
    });

    if (sort === "loToHigh") {
      result = [...result].sort((a, b) => a.productPrice - b.productPrice);
    }

    if (sort === "highToLow") {
      result = [...result].sort((a, b) => b.productPrice - a.productPrice);
    }

    return result;
  }, [allProducts, searchValue, sort]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setIsEditOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editProduct?.productName?.trim())
      return toast.error("Product name required");

    const formData = new FormData();
    formData.append("productName", editProduct.productName.trim());
    formData.append("productPrice", Number(editProduct.productPrice));
    formData.append("productDesc", editProduct.productDesc.trim());
    formData.append("brand", editProduct.brand.trim());
    formData.append("category", editProduct.category.trim());

    const existingImages = editProduct?.productImage
      ?.filter((img) => !(img instanceof File && img?.public_id))
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    editProduct?.productImage
      ?.filter((img) => img instanceof File)
      .forEach((file) => formData.append("files", file));

    try {
      setLoader(true);
      const res = await axios.put(
        `https://mern-ecommerce-platform-l9bi.onrender.com/api/v1/product/update/${editProduct._id}`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updated = allProducts.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );
        dispatch(setProduct(updated));
        setIsEditOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoader(false);
    }
  };

  const deleteProduct = async (id) => {
    setDltId(id);
    try {
      const res = await axios.delete(
        `https://mern-ecommerce-platform-l9bi.onrender.com/api/v1/product/delete/${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setProduct(allProducts.filter((p) => p._id !== id)));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setDltId(null);
    }
  };

  //
  useEffect(() => {
    if (editItem) {
      handleEditClick(editItem);
    }
  }, [editItem]);

  return (
    <>
      {filterProducts?.length > 0 ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-10">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-stretch md:items-center mb-6">
            {/* SEARCH */}
            <div className="relative w-full md:max-w-xs">
              <Input
                placeholder="Search products..."
                className="pl-10 h-11 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            </div>

            {/* SORT */}
            <Select onValueChange={(value) => setSort(value)}>
              <SelectTrigger className="w-full md:w-[200px] h-11 rounded-xl bg-white">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loToHigh">Low → High</SelectItem>
                <SelectItem value="highToLow">High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterProducts.map((product) => (
              <Card
                key={product._id}
                className="p-4 rounded-2xl shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex gap-3">
                  <img
                    src={product?.productImage?.[0]?.url}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h1 className="font-semibold line-clamp-2 text-sm sm:text-base">
                      {product.productName}
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                      ₹{" "}
                      {new Intl.NumberFormat("en-IN").format(
                        product.productPrice,
                      )}
                    </p>

                    {/* ACTIONS */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(product)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 text-green-500" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={dltId === product._id}
                            className="flex-1"
                          >
                            {dltId === product._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-red-500" />
                            )}
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProduct(product._id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* EDIT MODAL */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="w-[95%] sm:max-w-[650px] max-h-[85vh] overflow-y-auto rounded-2xl">
              <form onSubmit={handleSave} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
                  <DialogDescription>Update product details</DialogDescription>
                </DialogHeader>

                <Field>
                  <Label>Product Name</Label>
                  <Input
                    name="productName"
                    value={editProduct?.productName || ""}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    name="productPrice"
                    value={editProduct?.productPrice || ""}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <Label>Description</Label>
                  <Textarea
                    name="productDesc"
                    value={editProduct?.productDesc || ""}
                    onChange={handleChange}
                  />
                </Field>

                <ImageUpload
                  productImages={editProduct?.productImage}
                  setProductData={setEditProduct}
                />

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button type="submit" disabled={loader} className="flex-1">
                    {loader ? <Loader2 className="animate-spin" /> : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <NoDataAvailable
          title="No Products Found"
          description="Add new products to start managing inventory."
          buttonText="Add Product"
          navigateTo="/dashboard/add-product"
        />
      )}
    </>
  );
}
