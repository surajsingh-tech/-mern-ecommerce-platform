import { CheckCircle, Package, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "public/src/components/ui/button";
import { Card, CardContent } from "public/src/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const { orderId, status } = location.state || {};
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4 py-10 sm:p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <Card className="rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-pink-100">
          <CardContent className="p-5 sm:p-8 text-center space-y-5 sm:space-y-6">
            {/* ICON */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-pink-100 p-4 sm:p-5 rounded-full animate-bounce">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-pink-600" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 text-pink-400 animate-pulse" />
              </div>
            </div>

            {/* TEXT */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Order Placed Successfully 🎉
              </h1>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Thank you for your purchase. Your order is being prepared with
                care.
              </p>
            </div>

            {/* ORDER INFO */}
            <div className="bg-white/70 border border-pink-100 rounded-xl sm:rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Package className="text-pink-600 w-5 h-5" />
                </div>

                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">Order ID</p>
                  <p className="text-xs text-gray-500 break-all">
                    {orderId || "N/A"}
                  </p>
                </div>
              </div>

              <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full self-start sm:self-auto">
                {status || "Paid"}
              </span>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                className="w-full rounded-xl bg-pink-600 hover:bg-pink-700"
                onClick={() => navigate("/orders")}
              >
                Track Order
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/products")}
                className="w-full rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
