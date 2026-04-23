import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  deleteAddress,
  setAddresses,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import { ArrowLeft, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { data, useNavigate } from "react-router-dom";
import { addressSchema } from "../validation/addressSchema.js";
import OrderSummary from "@/components/OrderSummary.jsx";

export default function AddressForm() {
  const dispatch = useDispatch();
  const { addresses, selectedAddress, cart } = useSelector(
    (store) => store.product,
  );
  console.log("addresses", addresses);

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const selectAddress = addresses?.[selectedAddress];

  const subTotal = cart?.totalPrice || 0;
  const shipping = subTotal > 50 ? 0 : 10;
  const tax = Math.round(subTotal * 0.05);
  const Total = subTotal + shipping + tax;

  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true,
  );

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    try {
      await addressSchema.validateAt(name, { ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addressSchema.validate(formData, { abortEarly: false });
      setErrors({});
      dispatch(addAddress(formData));
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      });
      setShowForm(false);
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  const handlePayment = async () => {
    try {
      if (selectedAddress === null) {
        return toast.error("Please select an address");
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item?.productId?._id,
            quantity: item?.quantity,
          })),
          amount: Total,
          tax,
          shipping,
          currency: "INR",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!data.success) return toast.error("Something went wrong");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "Ekart",
        description: "Order Payment",

        handler: async (response) => {
          try {
            const verify = await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              response,
              { headers: { Authorization: `Bearer ${accessToken}` } },
            );

            if (verify.data.success) {
              toast.success("Payment Successful");
              dispatch(setCart({ items: [], totalPrice: 0 }));

              navigate("/order-success", {
                state: {
                  orderId: verify.data.order?._id,
                  status: verify.data.order?.status,
                },
              });
            } else toast.error("Payment Failed");
          } catch {
            toast.error("Verification error");
          }
        },

        prefill: {
          name: selectAddress?.fullName,
          email: selectAddress?.email,
          contact: selectAddress?.phone,
        },

        theme: { color: "#F472B6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => toast.error("Payment Failed"));
      rzp.open();
    } catch {
      toast.error("Payment error");
    }
  };

  const getAddress = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/get-address`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setAddresses(res.data.address || []));
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    if (addresses.length > 0) {
      setShowForm(false);
    }
  }, [addresses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6  pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* LEFT */}
        <div>
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Address Page</h1>
          </div>

          {showForm ? (
            <>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="mb-3"
                  onClick={() => setShowForm(false)}
                >
                  <ArrowLeft size={18} />
                </Button>
                <p className="text-gray-500 text-sm sm:text-base my-1">
                  Fill your delivery details
                </p>
              </div>

              <div className="bg-white shadow rounded-2xl border p-4 sm:p-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      "fullName",
                      "phone",
                      "email",
                      "address",
                      "city",
                      "state",
                      "zipCode",
                      "country",
                    ].map((name) => (
                      <div key={name}>
                        <Label className="capitalize p-1.5">{name}</Label>
                        <Input
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                        />
                        <p className="text-red-500 text-xs">{errors[name]}</p>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full h-11">Save & Continue</Button>
                </form>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Saved Addresses</h2>

              {addresses?.map((address, i) => (
                <div
                  key={i}
                  onClick={() => dispatch(setSelectedAddress(i))}
                  className={`border p-4 rounded-lg cursor-pointer relative ${
                    selectedAddress === i
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-300"
                  }`}
                >
                  <p className="font-medium">
                    {address?.fullName || address?.firstName}
                  </p>
                  {console.log("address", address)}
                  <p className="text-sm">
                    {address?.email}, {address?.city}, {address?.address}{" "}
                    {address?.state} , {address?.zipCode} , {address?.phoneNo}{" "}
                    {address?.country}
                  </p>

                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(deleteAddress(i));
                    }}
                    className="absolute top-2 right-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowForm(true)}
              >
                + Add New Address
              </Button>

              <Button
                onClick={handlePayment}
                className="w-full bg-pink-600"
                disabled={!addresses.length || cart?.items?.length === 0}
              >
                Proceed To Checkout
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <OrderSummary
          cart={cart}
          subTotal={subTotal}
          shipping={shipping}
          tax={tax}
          Total={Total}
        />
      </div>
    </div>
  );
}
