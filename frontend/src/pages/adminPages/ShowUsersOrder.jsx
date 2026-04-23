import OrderCart from "public/src/components/OrderCart";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ShowUserOrders() {
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);
  const [userOrder, setUserOrder] = useState([]);
  const { userId } = useParams();

  const getUserOrder = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/admin/user-orders/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUserOrder(res?.data?.orders);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserOrder();
  }, []);
  return <OrderCart userOrder={userOrder} loading={loading} />;
}
