import React, { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import * as yup from "yup";
import { setUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required(),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState({});
  const navigate = useNavigate();

  const getInputData = async (e) => {
    let { name, value } = e.target;
    const trimmedValue = value.trim();

    setFormData((pre) => ({
      ...pre,
      [name]: trimmedValue,
    }));

    try {
      await schema.validateAt(name, { ...formData, [name]: trimmedValue });
      setErrorMsg((pre) => ({ ...pre, [name]: null }));
    } catch (error) {
      setErrorMsg((pre) => ({ ...pre, [name]: [error.message] }));
    }
  };

  const sendFormData = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(formData, { abortEarly: false });
      setErrorMsg({});
      setLoading(true);

      const res = await axios.post(
        "https://mern-ecommerce-platform-l9bi.onrender.com/api/v1/user/login",
        formData,
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data?.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = [err.message];
        });
        setErrorMsg(newErrors);
        toast.error("Please fix the errors");
      } else if (error.response) {
        toast.error(error.response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 px-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/80 shadow-2xl rounded-3xl border border-gray-200">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Welcome Back 👋
          </CardTitle>
          <CardDescription className="text-gray-600">
            Login to continue your shopping journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={sendFormData} className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Email Address</Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email address"
                onChange={getInputData}
                value={formData.email}
                className={`mt-1.5 transition ${
                  errorMsg.email ? "border-red-500" : ""
                }`}
              />
              {errorMsg.email && (
                <p className="text-red-500 text-xs mt-1">{errorMsg.email[0]}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Password</Label>

              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter your secure password"
                  onChange={getInputData}
                  value={formData.password}
                  className={`mt-1.5 pr-10 ${
                    errorMsg.password ? "border-red-500" : ""
                  }`}
                />

                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-4 cursor-pointer text-gray-600"
                >
                  {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
                </span>
              </div>

              {errorMsg.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errorMsg.password[0]}
                </p>
              )}
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-gray-500 hover:underline hover:text-gray-700"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" /> Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?
            <Link
              to="/signup"
              className="ml-1 text-pink-600 font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
