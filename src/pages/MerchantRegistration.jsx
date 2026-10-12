import { useEffect, useState } from "react";
import MerchantRegistrationForm from "../components/MerchantRegistrationForm";
import MerchantRegistrationPendingForm from "../components/MerchantRegistrationPending/MerchantRegistrationPendingForm";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";
import { LiaEyeSolid } from "react-icons/lia";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { Plus } from "lucide-react";


import { User } from "lucide-react";

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

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }
      return pages;
    }

    // First pages
    pages.push(1);

    // Current page is near the beginning
    if (currentPage <= 4) {
      pages.push(2);
      pages.push(3);
      pages.push(4);
      pages.push("...");
      pages.push(totalPages);
      return pages;
    }

    // Current page is near the end
    if (currentPage >= totalPages - 3) {
      pages.push("...");
      pages.push(totalPages - 3);
      pages.push(totalPages - 2);
      pages.push(totalPages - 1);

      return pages;
    }

    // Current page is somewhere in the middle
    pages.push("...");
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push("...");
    pages.push(totalPages);

    return pages;
  };

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
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentStep(0);
    setMerchantFormData({});
    setView("form");
  };
  const handlePendingClick = (refId) => {
    setSelectedMerchant(refId);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-2xl font-semibold text-[#1A2233]">
            Merchant Registration
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-4xl leading-6">
            Register and onboard merchants to the HelloPe payment platform by capturing
            their business, contact, banking, KYC, and compliance information.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 bg-[#fec931] text-black active:scale-[0.98] transition-all duration-150 font-normal px-4 py-2.5 rounded-xl shadow-sm w-full sm:w-auto">
          <Plus size={14} strokeWidth={2} />
          Add Merchant
        </button>
      </div>

      {/* Stats Strip */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
          {/* Icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fec931] text-black">
            <User size={20} strokeWidth={2} />
          </div>
          {/* Content */}
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Merchants
            </span>
            <span className="text-xl font-bold leading-tight text-slate-800">
              {filteredData.length.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-200 bg-slate-50 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-400">
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
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-slate-200  pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fec931] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px] border-collapse border border-slate-200">
            <thead className="bg-[#fec931] text-black border-t-0">
              <tr className="uppercase">
                <th className="px-5 py-3 text-center text-xs font-semibold tracking-wide border border-slate-200">
                  ID
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold tracking-wide border border-slate-200">
                  Legal Name
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold tracking-wide border border-slate-200">
                  Contact Person
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold tracking-wide border border-slate-200">
                  Email
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold tracking-wide border border-slate-200">
                  Mobile
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold tracking-wide border border-slate-200">
                  Risk Status
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold tracking-wide border border-slate-200">
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
                      <td className="px-1 py-1 text-center font-medium text-slate-500 border border-slate-200">
                        {item[0]}
                      </td>

                      {/* Legal Name */}
                      <td className="px-3 py-2 text-center border border-slate-200">
                        <div className="flex items-center justify-center gap-3">
                          <span className="font-semibold text-slate-800">
                            {item[1] || "-"}
                          </span>
                        </div>
                      </td>

                      {/* Contact Person */}
                      <td className="text-center text-slate-600 border border-slate-200">
                        {item[2] || "-"}
                      </td>

                      {/* Email */}
                      <td className="text-center text-slate-600 border border-slate-200">
                        {item[3] || "-"}
                      </td>

                      {/* Mobile */}
                      <td className="text-center text-slate-600 border border-slate-200">
                        {item[4] || "-"}
                      </td>

                      {/* Risk Status */}
                      <td className="text-center border border-slate-200">
                        <span
                          className={`inline-block rounded-full text-xs font-semibold ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      {/* Action */}
                      <td className="px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => handlePendingClick(item[4])}
                          className="inline-flex items-center justify-center"
                        >
                          <LiaEyeSolid className="text-3xl text-green-500" />
                        </button>
                      </td>
                      {/* Action */}
                      {/* <td className="px-3 py-2 text-center relative">
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
                      </td> */}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-16 text-slate-500">
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

        {/* Bottom Pagination */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 p-4 border-t border-slate-100 bg-white">
          {/* Showing entries */}
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredData.length === 0 ? 0 : indexOfFirst + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(indexOfLast, filteredData.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {filteredData.length}
            </span>{" "}
            entries
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              disabled={currentPage === 1 || totalPages === 0}
              onClick={() => setCurrentPage(1)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition-all ${currentPage === 1 || totalPages === 0
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <FaAngleDoubleLeft size={13} />
            </button>

            {/* PREVIOUS */}
            <button
              type="button"
              disabled={currentPage === 1 || totalPages === 0}
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition-all ${currentPage === 1 || totalPages === 0
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <FaChevronLeft size={11} />
            </button>

            {/* PAGE NUMBERS */}
            {getPageNumbers().map((page, index) => {

              // Dots
              if (page === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="px-1 text-slate-400 text-sm"
                  >
                    ...
                  </span>
                );
              }

              // Page button
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${currentPage === page
                    ? "bg-[#fec931] text-black shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {page}
                </button>
              );
            })}

            {/* NEXT */}
            <button
              type="button"
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition-all ${currentPage === totalPages || totalPages === 0
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <FaChevronRight size={11} />
            </button>

            {/* LAST PAGE */}
            <button
              type="button"
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() => setCurrentPage(totalPages)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition-all ${currentPage === totalPages || totalPages === 0
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              <FaAngleDoubleRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}