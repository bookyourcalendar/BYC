import { TicketsTable } from "@/components/tickets/TicketsTable";
import React from "react";

const Ticket = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 lg:p-10">
        {/* <h1 className="text-5xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Tickets List
        </h1>
        <p className="text-sm sm:text-base text-center text-gray-600 mb-4 sm:mb-6">
          A comprehensive view of all your raised tickets. Manage, track, and
          resolve issues effectively.
        </p> */}
        <div className="overflow-x-auto">
          <TicketsTable />
        </div>
      </div>
    </div>
  );
};

export default Ticket;
