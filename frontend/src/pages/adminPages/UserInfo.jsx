import { Button } from "public/src/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "public/src/components/ui/label";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserLogo from "../../assets/user.jpg";
import axios from "axios";
import { toast } from "sonner";
import {
  RadioGroup,
  RadioGroupItem,
} from "public/src/components/ui/radio-group";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "public/src/redux/userSlice";

export default function UserInfo() {
  const [userData, setUserData] = useState("");
  const { userId } = useParams();
  const navigate = useNavigate();

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    profilePic: "",
    role: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  //For admin Safty
  const USER = useSelector((store) => store.user.user);
  const isAdmin = USER?._id === userId && USER.role === "admin";

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  // get user
  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/get-user/${userId}`,
      );
      if (res.data.success) {
        setUserData(res.data.user);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // file change (preview fix)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);

    setUpdateUser((pre) => ({
      ...pre,
      profilePic: previewUrl,
    }));

    setShowPreview(true);
  };

  const prevImagRemover = () => {
    setShowPreview(false);
  };

  // submit
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      const formData = new FormData();

      Object.keys(updateUser).forEach((key) => {
        if (key !== "profilePic") {
          formData.append(key, updateUser[key]);
        }
      });

      // file attach
      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setUpdateUser(res.data.user);
        //if admin change one address then only save in redux store
        if (isAdmin) {
          dispatch(setUser(res.data.user));
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (userData) {
      setUpdateUser({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNo: userData.phoneNo || "",
        address: userData.address || "",
        city: userData.city || "",
        zipCode: userData.zipCode || "",
        profilePic: userData.profilePic || "",
        role: userData.role || "",
      });
    }
  }, [userData]);

  return (
    <>
      {/* Background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate(-1)}
              className="rounded-full shadow-md hover:scale-105 transition"
            >
              <ArrowLeft />
            </Button>

            <h1 className="text-3xl font-bold text-gray-800">Update Profile</h1>
          </div>

          {/* Main Card */}
          <div className="flex flex-col lg:flex-row gap-8 bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-xl border">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <img
                  src={updateUser?.profilePic || UserLogo}
                  alt="Profile"
                  onClick={() => {
                    updateUser?.profilePic && setShowPreview(true);
                  }}
                  className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-pink-500 shadow-lg cursor-pointer transition group-hover:scale-105"
                />

                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition pointer-events-none">
                  View
                </div>
              </div>

              <Label
                htmlFor="pic"
                className="cursor-pointer bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition"
              >
                Change Picture
              </Label>

              <input
                type="file"
                id="pic"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 space-y-5 bg-white p-6 rounded-2xl shadow-md border"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "First Name", name: "firstName" },
                  { label: "Last Name", name: "lastName" },
                  { label: "Phone Number", name: "phoneNo" },
                  { label: "Address", name: "address" },
                  { label: "City", name: "city" },
                  { label: "Zip Code", name: "zipCode" },
                ].map((field) => (
                  <div key={field.name}>
                    <Label className="text-sm font-medium">{field.label}</Label>
                    <input
                      name={field.name}
                      value={updateUser[field.name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none rounded-lg px-3 py-2 mt-1 transition"
                    />
                  </div>
                ))}

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <input
                    value={updateUser.email}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Role */}
              {!isAdmin && (
                <div className="flex flex-col gap-2  bg-gray-50 px-4 py-3 rounded-xl border w-[50%]">
                  {/* Label */}
                  <Label className="text-sm font-medium text-gray-700">
                    Role
                  </Label>

                  {/* Radio Group */}
                  <RadioGroup
                    value={updateUser?.role}
                    onValueChange={(value) =>
                      setUpdateUser((prev) => ({ ...prev, role: value }))
                    }
                    className="flex flex-col sm:flex-row gap-3 sm:gap-6"
                  >
                    {/* User */}
                    <label
                      htmlFor="user"
                      className="flex items-center justify-between sm:justify-start gap-2 cursor-pointer px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 transition w-full sm:w-auto"
                    >
                      <span className="text-sm text-gray-700">User</span>
                      <RadioGroupItem value="user" id="user" />
                    </label>

                    {/* Admin */}
                    <label
                      htmlFor="admin"
                      className="flex items-center justify-between sm:justify-start gap-2 cursor-pointer px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 transition w-full sm:w-auto"
                    >
                      <span className="text-sm text-gray-700">Admin</span>
                      <RadioGroupItem value="admin" id="admin" />
                    </label>
                  </RadioGroup>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> wait...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={updateUser?.profilePic || UserLogo}
              alt="preview"
              className="w-full h-full object-cover"
            />

            <button
              onClick={prevImagRemover}
              className="absolute top-3 right-3 bg-white/80 text-black w-10 h-10 flex items-center justify-center rounded-full shadow hover:scale-110 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
