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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Search, Download } from "lucide-react";
import * as XLSX from "xlsx";
import dynamic from "next/dynamic";

const jsPDF = dynamic(() => import("jspdf"), { ssr: false });

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
          "https://bookyourcalendar.com/api/admin/supportTickets"
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

  // ✅ Export to XLS
  const exportXLS = () => {
    if (filteredTickets.length === 0) {
      console.warn("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredTickets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Support Tickets");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = "support_tickets.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Export to PDF
  const exportPDF = async () => {
    if (filteredTickets.length === 0) {
      console.warn("No data to export");
      return;
    }

    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();

    doc.text("Support Tickets Report", 14, 10);

    autoTable(doc, {
      head: [
        [
          "Ticket ID",
          "Name",
          "Email",
          "Description",
          "Issue Type",
          "Status",
          "Raised At",
          "Updated At",
        ],
      ],
      body: filteredTickets.map((ticket) => [
        ticket.id,
        ticket.fullName,
        ticket.email,
        ticket.description,
        ticket.issueType,
        ticket.status,
        new Date(ticket.createdAt).toLocaleDateString(),
        new Date(ticket.updatedAt).toLocaleDateString(),
      ]),
      // columnStyles: {
      //   0: { columnWidths: 10 },
      //   1: { columnWidths: 40 },
      //   2: { columnWidths: 50 },
      //   3: { columnWidths: 30 },
      //   4: { columnWidths: 25 },
      //   5: { columnWidths: 35 },
      //   6: { columnWidths: 35 },
      // },
      styles: { fontSize: 8, cellPadding: 2 }, // Adjust font size and padding
    });

    doc.save("support_tickets.pdf");
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {/* Search Bar & Download Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search Tickets"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 pl-10"
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
          <DropdownMenuContent className="w-44">
            <DropdownMenuItem onClick={() => exportXLS()}>
              Export as XLS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportPDF()}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption className="text-sm text-gray-500">
            A list of your recent tickets.
          </TableCaption>

          {/* Table Header */}
          <TableHeader className="bg-gray-100">
            <TableRow className="border-none">
              <TableHead className="px-4 py-2 font-semibold">
                Ticket ID
              </TableHead>
              <TableHead className="px-4 py-2 font-semibold">Name</TableHead>
              <TableHead className="px-4 py-2 font-semibold">
                Email ID
              </TableHead>
              <TableHead className="px-4 py-2 font-semibold">
                Description
              </TableHead>
              <TableHead className="px-4 py-2 font-semibold">
                Raised At
              </TableHead>
              <TableHead className="px-4 py-2 font-semibold">Status</TableHead>
              <TableHead className="px-4 py-2 font-semibold">
                Updated At
              </TableHead>
              <TableHead className="px-4 py-2 font-semibold">
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
                  <TableCell className="px-4 py-2 max-w-[200px] break-words">
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
        </Table>
      </div>
    </div>
  );
}
