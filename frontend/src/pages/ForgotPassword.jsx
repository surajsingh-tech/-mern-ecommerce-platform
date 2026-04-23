import React, { useState } from "react";
import { Button } from "public/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "public/src/components/ui/card";
import { Input } from "public/src/components/ui/input";
import { Label } from "public/src/components/ui/label";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/forgot-password`,
        { email },
      );

      if (res.data.success) {
        toast.success("Email send Successfully ");
        navigate(`/verify-otp/${email}`);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-pink-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Forget Password</CardTitle>
          <CardDescription>
            Enter your email here to forget password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Button */}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
