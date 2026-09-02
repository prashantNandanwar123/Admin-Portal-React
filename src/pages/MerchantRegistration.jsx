import React, { useEffect, useState } from "react";
import MerchantRegistrationForm from "../components/MerchantRegistrationForm";
import MerchantRegistrationPendingForm from "../components/MerchantRegistrationPending/MerchantRegistrationPendingForm";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";
import { LiaEyeSolid } from "react-icons/lia";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSearch,
  FaUsers,
  FaClock,
  FaShieldAlt,
  FaSyncAlt
} from "react-icons/fa";

export default function MerchantRegistration() {
  const [data, setData] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [merchantFormData, setMerchantFormData] = useState({});
  const [view, setView] = useState("list");
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

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
  }, [location]);

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
    <div className="p-4 sm:p-6 bg-slate-50 min-screen hide-scrollbar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Merchant Registration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and onboard merchants to HelloPe.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 active:scale-[0.98] transition-all duration-150 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm w-full sm:w-auto"
        >
          <FaPlus size={13} />
          Add Merchant
        </button>
      </div>

      {/* Stats strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-5 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <FaUsers className="text-blue-500" />
          <span className="font-semibold text-slate-800">
            {filteredData.length.toLocaleString()}
          </span>
          Total Merchants
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <FaClock className="text-amber-500" />
          <span className="font-semibold text-slate-800">
            {filteredData.filter((item) => !item[5] || item[5] === "Pending").length}
          </span>
          Pending Review
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <FaShieldAlt className="text-red-500" />
          <span className="font-semibold text-slate-800">
            {filteredData.filter((item) => item[5] === "Rejected" || item[5] === "High").length}
          </span>
          High Risk
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Top Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-200 bg-slate-50 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-slate-500">entries</span>
          </div>

          {/* Search */}
          <div className="relative w-full xl:w-80">
            <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search merchant by name, email or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                  ID
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                  Legal Name
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                  Contact Person
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                  Email
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                  Mobile
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                  Risk Status
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                  Risk Remark
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                      Loading merchants...
                    </div>
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => {
                  const initial = (item[1] || "?").charAt(0).toUpperCase();

                  const avatarColors = [
                    "bg-blue-100 text-blue-700",
                    "bg-amber-100 text-amber-700",
                    "bg-pink-100 text-pink-700",
                    "bg-emerald-100 text-emerald-700",
                    "bg-indigo-100 text-indigo-700",
                  ];

                  const avatarColor = avatarColors[index % avatarColors.length];

                  const statusStyles = {
                    Verified: "bg-green-100 text-green-700",
                    Approved: "bg-green-100 text-green-700",
                    Pending: "bg-yellow-100 text-yellow-700",
                    "Under Review": "bg-orange-100 text-orange-700",
                    Rejected: "bg-red-100 text-red-700",
                  };

                  const statusLabel = item[5] || "Pending";
                  const statusClass =
                    statusStyles[statusLabel] || "bg-yellow-100 text-yellow-700";

                  return (
                    <tr
                      key={index}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-all duration-150"
                    >
                      {/* ID */}
                      <td className="px-5 py-4 text-center font-medium text-slate-500">
                        #{item[0]}
                      </td>

                      {/* Legal Name */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold ${avatarColor}`}
                          >
                            {initial}
                          </div>

                          <span className="font-semibold text-slate-800">
                            {item[1]}
                          </span>
                        </div>
                      </td>

                      {/* Contact Person */}
                      <td className="px-5 py-4 text-center text-slate-600">
                        {item[2]}
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-center text-slate-600">
                        {item[3]}
                      </td>

                      {/* Mobile */}
                      <td className="px-5 py-4 text-center text-slate-600">
                        {item[4]}
                      </td>

                      {/* Risk Status */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                      </td>

                      {/* Risk Remark */}
                      <td className="px-5 py-4 text-center text-slate-500">
                        {item[6] || "-"}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-center relative">
                        <button
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();

                            setMenuPosition({
                              top: rect.bottom + window.scrollY + 6,
                              left: rect.right + window.scrollX - 192,
                            });

                            setOpenMenuIndex(
                              openMenuIndex === index ? null : index
                            );
                          }}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-500 p-2.5 rounded-xl transition-all duration-200"
                        >
                          <BsThreeDotsVertical className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  );
                })
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
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 p-4 border-t border-slate-100 bg-white">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredData.length === 0 ? 0 : indexOfFirst + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(indexOfLast, filteredData.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{filteredData.length}</span> entries
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-sm transition-all ${currentPage === 1
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <FaChevronLeft size={11} />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page !== 1 &&
                page !== totalPages &&
                Math.abs(page - currentPage) > 1
              ) {
                if (page === 2 || page === totalPages - 1) {
                  return (
                    <span key={page} className="px-1 text-slate-400 text-sm">
                      ...
                    </span>
                  );
                }
                return null;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${currentPage === page
                    ? "bg-amber-400 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-sm transition-all ${currentPage === totalPages || totalPages === 0
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <FaChevronRight size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* Action dropdown menu*/}
      {openMenuIndex !== null && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenMenuIndex(null)}
          />
          <div
            style={{ top: menuPosition.top, left: menuPosition.left }}
            className="fixed z-50 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 text-left"
          >
            <button
              onClick={() => {
                handleEdit(currentData[openMenuIndex]);
                setOpenMenuIndex(null);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <LiaEyeSolid className="text-base" />
              View Merchant
            </button>

            {/* <button
              onClick={() => {
                handleEdit(currentData[openMenuIndex]);
                setOpenMenuIndex(null);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              View Details
            </button> */}

            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Review Documents
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-slate-50">
              Approve Merchant
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-50">
              Reject Merchant
            </button>
          </div>
        </>
      )}
    </div>
  );
}