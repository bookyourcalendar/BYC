"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { userId, isLoaded } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    console.log(userId);

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://www.bookyourcalendar.com/api/admin/profile/?userId=${userId}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://www.bookyourcalendar.com',
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user");

        const { data } = await response.json();
        console.log(data);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, isLoaded]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 border-4 border-blue-500 shadow-md">
            <AvatarImage
              src={user?.imageUrl || "/user-avatar.png"}
              alt="User Avatar"
            />
            <AvatarFallback className="text-2xl font-bold bg-blue-300 text-white">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            {user?.name || "User Name"}
          </h2>
          <p className="text-gray-500">{user?.email || "user@email.com"}</p>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Profile Details
          </h3>
          <div className="grid grid-cols-1 gap-4 mt-3">
            <div>
              <p className="text-gray-500 text-sm">User ID</p>
              <p className="text-gray-800 font-medium">
                {user?.id || "Not Available"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Subscription Plan</p>
              <p className="text-gray-800 font-medium capitalize">
                {user?.subscriptionPlan || "None"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-100"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
