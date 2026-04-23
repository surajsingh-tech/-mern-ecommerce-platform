import React from "react";

import {
  Laptop,
  ShieldCheck,
  Truck,
  Headphones,
  RefreshCcw,
  PackageCheck,
  BadgeCheck,
  Boxes,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";


export default function Features() {
  const features = [
    {
      icon: <Laptop className="icon text-blue-600" />,
      title: "Latest Products",
      desc: "Get access to the newest and trending gadgets.",
    },
    {
      icon: <ShieldCheck className="icon text-green-600" />,
      title: "Secure Payments",
      desc: "100% secure payment methods with trusted gateways.",
    },
    {
      icon: <Truck className="icon text-orange-500" />,
      title: "Fast Delivery",
      desc: "Quick and reliable delivery to your doorstep.",
    },
    {
      icon: <Headphones className="icon text-purple-600" />,
      title: "24/7 Support",
      desc: "We are always here to help you anytime.",
    },
    {
      icon: <BadgeCheck className="icon text-emerald-600" />,
      title: "Warranty Assurance",
      desc: "All products come with official brand warranty.",
    },
    {
      icon: <RefreshCcw className="icon text-yellow-600" />,
      title: "Easy Returns",
      desc: "Hassle-free 7-day return and replacement policy.",
    },
    {
      icon: <Boxes className="icon text-indigo-600" />,
      title: "Wide Range",
      desc: "Explore laptops, mobiles, accessories & more.",
    },
    {
      icon: <PackageCheck className="icon text-pink-600" />,
      title: "Customer Satisfaction",
      desc: "Trusted by thousands of happy customers.",
    },
  ];

  return (
    <section className="py-8 sm:py-10 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Heading */}
      <div className="text-center mb-8 sm:mb-10 px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-600">
          Why Choose Us
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
          We provide the best experience with top-quality electronics and
          trusted services.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((item, index) => (
          <Card
            key={index}
            className="rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
          >
            <CardContent className="flex flex-col items-center text-center p-5 sm:p-6">
              {/* Icon */}
              <div className="mb-3">
                {React.cloneElement(item.icon, {
                  className:
                    item.icon.props.className + " w-9 h-9 sm:w-10 sm:h-10",
                })}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
