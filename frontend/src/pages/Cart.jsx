import NoDataAvailable from "@/components/NoDataAvailable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { setCart } from "@/redux/productSlice";
import axios from "axios";
import { Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Cart() {
  const cart = useSelector((store) => store.product?.cart || {});
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const subTotal = cart?.totalPrice || 0;
  const shipping = subTotal > 299 ? 0 : 10;
  const tax = Number((subTotal * 0.05).toFixed(2));
  const total = subTotal + shipping + tax;

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        "https://mern-ecommerce-platform-l9bi.onrender.com/api/v1/cart/update",
        { productId, type },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error ❌");
    }
  };

  const removeProductFromCart = async (productId) => {
    try {
      const res = await axios.delete(
        "https://mern-ecommerce-platform-l9bi.onrender.com/api/v1/cart/remove",
        {
          data: { productId },
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const loadCart = async () => {
    try {
      const res = await axios.get(
        "https://mern-ecommerce-platform-l9bi.onrender.com/api/v1/cart",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 pt-20 sm:px-6 lg:px-10">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-6">Shopping Cart</h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT SIDE */}
            <div className="flex-1 space-y-4">
              {cart.items.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    {/* Product Info */}
                    <div className="flex gap-4 items-center w-full sm:w-[40%]">
                      <img
                        src={item?.productId?.productImage?.[0]?.url}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium line-clamp-2">
                          {item?.productId?.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₹ {item?.productId?.productPrice}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          handleUpdateQuantity(item.productId._id, "decrease")
                        }
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateQuantity(item.productId._id, "increase")
                        }
                      >
                        +
                      </Button>
                    </div>

                    {/* Price */}
                    <p className="font-medium">
                      ₹ {item.productId.productPrice * item.quantity}
                    </p>

                    {/* Remove */}
                    <button
                      onClick={() => removeProductFromCart(item.productId._id)}
                      className="flex items-center gap-1 text-red-500 text-sm"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-[350px]">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹ {subTotal}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>₹ {shipping}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>₹ {tax}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹ {Math.round(total)}</span>
                  </div>

                  <div className="flex gap-2">
                    <Input placeholder="Promo Code" />
                    <Button variant="outline">Apply</Button>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => navigate("/address")}
                  >
                    Place Order
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Link to="/products">Continue Shopping</Link>
                  </Button>

                  <div className="text-xs text-gray-500">
                    <p>* Free shipping above ₹299</p>
                    <p>* 15 days return</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <NoDataAvailable
          title="Your cart is empty 🛒"
          description="Add some products to get started"
          buttonText="Shop Now"
          navigateTo="/products"
        />
      )}
    </div>
  );
}
