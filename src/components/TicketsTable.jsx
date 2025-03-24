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
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

export function TicketsTable() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:3000/api/admin/supportTickets"
        );
        if (!response.ok)
          throw new Error(`Failed to fetch tickets: ${response.statusText}`);

        const data = await response.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          setTickets(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setTickets(data.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filter tickets based on search query
  const filteredTickets = tickets.filter((ticket) =>
    ["id", "fullName", "email", "description", "issueType"].some((key) =>
      ticket[key]?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {/* Search Bar */}
      <div className="mb-4 relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search Tickets"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 pl-10" // Added pl-10 for padding
        />
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption className="text-sm text-gray-500">
            A list of your recent tickets.
          </TableCaption>

          {/* Table Header */}
          <TableHeader className="bg-gray-100">
            <TableRow className="border-none">
              <TableHead className="text-left px-4 py-2 font-semibold">
                Ticket ID
              </TableHead>
              <TableHead className="text-left px-4 py-2 font-semibold">
                Name
              </TableHead>
              <TableHead className="text-left px-4 py-2 font-semibold">
                Email ID
              </TableHead>
              <TableHead className="text-left px-4 py-2 font-semibold">
                Description
              </TableHead>
              <TableHead className="text-left px-4 py-2 font-semibold">
                Raised At
              </TableHead>
              <TableHead className="text-left px-4 py-2 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-left px-4 py-2 font-semibold">
                Updated At
              </TableHead>
              <TableHead className="text-left px-4 py-2 font-semibold">
                Issue Type
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-4 py-4 text-center text-gray-600"
                >
                  <Loader2 className="animate-spin mx-auto w-6 h-6 text-gray-500" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-4 py-4 text-center text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="hover:bg-gray-50 border-none"
                >
                  <TableCell className="px-4 py-2">{ticket.id}</TableCell>
                  <TableCell className="px-4 py-2">{ticket.fullName}</TableCell>
                  <TableCell className="px-4 py-2">{ticket.email}</TableCell>
                  <TableCell className="px-4 py-2 max-w-[300px] whitespace-normal break-words">
                    {ticket.description}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-2">{ticket.status}</TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {ticket.issueType}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          {/* Table Footer */}
          {!loading && !error && filteredTickets.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-4 py-2 font-semibold text-right"
                >
                  Total Tickets: {filteredTickets.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}
