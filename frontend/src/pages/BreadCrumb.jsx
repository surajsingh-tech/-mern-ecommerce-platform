import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function BreadCrumbs({ product }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm sm:text-base">
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="hover:text-pink-500 transition">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink
            href="/products"
            className="hover:text-pink-500 transition"
          >
            Products
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold text-gray-800">
            {product?.productName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
