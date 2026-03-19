import React, { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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

const schema = yup.object().shape({
  firstName: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required(),
  lastName: yup.string().required(),
  email: yup.string().email("Invalid email").required(),
  password: yup
    .string()
    .min(6, "At least 6 characters")
    .matches(/[A-Z]/, "One uppercase required")
    .matches(/[0-9]/, "One number required")
    .matches(/[@$!%*?&#]/, "One special character required")
    .required(),
});
export default function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validEntry, setValidEntry] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState({});
  const getInputData = async (e) => {
    let { name, value } = e.target;
    try {
      const trimmedValue = value.trim();
      setFormData((pre) => ({
        ...pre,
        [name]: trimmedValue,
      }));
      await schema.validateAt(name, { ...formData, [name]: trimmedValue });
      setErrorMsg((pre) => ({
        ...pre,
        [name]: null,
      }));
      setValidEntry((pre) => ({
        ...pre,
        [name]: true,
      }));
    } catch (error) {
      setErrorMsg((pre) => ({
        ...pre,
        [name]: [error.message],
      }));
      setValidEntry((pre) => ({
        ...pre,
        [name]: false,
      }));
    }
  };
  const navigate = useNavigate();
  const sendFormData = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrorMsg({});

      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        // for Yup error
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = [err.message];
        });
        setErrorMsg(newErrors);
        toast.error("Please fix the highlighted errors");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error(error.message || "Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center min-h-screen items-center bg-pink-200 ">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter given details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={sendFormData}>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Your First Name"
                    onChange={getInputData}
                    value={formData.firstName}
                    className={`${
                      errorMsg.firstName
                        ? "border-red-500 focus-visible:ring-red-500"
                        : validEntry?.firstName &&
                          "border-green-500  focus-visible:ring-green-200"
                    } }`}
                  />
                  {errorMsg.firstName && (
                    <p className="text-red-500 text-sm mt-2">
                      {errorMsg.firstName[0]}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lasttName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Your Last Name"
                    onChange={getInputData}
                    value={formData.lastName}
                    className={`${
                      errorMsg.lastName
                        ? "border-red-500 focus-visible:ring-red-500"
                        : validEntry?.lastName &&
                          "border-green-500  focus-visible:ring-green-200"
                    } }`}
                  />

                  {errorMsg.lastName && (
                    <p className="text-red-500 text-sm mt-2">
                      {errorMsg.lastName[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  onChange={getInputData}
                  value={formData.email}
                  className={`${
                    errorMsg.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : validEntry?.email &&
                        "border-green-500  focus-visible:ring-green-200"
                  } }`}
                />
                {errorMsg.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errorMsg.email[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    onChange={getInputData}
                    value={formData.password}
                    placeholder="Enter Your Password Here"
                    type={showPass ? "text" : "password"}
                    className={`${
                      errorMsg.password
                        ? "border-red-500 focus-visible:ring-red-500"
                        : validEntry?.password &&
                          "border-green-500  focus-visible:ring-green-200"
                    } }`}
                  />
                  {errorMsg.password && (
                    <p className="text-red-500 text-sm mt-2">
                      {errorMsg.password[0]}
                    </p>
                  )}

                  <div
                    className="absolute right-4 top-2 text-gray-700 cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full mt-3 cursor-pointer bg-pink-500 hover:bg-pink-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner className="w-6 h-6 " /> loading...
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <p className="text-gray-700 text-sm">
            Already have an account ?{" "}
            <Link className="hover:underline text-pink-800" to={"/login"}>
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
