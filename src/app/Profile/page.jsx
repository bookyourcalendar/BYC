"use client";

import React, { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Profile() {
  // Only initialize client-side
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  // Initialize auth only after component mounts
  const [authState, setAuthState] = useState({
    userId: null,
    isLoaded: false,
    signOut: null
  });
  
  // First, ensure we're on the client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Then, initialize Clerk
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const { useAuth, useClerk } = require("@clerk/nextjs");
      const auth = useAuth();
      const clerk = useClerk();
      
      setAuthState({
        userId: auth.userId,
        isLoaded: auth.isLoaded,
        signOut: clerk.signOut
      });
    } catch (err) {
      setError("Authentication service unavailable");
      setLoading(false);
    }
  }, [mounted]);
  
  // Fetch user data after auth is loaded
  useEffect(() => {
    if (!mounted) return;
    if (!authState.isLoaded) return;
    
    if (!authState.userId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/admin/profile/?userId=${authState.userId}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'http://localhost:3000',
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user");

        const { data } = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [authState.userId, authState.isLoaded, mounted]);

  // Don't render anything during SSR
  if (!mounted) {
    return null;
  }

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
            onClick={() => {
              if (authState.signOut) {
                authState.signOut(() => router.push("/"));
              }
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
