import { CustomerTable } from "@/components/customers/CustomerTable";
import React from "react";

const Customer = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 lg:p-10">
        {/* <h1 className="text-5xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
              Customer List
            </h1>
            <p className="text-sm sm:text-base text-center text-gray-600 mb-4 sm:mb-6">
              A comprehensive view of all the customers.
            </p> */}
        <div className="overflow-x-auto">
          <CustomerTable />
        </div>
      </div>
    </div>
  );
};

export default Customer;
