import { Spinner } from "public/src/components/ui/spinner";
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Verify() {
  const email = useLocation()?.state?.email || "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const resendMail = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://mern-ecommerce-platform-l9bi.onrender.com/api/v1/user/reverify",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/verify-otp");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200 px-4">
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl rounded-3xl p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">📩</div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Check your email
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed">
          We’ve sent a verification link to <br />
          <span className="font-semibold text-gray-800">{email}</span>
        </p>

        <p className="text-gray-400 text-xs mt-3">
          Please check your inbox (and spam folder just in case)
        </p>

        <div className="mt-6 space-y-3">
          <button
            disabled={loading}
            onClick={resendMail}
            className="w-full py-2 flex justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-md hover:scale-105 transition"
          >
            {loading ? (
              <>
                <Spinner className="w-6 h-6 mr-1" /> loading...
              </>
            ) : (
              " Resend Email"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
