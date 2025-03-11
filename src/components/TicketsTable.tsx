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

export function TicketsTable() {
  interface Ticket {
    ticketId: number;
    fullName: string;
    email: string;
    description: string;
    createdAt: string;
    status: string;
    updatedAt: string;
    issueType: string;
  }

  // State for tickets, loading, and error handling
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tickets from backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/supportTickets");
        if (!response.ok) throw new Error("Failed to fetch tickets");

        const data: Ticket[] = await response.json();
        setTickets(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg">
      <Table className="min-w-full border-collapse border border-gray-200">
        <TableCaption className="text-sm text-gray-600">
          A list of your recent tickets.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-left px-4 py-2 border border-gray-200">
              Ticket ID
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200">
              Name
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200">
              Email ID
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200">
              Ticket Description
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200">
              Raised At
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200">
              Status
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200">
              Updated At
            </TableHead>
            <TableHead className="text-left px-4 py-2 border border-gray-200">
              Issue Type
            </TableHead>
          </TableRow>
        </TableHeader>
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
              <TableRow key={ticket.ticketId}>
                <TableCell className="px-4 py-2 border border-gray-200 font-medium">{ticket.ticketId}</TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">{ticket.fullName}</TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">{ticket.email}</TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">{ticket.description}</TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">{ticket.status}</TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">{new Date(ticket.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell className="px-4 py-2 border border-gray-200">{ticket.issueType}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

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
