import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import UserLogo from '../assets/user.jpg'
export default function Profile() {
  const { userId } = useParams();

  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phoneNo: user?.phoneNo ?? "",
    address: user?.address ?? "",
    city: user?.city ?? "",
    zipCode: user?.zipCode ?? "",
    profilePic: user?.profilePic ?? "",
    role: user?.role ?? "",
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser((pre) => ({
      ...pre,
      profilePic: URL.createObjectURL(selectedFile),
    })); //Preview only
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // check if data is unchanged
      const hasChanges = Object.keys(updateUser).some(
        (key) => updateUser[key] !== (user?.[key] ?? ""),
      );

      if (!hasChanges && !file) {
        toast.info("please Update Some Data First");
        return;
      }

      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      //use form data for text+file
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("address", updateUser.address);
      formData.append("role", updateUser.role);
      formData.append("city", updateUser.city);
      if (file) {
        formData.append("file", file); //image file for backend multer
      }

      const res = await axios.put(
        `http://localhost:3000/api/v1/user/update/${userId}`,
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
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pt-20 min-h-screen bg-gray-100 ">
        <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div>
              <div className="flex flex-col justify-center align-center items-center bg-gray-100">
                <h1 className="font-bold mb-7 text-2xl sm:text-3xl md:text-4xl lg:text-7xl text-gray-800">
                  Update Profile
                </h1>
                <div className=" flex flex-col  sm:flex-row w-full  gap-10 justify-between items-center sm:items-start px-7 max-w-3xl sm:max-w-2xl lg:max-w-7xl  ">
                  {/* profile picture */}
                  <div className="flex flex-col justify-center items-center ">
                    <img
                      src={updateUser?.profilePic || UserLogo}
                      alt="Profile"
                      onClick={() => setPreviewOpen(true)} 
                      className="h-35 w-35  md:w-55 md:h-45 lg:w-50 lg:h-50  rounded-full object-cover border-4 border-pink-800"
                    />
                    <Label
                      htmlFor="pic"
                      className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
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
                  {/* profile form  */}
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-sm font-medium">
                          First Name
                        </Label>
                        <input
                          onChange={handleChange}
                          type="text"
                          value={updateUser.firstName}
                          name="firstName"
                          placeholder="Enter your First Name"
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                      </div>
                      <div className="">
                        <Label className="block text-sm font-medium">
                          Last Name
                        </Label>
                        <input
                          onChange={handleChange}
                          type="text"
                          value={updateUser.lastName}
                          name="lastName"
                          placeholder="Enter your Last Name"
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium">
                          Email
                        </Label>
                        <input
                          onChange={handleChange}
                          type="email"
                          value={updateUser.email}
                          name="email"
                          disabled
                          className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium">
                          Phone Number
                        </Label>
                        <input
                          onChange={handleChange}
                          value={updateUser.phoneNo}
                          type="text"
                          name="phoneNo"
                          placeholder="Enter your Contact No"
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium">
                          Address
                        </Label>
                        <input
                          onChange={handleChange}
                          value={updateUser.address}
                          type="text"
                          name="address"
                          placeholder="Enter your Address"
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium">
                          City
                        </Label>
                        <input
                          onChange={handleChange}
                          value={updateUser.city}
                          type="text"
                          name="city"
                          placeholder="Enter your City"
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium">
                          Zip Code
                        </Label>
                        <input
                          onChange={handleChange}
                          value={updateUser.zipCode}
                          type="text"
                          name="zipCode"
                          placeholder="Enter your Zip Code"
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg"
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
          </TabsContent>
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Track performance and user engagement metrics. Monitor trends
                  and identify growth opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Page views are up 25% compared to last month.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div>
        {/* Modal */}
        {previewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative">
              <img
                src={updateUser.profilePic}
                alt="Preview"
                className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
              />
              <button
                onClick={() => setPreviewOpen(false)}
                className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg shadow hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
