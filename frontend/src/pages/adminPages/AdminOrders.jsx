import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "public/src/components/ui/table";
import { Badge } from "public/src/components/ui/badge";
import Loader from "public/src/components/Loader";

export default function AdminOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/admin/allordrs`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (res.data.success) {
        setAllOrders(res.data.orders);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Orders Management</h1>

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Loader />
        </div>
      ) : allOrders.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No Orders Found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {allOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow p-4 space-y-3"
              >
                <p className="text-xs break-all text-gray-500">{order._id}</p>

                <div>
                  <p className="font-medium">{order?.user?.firstName}</p>
                  <p className="text-xs text-gray-500 break-all">
                    {order?.user?.email}
                  </p>
                </div>

                <div className="space-y-2">
                  {order?.products?.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <img
                        src={item?.productId?.productImage?.[0]?.url}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="text-xs min-w-0">
                        <p className="line-clamp-2 break-words">
                          {item?.productId?.productName}
                        </p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold">₹ {order.amount}</span>

                  <Badge
                    className={`text-white text-xs ${
                      order.status === "Paid"
                        ? "bg-green-500"
                        : order.status === "Failed"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                  >
                    {order.status}
                  </Badge>
                </div>

                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden sm:block bg-white rounded-xl shadow overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[850px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">Order ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="w-[250px]">Products</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {allOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="w-[160px]">
                        <span className="break-all text-xs block">
                          {order._id}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {order?.user?.firstName}
                          </span>
                          <span className="text-xs text-gray-500 break-all">
                            {order?.user?.email}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="w-[250px]">
                        <div className="space-y-2">
                          {order?.products?.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <img
                                src={item?.productId?.productImage?.[0]?.url}
                                className="w-10 h-10 rounded object-cover flex-shrink-0"
                              />
                              <div className="text-xs min-w-0">
                                <p className="line-clamp-2 break-words">
                                  {item?.productId?.productName?.slice(0, 55)}
                                </p>
                                <p className="text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="font-semibold whitespace-nowrap">
                        ₹ {order.amount}
                      </TableCell>

                      <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={`text-white text-xs ${
                            order.status === "Paid"
                              ? "bg-green-500"
                              : order.status === "Failed"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
