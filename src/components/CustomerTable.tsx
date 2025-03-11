"use client";

import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CustomerTable() {
  interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    subscriptionPlan: string;
    validity: Null;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/admin/users"
        ); // Change this if your API route is different
        const data = await res.json();

        if (data.success) {
          setUsers(data.data); // Store API data in state
        } else {
          console.error("Error fetching users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p className="text-center py-4">Loading users...</p>
      ) : (
        <Table className="min-w-full border-collapse border border-gray-200">
          <TableCaption className="text-sm text-gray-600">
            A list of users and their plan details.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left px-4 py-2 border">ID</TableHead>
              <TableHead className="text-left px-4 py-2 border">Name</TableHead>
              <TableHead className="text-left px-4 py-2 border">
                Email
              </TableHead>
              <TableHead className="text-left px-4 py-2 border">
                Current Plan
              </TableHead>
              <TableHead className="text-left px-4 py-2 border">
                Validity
              </TableHead>
              <TableHead className="text-left px-4 py-2 border">
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-4 py-2 border">{user.id}</TableCell>
                <TableCell className="px-4 py-2 border">{user.name}</TableCell>
                <TableCell className="px-4 py-2 border">{user.email}</TableCell>
                <TableCell className="px-4 py-2 border">{user.subscriptionPlan}</TableCell>
                <TableCell className="px-4 py-2 border">{user.validity}</TableCell>
                <TableCell className="px-4 py-2 border">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-right px-4 py-2 font-semibold border"
              >
                Total Users: {users.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}
