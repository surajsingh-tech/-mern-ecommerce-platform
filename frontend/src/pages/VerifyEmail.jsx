import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setStatus("Email Verified Successfully 🎉");
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setStatus("Verification Failed ❌");
      setLoading(false);

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

  useEffect(() => {
    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200 px-4">
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl rounded-3xl p-8 w-full max-w-md text-center transition-all">
        {/* Loader */}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Icon */}
        {!loading && (
          <div className="text-4xl mb-3">
            {status.includes("Successfully") ? "✅" : "❌"}
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Email Verification
        </h2>

        {/* Status */}
        <p className="text-gray-600">{status}</p>

        {/* Button */}
        {!loading && (
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-md hover:scale-105 transition"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}
