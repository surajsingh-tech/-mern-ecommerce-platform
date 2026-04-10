import React from "react";
import { Truck, Shield, Headphones } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Free Shipping",
      desc: "On orders over ₹ 299",
      icon: Truck,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Secure Payment",
      desc: "100% secure transactions",
      icon: Shield,
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "24/7 Support",
      desc: "Dedicated support",
      icon: Headphones,
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
  ];

  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 rounded-xl hover:shadow-md transition"
              >
                {/* Icon */}
                <div
                  className={`h-12 w-12 ${item.bg} rounded-full flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 ${item.text}`} />
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
