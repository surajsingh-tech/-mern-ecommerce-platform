import NoDataAvailable from "@/components/NoDataAvailable";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function MyOrders() {
  const accessToken = localStorage.getItem("accessToken");

  // ✅ FIX: null se array (important)
  const [userOrder, setUserOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getUserOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setUserOrder(res.data.orders || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button onClick={() => navigate(-1)} variant="outline" size="icon">
            <ArrowLeft />
          </Button>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              My Orders
            </h1>
            <p className="text-xs text-gray-500">Track your purchases</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500 text-center">Loading orders...</p>
        )}

        {/* No Orders */}
        {!loading && userOrder.length === 0 ? (
          <NoDataAvailable
            title="No Orders Found"
            description="You haven’t placed any orders yet. Start shopping to see your orders here."
            buttonText="Start Shopping"
            navigateTo="/products"
          />
        ) : (
          <div className="space-y-5">
            {userOrder.map((order) => (
              <div
                key={order?._id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 md:p-5"
              >
                {/* Top Row */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                  <div className="text-xs text-gray-500 break-all">
                    <p className="font-semibold text-gray-700">#{order?._id}</p>
                    <p className="text-[11px] text-gray-400">
                      {order?.user?.firstName} {order?.user?.lastName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 md:gap-5">
                    <p className="text-sm font-semibold text-gray-800">
                      {order?.currency} {order?.amount?.toFixed(2)}
                    </p>

                    <span
                      className={`text-[11px] px-3 py-[3px] rounded-full text-white ${
                        order?.status === "Paid"
                          ? "bg-green-500"
                          : order?.status === "Failed"
                            ? "bg-red-500"
                            : "bg-orange-400"
                      }`}
                    >
                      {order?.status}
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-2">
                  {order?.products?.map((product, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
                    >
                      <img
                        src={product?.productId?.productImage?.[0]?.url}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover"
                      />

                      <div className="flex-1">
                        <p className="text-sm text-gray-700 line-clamp-1">
                          {product?.productId?.productName}
                        </p>
                      </div>

                      <p className="text-xs text-gray-500">
                        × {product?.quantity}
                      </p>

                      <p className="text-sm font-medium text-gray-800">
                        ₹ {product?.productId?.productPrice}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
