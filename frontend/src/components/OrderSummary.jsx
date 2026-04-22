import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OrderSummary({ cart, subTotal, shipping, tax, Total }) {
  return (
    <div className="lg:sticky lg:top-24">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm sm:text-base">
            <span>Subtotal ({cart?.items?.length})</span>
            <span>₹{subTotal}</span>
          </div>

          <div className="flex justify-between text-sm sm:text-base">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>

          <div className="flex justify-between text-sm sm:text-base">
            <span>Tax</span>
            <span>₹{tax}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{Total}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
