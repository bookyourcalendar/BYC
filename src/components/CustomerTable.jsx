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
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function CustomerTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://bookyourcalendar.com/api/admin/users");
        const data = await res.json();

        if (data.success) {
          setUsers(data.data);
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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadAsXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.text("User Data", 14, 10);
    autoTable(doc, {
      head: [["ID", "Name", "Email", "Plan", "Validity", "Created At"]],
      body: filteredUsers.map((user) => [
        user.id,
        user.name,
        user.email,
        user.subscriptionPlan,
        user.validity,
        new Date(user.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save("users.pdf");
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Download Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-500 text-white flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={downloadAsXLS}>Download XLS</DropdownMenuItem>
            <DropdownMenuItem onClick={downloadAsPDF}>Download PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <p className="text-center py-4">Loading users...</p>
      ) : (
        <Table className="min-w-full border-collapse">
          <TableCaption className="text-sm text-gray-600">
            A list of users and their plan details.
          </TableCaption>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-left px-4 py-2">ID</TableHead>
              <TableHead className="text-left px-4 py-2">Name</TableHead>
              <TableHead className="text-left px-4 py-2">Email</TableHead>
              <TableHead className="text-left px-4 py-2">Current Plan</TableHead>
              <TableHead className="text-left px-4 py-2">Validity</TableHead>
              <TableHead className="text-left px-4 py-2">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-2">{user.id}</TableCell>
                  <TableCell className="px-4 py-2">{user.name}</TableCell>
                  <TableCell className="px-4 py-2">{user.email}</TableCell>
                  <TableCell className="px-4 py-2">{user.subscriptionPlan}</TableCell>
                  <TableCell className="px-4 py-2">{user.validity}</TableCell>
                  <TableCell className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-right px-4 py-2 font-semibold">
                Total Users: {filteredUsers.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}
