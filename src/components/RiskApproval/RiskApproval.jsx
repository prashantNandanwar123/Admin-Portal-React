import React, { useEffect, useState } from "react";
import RiskApprovalFrom from "../RiskApproval/RiskApprovalFrom";
import axiosInstance from "../../api/axios";
import { LiaEyeSolid } from "react-icons/lia";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";


import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

export default function RiskApproval() {

  const location = useLocation();

  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");


  const [view, setView] = useState("list");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  useEffect(() => {
    fetchMerchants();
  }, []);

  //  Sidebar click pe reset
  useEffect(() => {
    setShowForm(false);
    setSelectedMerchant(null);
  }, [location]);

  //  Fetch Merchant List
  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/riskApproval",
        {}
      );
      console.log("response Data::--", res);
      const response = res?.data ?? res;
      if (response?.respCode === 0) {
        setData(response?.respData || []);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (refId) => {
    setSelectedMerchant(refId);
    setShowForm(true);
  };

  // Search
  const filteredData = data.filter((item) => {
    const search = searchTerm.trim().toLowerCase();

    return item.some((field) =>
      String(field)
        .trim()
        .toLowerCase()
        .includes(search)
    );
  });

  // Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (showForm) {
    return (
      <RiskApprovalFrom
        merchantData={selectedMerchant} // RefId
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <>
      <div className="px-10 pb-10 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 ml-5">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-2xl font-semibold text-[#1A2233]">
              Risk Approval For Merchant Registration
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Review and approve merchant registrations after validating
              business details, compliance checks, and risk assessment criteria.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 p-5 border-b border-slate-300">
            {/* Entries */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-600 font-medium">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-slate-600 font-medium">entries</span>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <FaSearch className="absolute top-4 left-3 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search merchant..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-slate-300 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              {/* Table Head */}
              <thead className="bg-slate-50 text-slate-800 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">
                    ID
                  </th>
                  <th className="px-4 py-3 text-center">
                    Created Date
                  </th>
                  <th className="px-4 py-3 text-center">
                    Legal Name
                  </th>
                  <th className="px-4 py-3 text-center">
                    Contact Person Name
                  </th>
                  <th className="px-4 py-3 text-center">
                    Email Address
                  </th>
                  <th className="px-4 py-3 text-center">
                    Mobile Number
                  </th>
                  <th className="px-4 py-3 text-center">
                    Created By
                  </th>
                  <th className="px-4 py-3 text-center text-center">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* ID */}
                      <td className="px-4 py-3 text-center">
                        {item[0]}
                      </td>

                      {/* Created Date */}
                      <td className="px-4 py-3 font-semibold text-blue-600 text-center">
                        {item[6]}
                      </td>

                      {/* Legal Name */}
                      <td className="px-4 py-3 text-center">
                        {item[1]}
                      </td>
                      {/* Contact Person */}
                      <td className="px-4 py-3 text-center">
                        {item[2]}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-center">
                        {item[3]}
                      </td>

                      {/* Mobile */}
                      <td className="px-4 py-3 text-center">
                        {item[4]}
                      </td>

                      {/* Created By */}
                      <td className="px-4 py-3 font-semibold text-blue-600 text-center">
                        {item[7]}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleAddClick(item[5])}//REfId
                          className="inline-flex items-center justify-center"
                        >
                          <LiaEyeSolid className="text-3xl text-green-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-6 text-gray-400"
                    >
                      No data found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

            {/* Bottom */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 p-5 border-t border-slate-300">
              {/* Showing */}
              <div className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold">
                  {filteredData.length === 0 ? 0 : indexOfFirst + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(indexOfLast, filteredData.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {filteredData.length}
                </span>{" "}
                entries
              </div>

              {/* Pagination */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Prev */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${currentPage === 1
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-white hover:bg-slate-100"
                    }`}
                >
                  <FaChevronLeft size={12} />
                  Prev
                </button>

                {/* Numbers */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === index + 1
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "bg-white border hover:bg-slate-100"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Next */}
                <button
                  disabled={
                    currentPage === totalPages || totalPages === 0
                  }
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 transition-all ${currentPage === totalPages || totalPages === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-white hover:bg-slate-100"
                    }`}
                >
                  Next
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}