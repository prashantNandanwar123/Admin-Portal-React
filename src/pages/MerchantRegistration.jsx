import React, { useEffect, useState } from "react";
import MerchantRegistrationForm from "../components/MerchantRegistrationForm";
import MerchantRegistrationPendingForm from "../components/MerchantRegistrationPending/MerchantRegistrationPendingForm";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";
import { LiaEyeSolid } from "react-icons/lia";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

export default function MerchantRegistration() {
  const [data, setData] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [merchantFormData, setMerchantFormData] = useState({});
  const [view, setView] = useState("list");
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();


  // Search
  const filteredData = data.filter((item) =>
    item.some((value) =>
      String(value ?? "")
        .trim()
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )
  );

  // Pagination calculations
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentData = filteredData.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredData.length / entriesPerPage
  );


  // Route change hone pe list view pe reset
  useEffect(() => {
    setView("list");
    setCurrentStep(0);
    setMerchantFormData({});
  }, [location]); // location change = sidebar click


  useEffect(() => {
    fetchMerchants();
    setView("list");
  }, []);

  const fetchMerchants = async (openFormAfter = false) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post("/merchant/pending", {});
      const response = res?.data ?? res;

      if (response?.respCode === 0) {
        setData(response?.respData || []);
      }

      if (openFormAfter) {
        setView("form");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentStep(0);
    setMerchantFormData({});
    setView("form");
  };
  const handleEdit = (item) => {
    setSelectedMerchant(item);
    setView("pending");
  };

  if (view === "form") {
    return (
      <MerchantRegistrationForm
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        formData={merchantFormData}
        setFormData={setMerchantFormData}
        onBack={() => setView("list")}

      />
    );
  }

  if (view === "pending") {
    return (
      <MerchantRegistrationPendingForm
        merchantData={selectedMerchant}
        onBack={() => setView("list")}
      />
    );
  }
  return (
    <div className="p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-700 uppercase bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-800 bg-clip-text text-transparent font-extrabold">
            Merchant Registration
          </h1>

          <p className="pb-3 text-lg text-blue-900">
            Register and onboard new merchants to manage payment services, business details, and transaction access securely.          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-200 text-white px-5 py-3 rounded-xl shadow-lg"
        >
          <FaPlus />
          Add Merchant
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Top Controls */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 p-5 border-b bg-slate-50">
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
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">ID</th>
                <th className="px-5 py-4 text-left font-semibold">
                  Legal Name
                </th>
                <th className="px-5 py-4 text-left font-semibold">
                  Contact Person
                </th>
                <th className="px-5 py-4 text-left font-semibold">Email</th>
                <th className="px-5 py-4 text-left font-semibold">Mobile</th>
                <th className="px-5 py-4 text-left font-semibold">
                  Risk Status
                </th>
                <th className="px-5 py-4 text-left font-semibold">
                  Risk Remark
                </th>
                <th className="px-5 py-4 text-center font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-9 text-slate-100"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading merchants...
                    </div>
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-slate-50 transition-all duration-150"
                  >
                    <td className="px-5 py-4 font-medium text-slate-700">
                      #{item[0]}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {item[1]}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item[2]}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item[3]}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item[4]}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${item[5]
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {item[5] || "Pending"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item[6] || "-"}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-xl transition-all duration-200"
                      >
                        <LiaEyeSolid className="text-2xl" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-16 text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-5xl">📄</div>
                      <p className="text-lg font-medium">
                        No Merchant Found
                      </p>
                      <p className="text-sm text-slate-400">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 p-5 border-t bg-slate-50">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${currentPage === totalPages || totalPages === 0
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
  );
}