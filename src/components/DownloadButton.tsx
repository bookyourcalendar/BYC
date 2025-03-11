"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";

// Dynamic import to avoid SSR issues with jspdf
const jsPDF = dynamic(() => import("jspdf"), { ssr: false });

const DownloadButton = () => {
  const exportXLS = () => {
    console.log("Exporting as XLS...");

    const data = [
      { userId: "U001", name: "John Doe", email: "john@example.com" },
      { userId: "U002", name: "Jane Smith", email: "jane@example.com" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Convert to a binary Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = "customer_report.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = async () => {
    console.log("Exporting as PDF...");

    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.text("Customer Report", 14, 10);

    autoTable(doc, {
      head: [["User ID", "Name", "Email"]],
      body: [
        ["U001", "John Doe", "john@example.com"],
        ["U002", "Jane Smith", "jane@example.com"],
      ],
    });

    doc.save("customer_report.pdf");
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuItem onClick={exportXLS}>Export as XLS</DropdownMenuItem>
          <DropdownMenuItem onClick={exportPDF}>Export as PDF</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DownloadButton;
