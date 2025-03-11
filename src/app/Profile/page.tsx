import React from 'react'
import Image from "next/image";
import { Edit, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Profile = () => {
  return (
     <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        {/* Header Section */}
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 border-4 border-[#407BFF] shadow-md">
            <AvatarImage src="/user-avatar.png" alt="User Avatar" />
            <AvatarFallback className="text-2xl font-bold bg-[#8CB0FF] text-white">
              AA
            </AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-semibold text-[#2D2D2D] mt-4">
            Alex Anderson
          </h2>
          <p className="text-gray-500">alex.anderson@email.com</p>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            {/* <Button className="bg-[#407BFF] text-white hover:bg-[#8CB0FF] flex items-center gap-2">
              <Edit className="w-4 h-4" /> Edit Profile
            </Button> */}
            <Button variant="outline" className="border-[#407BFF] text-[#407BFF] hover:bg-[#D5ECF5] flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-[#2D2D2D]">Profile Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="text-[#2D2D2D] font-medium">+1 234 567 890</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="text-[#2D2D2D] font-medium">Administrator</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Address</p>
              <p className="text-[#2D2D2D] font-medium">123 Main St, New York, USA</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Joined</p>
              <p className="text-[#2D2D2D] font-medium">March 7, 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile