"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";

const jsPDF = dynamic(() => import("jspdf"), { ssr: false });

const DownloadButton = () => {
  const [filter, setFilter] = useState("7d");

  const fetchData = async () => {
    try {
      const meetingsResponse = await fetch(
        `https://bookyourcalendar.com/api/admin/meetingsGraph?filter=${filter}`
      );
      const meetingsData = await meetingsResponse.json();

      const meetingsCountResponse = await fetch(
        "https://bookyourcalendar.com/api/admin/meetingsCount"
      );
      const meetingsCountData = await meetingsCountResponse.json();

      const analyticsResponse = await fetch(
        "https://bookyourcalendar.com/api/admin/analytics"
      );
      const analyticsData = await analyticsResponse.json();

      return { meetingsData, meetingsCountData, analyticsData };
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const exportXLS = async () => {
    console.log("Exporting as XLS...");
    const data = await fetchData();
    if (!data) return;

    const worksheet = XLSX.utils.json_to_sheet([
      { ...data.meetingsCountData, filter },
      { ...data.analyticsData },
      { ...data.meetingsData },
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "BookeYourCalendar Report"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = "BookeYourCalendar-report.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = async () => {
    console.log("Exporting as PDF...");
    const data = await fetchData();
    if (!data) return;

    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.text("BookeYourCalendar Report", 14, 10);

    autoTable(doc, {
      head: [["Category", "Value"]],
      body: [
        ["Filter", filter],
        ...Object.entries(data.meetingsCountData),
        ...Object.entries(data.analyticsData),
        ...Object.entries(data.meetingsData),
      ],
    });

    doc.save("BookeYourCalendar-report.pdf");
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-blue-500 text-white flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Select Filter</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {["7d", "30d", "90d", "365d"].map((option) => (
                <DropdownMenuItem
                  key={option}
                  onSelect={(e) => {
                    e.preventDefault();
                    setFilter(option);
                  }}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onSelect={exportXLS}>
            Export as XLS
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={exportPDF}>
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DownloadButton;
