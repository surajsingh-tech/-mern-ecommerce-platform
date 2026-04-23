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

const schema = yup.object().shape({
  firstName: yup.string().min(3, "at least 3 characters required").required(),
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
      setValidEntry((pre) => ({ ...pre, [name]: true }));
    } catch (error) {
      setErrorMsg((pre) => ({ ...pre, [name]: [error.message] }));
      setValidEntry((pre) => ({ ...pre, [name]: false }));
    }
  };

  const sendFormData = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(formData, { abortEarly: false });
      setErrorMsg({});
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/register`,
        formData,
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/verify", { state: { email: formData.email } });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = [err.message];
        });
        setErrorMsg(newErrors);
        toast.error("Fix the errors");
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
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Create Your Account
          </CardTitle>
          <CardDescription>
            Join us for a better shopping experience
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={sendFormData} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  placeholder="First Name"
                  onChange={getInputData}
                  value={formData.firstName}
                  className={`mt-1.5 transition ${
                    errorMsg.firstName
                      ? "border-red-500"
                      : validEntry?.firstName &&
                        "border-green-500 focus-visible:border-green-700"
                  }`}
                />
                {errorMsg.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorMsg.firstName[0]}
                  </p>
                )}
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  onChange={getInputData}
                  value={formData.lastName}
                  className={`mt-1.5 transition ${
                    errorMsg.lastName
                      ? "border-red-500"
                      : validEntry?.lastName &&
                        "border-green-500 focus-visible:border-green-700"
                  }`}
                />
                {errorMsg.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorMsg.lastName[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="example@mail.com"
                onChange={getInputData}
                value={formData.email}
                className={` mt-1.5 transition ${
                  errorMsg.email
                    ? "border-red-500"
                    : validEntry?.email &&
                      "border-green-500 focus-visible:border-green-700"
                }`}
              />
              {errorMsg.email && (
                <p className="text-red-500 text-xs mt-1">{errorMsg.email[0]}</p>
              )}
            </div>

            <div>
              <Label>Password</Label>

              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter strong password"
                  onChange={getInputData}
                  value={formData.password}
                  className={`mt-1.5 pr-10 ${
                    errorMsg.password
                      ? "border-red-500"
                      : validEntry?.password &&
                        "border-green-500 focus-visible:border-green-700"
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

            <Button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" /> Creating...
                </div>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 text-pink-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
