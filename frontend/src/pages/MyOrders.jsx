import OrderCart from "/src/components/OrderCart";

import axios from "axios";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MyOrders() {
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);
  const [userOrder, setUserOrder] = useState([]);

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

  return <OrderCart userOrder={userOrder} loading={loading} />;
}
