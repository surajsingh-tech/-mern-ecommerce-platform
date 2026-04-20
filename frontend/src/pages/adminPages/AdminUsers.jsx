import { Input } from "@/components/ui/input";
import axios from "axios";
import { Edit, Eye, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import UserLogo from "../../assets/user.jpg";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminUsers() {
  const accessToken = localStorage.getItem("accessToken");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  console.log("users",users);
  
  
  const navigate = useNavigate();
  const filterUsers = useMemo(() => {
    const searchValue = debouncedSearch.trim().toLowerCase();
    return users?.filter((user) => {
      if (!searchValue) return true;
      return (
        user?.firstName?.toLowerCase().includes(searchValue) ||
        user?.lastName?.toLowerCase().includes(searchValue) ||
        user?.email?.toLowerCase().includes(searchValue) ||
        user?.role?.toLowerCase().includes(searchValue)
      );
    });
  }, [debouncedSearch, users]);

  const getAllUsres = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/admin/all-users",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  useEffect(() => {
    getAllUsres();
  }, []);
  return (
    <div className=" py-10 pr-20 mx-auto px-4">
      <h1 className="font-bold text-2xl">User Management</h1>
      <p className="">View and Manage Register User's</p>
      <div className="flex relative w-[300px] mt-6 ">
        <Search className="absolute top-1.5 left-2 text-gray-600 w-5 " />
        <Input
          className="pl-10"
          placeholder="Search Users "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-7 mt-7">
        {filterUsers?.map((user, indx) => (
          <div className="bg-pink-100 p-5  rounded-lg " key={indx}>
            <div className="flex items-center gap-2 ">
              <img
                src={user?.profilePic || UserLogo}
                alt="User Image"
                className="rounded-full w-18 aspect-square object-cover border border-pink-600"
              />
              <div className="">
                <h1 className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </h1>
                <h3 className="font-sm">{user?.email}</h3>
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                className="cursor-pointer"
              >
                {" "}
                <Edit /> Edit{" "}
              </Button>
              {user?.role !== "admin" ? (
                <Button
                  onClick={() =>
                    navigate(`/dashboard/users/orders/${user?._id}`)
                  }
                >
                  {" "}
                  <Eye /> ShowOrder{" "}
                </Button>
              ) : (
                <Button variant="outline" >admin</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
