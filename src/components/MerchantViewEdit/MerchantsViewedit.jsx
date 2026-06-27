import React, { useEffect, useState } from "react";
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
      console.error("API Error:", error);
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
      console.error(error);
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
      onBack?.(); // ✅ Step 0 pe list page pe wapas
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
  })

  const startIndex = page * size; // iT wil search the data
  const endIndex = startIndex + size; // it will apply the pagination
  const currentData = filteredData.slice(startIndex, endIndex); // and show the data in the table


  //  Open Form
  if (showViewForm) {
    return (
      <MerchantsViewEditForm
        merchantData={selectedMerchant}
        onBack={() => setShowViewForm(false)}  //  sahi state
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
    <div className="min-h-screen p-4">
      {/* Heading */}
      <h2 className="text-4xl uppercase pb-3 text-blue-900 font-extrabold">
        Merchant View / Edit
      </h2>
      <p className="pb-3 text-lg text-blue-900">
        View, update, and manage merchant details, business information, account status, and service configurations efficiently.
      </p>

      {/* Table */}
      <div>
        {/* Search */}
        <div className="relative w-full lg:w-80 pb-5 float-end">
          <FaSearch className="absolute top-4 left-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search merchant..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-full border border-slate-300 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-orange-600 text-white text-left">
              <th className="border px-3 py-3">ID</th>
              <th className="border px-3 py-3">
                Merchant Legal Name
              </th>
              <th className="border px-3 py-3">MID</th>
              <th className="border px-3 py-3">TID</th>
              <th className="border px-3 py-3">
                Contact Number
              </th>
              <th className="border px-3 py-3">
                Email Address
              </th>
              <th className="border px-3 py-3">MCC</th>
              <th className="border px-3 py-3">Status</th>
              <th className="border px-3 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-6"
                >
                  Loading...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50"
                >
                  {/* Serial Number */}
                  <td className="border px-3 py-3">
                    {page * size + index + 1}
                  </td>

                  {/* Merchant Name */}
                  <td className="border px-3 py-3">
                    {item.store_dba_name || "-"}
                  </td>

                  {/* MID */}
                  <td className="border px-3 py-3">
                    {item.midnumber || "-"}
                  </td>

                  {/* TID */}
                  <td className="border px-3 py-3">
                    {item.tidnumber || "-"}
                  </td>

                  {/* Contact */}
                  <td className="border px-3 py-3">
                    {item.cpd_mobile || "-"}
                  </td>

                  {/* Email */}
                  <td className="border px-3 py-3">
                    {item.cpd_primary_email_id || "-"}
                  </td>

                  {/* MCC */}
                  <td className="border px-3 py-3">
                    {item.bdd_agp_mcc || "-"}
                  </td>

                  {/* Status */}
                  <td className="border px-3 py-3">
                    <button onClick={() => handleStatusChange(
                      item.midnumber,
                      item.status
                    )
                    }
                      className={`px-3 py-1 rounded text-white text-xs ${item.status === "Active"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                      {item.status}
                    </button>
                  </td>

                  {/* Action */}
                  < td className="border px-3 py-3 text-center" >
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewClick(item.ref_id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        VIEW
                      </button>
                      <button
                        onClick={() => handleEditClick(item.ref_id)}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-xs">
                        EDIT
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-6 text-gray-500"
                >
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div >

      {/* Bottom Pagination */}
      < div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4" >
        {/* Records Info */}
        < div className="text-sm text-gray-700" >
          Showing Page{" "}
          <span className="font-semibold">
            {page + 1}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {totalPages}
          </span>{" "}
          | Total Records: {" "}
          <span className="font-semibold">
            {totalRecords}
          </span>
        </div >

        {/* Pagination Controls */}
        < div className="flex items-center gap-2" >
          {/* Previous */}
          < button
            onClick={handlePrevious}
            disabled={page === 0
            }
            className={`px-4 py-2 rounded text-white ${page === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
              }`}
          >
            Previous
          </button >

          {/* Page Numbers */}
          {
            [...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index)}
                className={`px-4 py-2 rounded ${page === index
                  ? "bg-orange-600 text-white"
                  : "bg-white border"
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
            className={`px-4 py-2 rounded text-white ${page === totalPages - 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
              }`}
          >
            Next
          </button>

          {/* Page Size */}
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="border px-3 py-2 rounded"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div >
      </div >
    </div >
  );
}