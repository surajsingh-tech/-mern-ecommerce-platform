import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminSales() {
  const [stats, setState] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: [],
  });
  console.log("st", stats);

  const accessToken = localStorage.getItem("accessToken");

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/admin/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        console.log("res", res.data);

        setState(res.data);
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
    fetchStats();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-10">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stats cards */}
        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-xl sm:text-2xl font-bold">
            {stats?.totalUsers}
          </CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-xl sm:text-2xl font-bold">
            {stats?.totalProducts}
          </CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-xl sm:text-2xl font-bold">
            {stats?.totalOrders}
          </CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-xl sm:text-2xl font-bold">
            ₹ {stats?.totalSales}
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="col-span-1 sm:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales (Last 30 Days)</CardTitle>
          </CardHeader>

          <CardContent className="h-[250px] sm:h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.sales}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#F473B6"
                  fill="#FBCFE8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
