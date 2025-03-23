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

interface Ticket {
  id: number;
  fullName: string;
  email: string;
  description: string;
  createdAt: string;
  status: string;
  updatedAt: string;
  issueType: string;
}

export function TicketsTable() {
  // State for tickets, loading, and error handling
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3000/api/admin/supportTickets");
        if (!response.ok) throw new Error(`Failed to fetch tickets: ${response.statusText}`);

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
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg">
      <Table className="min-w-full border border-gray-200">
        <TableCaption className="text-sm text-gray-500">
          A list of your recent tickets.
        </TableCaption>

        {/* Table Header */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-left px-4 py-2 border border-gray-200 font-semibold">
              Ticket ID
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200 font-semibold">
              Name
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200 font-semibold">
              Email ID
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200 font-semibold">
              Description
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200 font-semibold">
              Raised At
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200 font-semibold">
              Status
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200 font-semibold">
              Updated At
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200 font-semibold">
              Issue Type
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="px-4 py-4 text-center text-gray-600">
                Loading...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} className="px-4 py-4 text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="px-4 py-4 text-center text-gray-500">
                No tickets found.
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow key={ticket.id} className="hover:bg-gray-50">
                <TableCell className="px-4 py-2 border border-gray-200 font-medium">
                  <span className="cursor-pointer" title={ticket.id.toString()}>
                    {ticket.id}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">
                  <span className="cursor-pointer" title={ticket.fullName}>
                    {ticket.fullName}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">
                  <span className="cursor-pointer" title={ticket.email}>
                    {ticket.email}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2 border border-gray-200 max-w-[300px] whitespace-normal break-words">
                  <span className="cursor-pointer" title={ticket.description}>
                    {ticket.description}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2 border border-gray-200 cursor-pointer" title={new Date(ticket.createdAt).toLocaleString()}>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">
                  <span className="cursor-pointer" title={ticket.status}>
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2 border border-gray-200 cursor-pointer" title={new Date(ticket.updatedAt).toLocaleString()}>
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">
                  <span className="cursor-pointer" title={ticket.issueType}>
                    {ticket.issueType}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        {/* Table Footer */}
        {!loading && !error && tickets.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={8}
                className="px-4 py-2 font-semibold text-right border border-gray-200"
              >
                Total Tickets: {tickets.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
