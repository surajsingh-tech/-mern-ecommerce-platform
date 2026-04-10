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
  const cart = useSelector((store) => store.product?.cart || []);
  console.log("cart value is", cart);

  const subTotal = cart?.totalPrice;
  const shipping = subTotal > 299 ? 0 : 10;
  const tax = Number((subTotal * 0.05).toFixed(2)); //5 % tax
  const total = Number(subTotal + shipping + tax);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        "http://localhost:3000/api/v1/cart/update",
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("Server not responding ⚠️");
      } else {
        toast.error("Something went wrong ❌");
      }
    }
  };

  const removeProductFromCart = async (productId) => {
    try {
      const res = await axios.delete(
        "http://localhost:3000/api/v1/cart/remove",
        {
          data: { productId },
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
    }
  };

  const loadCart = async (req, res) => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/cart/add",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
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
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch]);
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-7">
            Shopping Cart
          </h1>
          <div className="max-w-7xl mx-auto flex gap-7">
            <div className="flex flex-col gap-5 flex-1">
              {cart?.items?.map((product, indx) => (
                <Card key={product._id || indx}>
                  <div className="flex justify-between items-center pr-7">
                    <div className="flex items-center w-[350px] ">
                      <img
                        src={
                          product?.productId?.productImage?.[0]?.url ||
                          "/images/user.jpg"
                        }
                        className="w-20 h-30 mx-6"
                        alt="Product Image"
                      />
                      <div className="w-[280px] ">
                        <p className="truncate">
                          {product?.productId?.productName}
                        </p>
                        <p>₹ {product?.productId?.productPrice}</p>
                      </div>
                    </div>
                    <div className="flex gap-5 items-center ">
                      <Button
                        disabled={product?.quantity <= 1}
                        variant="outline"
                        onClick={() =>
                          handleUpdateQuantity(
                            product?.productId?._id,
                            "decrease",
                          )
                        }
                      >
                        -
                      </Button>
                      <span>{product?.quantity || 1}</span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleUpdateQuantity(
                            product?.productId?._id,
                            "increase",
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                    <p>
                      ₹ {product?.productId?.productPrice * product?.quantity}
                    </p>
                    <p
                      className="flex text-red-500 items-center gap-1 cursor-pointer"
                      onClick={() => removeProductFromCart(product?.productId?._id)}
                    >
                      {" "}
                      <Trash2 className="w-4 h-4" /> Remove
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            <div>
              <Card className="w-[400px]">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>
                      TotalPrice ₹{" "}
                      {cart?.totalPrice?.toLocaleString("en-IN")}{" "}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹ {shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹ {tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹ {Math.round(total).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="flex space-x-2">
                      <Input placeholder="Promo Code" />
                      <Button variant="outline">Apply</Button>
                    </div>
                    <Button className="w-full bg-pink-600">Place Order</Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground pt-4">
                    <p>* Free Shipping on Order Over ₹ 299 </p>
                    <p>* 15-days return policy </p>
                    <p>* Secure checkout with SSL encryption </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <NoDataAvailable
          title={"Your cart is empty 🛒"}
          description={
            "Your cart is waiting. Let’s fill it with something amazing ✨"
          }
          buttonText={"Shop Now"}
          navigateTo={"/products"}
        />
      )}
    </div>
  );
}
