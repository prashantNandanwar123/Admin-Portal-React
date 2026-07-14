import React, { useEffect, useState } from "react";
import RiskApprovalFrom from "../RiskApproval/RiskApprovalFrom";
import axiosInstance from "../../api/axios";
import { LiaEyeSolid } from "react-icons/lia";
import { useLocation } from "react-router-dom";


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
  const [merchantFormData, setMerchantFormData] = useState({});

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
      const response = res?.data ?? res;
      if (response?.respCode === 0) {
        setData(response?.respData || []);
      }
    } catch (err) {
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
        merchantData={selectedMerchant}
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl pb-2 font-bold text-blue-700 uppercase bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-800 bg-clip-text text-transparent font-extrabold">
              RISK APPROVAL FOR MERCHANT REGISTRATION
            </h2>
            <p className="pb-3 text-lg text-blue-900">
              Review and approve merchant registrations after validating
              business details, compliance checks, and risk assessment criteria.
            </p>
          </div>
        </div>

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
            <thead className="bg-orange-600 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">
                  ID
                </th>
                <th className="px-4 py-3">
                  Legal Name
                </th>
                <th className="px-4 py-3">
                  Contact Person Name
                </th>
                <th className="px-4 py-3">
                  Email Address
                </th>
                <th className="px-4 py-3">
                  Mobile Number
                </th>
                <th className="px-4 py-3">
                  REF ID
                </th>
                <th className="px-4 py-3 text-center">
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
                    <td className="px-4 py-3">
                      {item[0]}
                    </td>
                    {/* Legal Name */}
                    <td className="px-4 py-3">
                      {item[1]}
                    </td>
                    {/* Contact Person */}
                    <td className="px-4 py-3">
                      {item[2]}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      {item[3]}
                    </td>

                    {/* Mobile */}
                    <td className="px-4 py-3">
                      {item[4]}
                    </td>

                    {/* REF ID */}
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      {item[5]}
                    </td>
                    {/* Action */}
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleAddClick("1000011")}
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
                    colSpan="7"
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
    </>
  );
}