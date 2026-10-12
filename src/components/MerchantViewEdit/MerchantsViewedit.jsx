import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import MerchantsViewEditForm from "./MerchantsViewEditForm";
import MerchantsEditForm from "./MerchantsEditForm";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa"

export default function MerchantsViewedit() {

  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("list");

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  useEffect(() => {
    fetchMerchantData();
  }, [page, size]);

  //  Sidebar click pe reset
  useEffect(() => {
    setShowViewForm(false);
    setShowEditForm(false);
    setSelectedMerchant(null);
  }, [location]);

  // API CALL
  const fetchMerchantData = async () => {
    try {
      setLoading(true);
      const resData = await axiosInstance.post(
        `/MerchantViewEdit?page=${page}&size=${size}`
      );
      if (resData?.respCode === 0) {
        setData(resData.data || []);
        setTotalPages(resData.totalPages || 0);
        setTotalRecords(resData.totalRecords || 0);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Status Change ApI call
  const handleStatusChange = async (mid, currentStatus) => {
    try {
      const updatedStatus =
        currentStatus === "Active" ? "Deactive" : "Active";
      const payload = {
        mid: mid,
        status: updatedStatus,
      };
      const res = await axiosInstance.post(
        "/updateStatus",
        payload
      );

      if (res?.respCode === 0) {
        toast.success(res?.respMsg)
        // Refresh table data
        fetchMerchantData();
      } else {
        toast.error(res?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // Previous Page
  const handlePrevious = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  // Next Page
  const handleNext = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  //  PREVIOUS STEP
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack?.(); //Step 0 pe list page pe wapas
    }
  };

  const handleViewClick = (refId) => {
    setSelectedMerchant(refId);
    setShowViewForm(true);
  };

  const handleEditClick = (refId) => {
    setSelectedMerchant(refId);
    setShowEditForm(true);
  };

  // Search
  const filteredData = data.filter((item) => {
    const search = searchTerm.trim().toLowerCase();
    return Object.values(item).some((field) =>
      String(field)
        .trim()
        .toLowerCase()
        .includes(search)
    );
  });

  //  Open Form
  if (showViewForm) {
    return (
      <MerchantsViewEditForm
        merchantData={selectedMerchant}
        onBack={() => setShowViewForm(false)}
      />
    );
  }

  if (showEditForm) {
    return (
      <MerchantsEditForm
        merchantData={selectedMerchant}
        onBack={() => setShowEditForm(false)}  //  sahi state
      />
    );
  }

  return (
    <div className="min-h-screen p-4 bg-slate-50">
      {/* Heading */}
      <div className="ml-2 flex flex-col md:flex-row md:items-start md:justify-between gap-3 pt-5">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-2xl font-semibold text-[#1A2233]">
            Merchant View / Edit
          </h1>
          <p className="pb-8 text-sm text-slate-500">
            View, update, and manage merchant details, business information, account status, and service configurations efficiently.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 p-5 border-b border-slate-200">
          {/* Entries */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600 font-medium">Show</span>
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
              className="border border-slate-200 bg-slate-50 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-400">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-slate-600 font-medium">entries</span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full">
              <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                className="w-full border border-slate-200  pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fec931] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table
              className="min-w-[1400px] w-full text-sm">
              <thead className="sticky top-0 z-20 [&_th]:border-t-0">
                <tr className="bg-yellow-400 text-black text-left uppercase text-xs tracking-wide">
                  <th className="border border-slate-200 px-4 py-3 font-semibold text-center">
                    ID
                  </th>
                  <th className="border border-slate-200 px-4 py-3 font-medium text-center whitespace-nowrap">
                    Merchant Name
                  </th>
                  <th className="border border-slate-200 px-4 py-3 font-medium text-center whitespace-nowrap">
                    Merchant Legal Name
                  </th>
                  <th className="border border-slate-200 px-4 py-3 font-medium text-center whitespace-nowrap">
                    MID
                  </th>
                  <th className="border border-slate-200 px-4 py-3 font-semibold text-center whitespace-nowrap">
                    TID
                  </th>
                  <th className="border border-slate-200 px-4 py-3 font-medium text-center whitespace-nowrap">
                    Contact Number
                  </th>
                  <th className="border border-slate-200 px-4 py-3 font-medium text-center whitespace-nowrap">
                    Email Address
                  </th>
                  <th className="border border-slate-200 px-4 py-3 font-semibold text-center whitespace-nowrap">
                    MCC
                  </th>
                  <th className="border border-slate-200 px-4 py-3 font-semibold text-center whitespace-nowrap">
                    Status
                  </th>
                  <th className="border border-slate-200 px-4 py-3 font-semibold text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-slate-400 border border-slate-200">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 border border-slate-200"
                    >
                      <td className="border border-slate-200 px-4 py-4 text-slate-500 text-center">
                        {page * size + index + 1}
                      </td>
                      <td className="px-4 py-4 text-center border border-slate-200">
                        <div className="font-semibold text-slate-800">
                          {item.cpd_name || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center border border-slate-200">
                        <div className="font-semibold text-slate-800">
                          {item.store_dba_name || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-center border border-slate-200">
                        {item.midnumber || "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-center border border-slate-200">
                        {item.tidnumber || "-"}
                      </td>

                      <td className="px-4 py-4 text-slate-600 text-center border border-slate-200">
                        {item.cpd_mobile || "-"}
                      </td>

                      <td className="px-4 py-4 text-slate-600 text-center border border-slate-200">
                        {item.cpd_primary_email_id || "-"}
                      </td>

                      <td className="px-4 py-4 text-slate-600 text-center border border-slate-200">
                        {item.bdd_agp_mcc || "-"}
                      </td>

                      <td className="px-4 py-4 text-center border border-slate-200">
                        <button
                          onClick={() =>
                            handleStatusChange(item.midnumber, item.status)
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${item.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${item.status === "Active"
                              ? "bg-green-500"
                              : "bg-red-500"
                              }`}
                          />
                          {item.status}
                        </button>
                      </td>

                      <td className="px-4 py-4 text-center border border-slate-200 border border-slate-200">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewClick(item.ref_id)}
                            className="bg-[#fec931] text-black px-3 py-1.5 rounded-lg text-xs font-medium"
                          >
                            VIEW
                          </button>
                          <button
                            onClick={() => handleEditClick(item.ref_id)}
                            className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                          >
                            EDIT
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-gray-500">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center p-5 gap-4 border-t border-slate-200">
          {/* Records Info */}
          <div className="text-sm text-slate-500">
            Showing Page{" "}
            <span className="font-semibold text-slate-700">
              {page + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {totalPages}
            </span>{" "}
            | Total Records: {" "}
            <span className="font-semibold text-slate-700">
              {totalRecords}
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              onClick={handlePrevious}
              disabled={page === 0
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium ${page === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {
              [...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium ${page === index
                    ? "bg-yellow-400 text-slate-900"
                    : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {index + 1}
                </button>
              ))
            }

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={page === totalPages - 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${page === totalPages - 1
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}