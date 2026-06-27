import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { FaPlus, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useMemo } from "react";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function User() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // First Time render
  useEffect(() => {
    fetchProcessors();
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handke Form Chnage function for form input
  const handleFormChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));  // copy the previous value

  };

  const closeModal = () => {
    setModalMode(null);
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  // ─── Fetch List ─────────────────────────────────────────────────────────────
  const fetchProcessors = async () => {
    try {
      setLoading(true);
      // Interceptor unwraps response.data — resData IS the JSON body
      const resData = await axiosInstance.post("/allUsers");
      if (resData?.respCode === 0) {
        setData(resData.respData || []);
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Open Add Modal ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setModalMode("add");
  };

  // ─── Open Edit Modal ─────────────────────────────────────────────────────────
  const openEdit = (item) => {
    setForm({
      userName: item.userName || "",
      fullName: item.fullName || "",
      designation: item.designation || "",
      employeeCode: item.employeeCode || "",
      mobileNo: item.mobileNo || "",
      emailId: item.emailId || "",
    });
    setEditId(item.id);
    setModalMode("edit");
  };

  // ─── Save (Add or Edit) ──────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      // Full Name Validation
      if (!/^[A-Za-z ]+$/.test(form.fullName)) {
        toast.error("Full Name should contain only alphabets");
        return;
      }
      // Mobile Validation
      if (!/^\d{10}$/.test(form.mobileNo)) {
        toast.error("Mobile No must be 10 digits");
        return;
      }
      setSaving(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      const createdBy = userData?.userName

      const payload = {
        userName: form.userName,
        fullName: form.fullName,
        designation: form.designation,
        employeeCode: form.employeeCode,
        mobileNo: form.mobileNo,
        emailId: form.emailId,
      };

      let response;
      if (modalMode === "edit") {
        response = await axiosInstance.post(`/updateUserDetails/${editId}`,
          payload
        );
      } else {
        response = await axiosInstance.post(`/submitCreateUser/${createdBy}`,
          payload
        );
      }
      if (response?.respCode === 0) {
        toast.success(response?.respMsg);
        closeModal();
        fetchProcessors();
      } else {
        toast.error(response?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
    finally {
      setSaving(false);
    }
  };

  // Search
  const searchableFields = [
    "userName",
    "userId",
    "fullName",
    "designation",
    "employeeCode",
    "mobileNo",
    "createdBy",
    "createdDate",
  ];

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const search = searchTerm.toLowerCase();

    return data.filter((item) =>
      searchableFields.some((field) =>
        String(item[field] ?? "")
          .toLowerCase()
          .includes(search)
      )
    );
  }, [data, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / entriesPerPage)
  );

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  // ─── Table columns ───────────────────────────────────────────────────────────
  const TABLE_COLS = [
    "ID",
    "USER NAME",
    "USER ID",
    "FULL NAME",
    "DESIGNATION",
    "EMPLOYEE CODE",
    "MOBILE NO",
    "EMAIL",
    "CREATED BY",
    "CREATED DATE",
    "STATUS",
    "ACTION",
  ];

  // ─── Update Status ───────────────────────────────────────────────────────────
  const handleStatusChange = async (item) => {
    try {
      const payload = {
        userId: item.userId,
        status: item.status === "A" ? "D" : "A",
        userName: item.userName,
      };

      const response = await axiosInstance.post(
        "/updateUserStatus",
        payload
      );

      if (response?.respCode === 0) {
        toast.success(response?.respMsg);
        fetchProcessors();
      } else {
        toast.error(response?.respMsg);
      }
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* ── Header ── */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl uppercase pb-3 text-blue-900 font-extrabold">
            ALL USER
          </h2>
          <p className="pb-3 text-lg text-blue-900">
            Manage user accounts, access permissions, profile details, activity status, and authentication settings efficiently.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm shadow transition self-start md:self-auto"
        >
          <FaPlus />
          Add User table name
        </button>
      </div>
      {/* ── Table ── */}
      <div>
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

          {/* Serach Button  */}
          <div className="relative w-80">
            <FaSearch className="absolute top-4 left-3 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search merchant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
        <div className="overflow-auto max-h-[65vh]">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="sticky top-0 z-10 bg-orange-600 text-white">
                {TABLE_COLS.map((col) => (
                  <th key={col} className="px-3 py-3 text-left font-semibold tracking-wide">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="text-center py-14">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-9 w-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-500 text-sm">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-200 hover:bg-blue-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    <td className="px-3 py-3 text-gray-500 font-medium">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                    <td className="px-3 py-3 font-bold text-blue-700">{item.userName || "-"}</td>
                    <td className="px-3 py-3">{item.userId || "-"}</td>
                    <td className="px-3 py-3 font-semibold text-gray-700">{item.fullName || "-"}</td>
                    <td className="px-3 py-3 font-mono text-gray-600">{item.designation || "-"}</td>
                    <td className="px-3 py-3 font-mono text-gray-600">{item.employeeCode || "-"}</td>
                    <td className="px-3 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
                        {item.mobileNo || "-"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
                        {item.emailId || "-"}
                      </span>
                    </td>
                    <td className="px-3 py-3">{item.createdBy}  </td>
                    <td className="px-3 py-3 max-w-[160px] truncate text-gray-500">
                      {item.createdDate || "-"}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => handleStatusChange(item)}
                        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border transition
                                    ${item.status === "A"
                            ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                            : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                          }`}
                      >
                        {item.status === "A" ? "A" : "D"}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => openEdit(item)}
                        className="bg-green-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow transition"
                      >
                        <FaEdit />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="text-center py-14 text-gray-400 text-sm">
                    No Users Found
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
              <b>{filteredData.length === 0 ? 0 : indexOfFirst + 1}</b>
              {" "}to{" "}
              <b>{Math.min(indexOfLast, filteredData.length)}</b>
              {" "}of{" "}
              <b>{filteredData.length}</b>
              {" "}entries
            </div>
            {/* Pagination */}
            <div className="flex items-center gap-2">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-lg border ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
                  }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg ${currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded-lg border ${currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
                  }`}
              >
                Next
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalMode && (
        <ProcessorModal
          mode={modalMode}
          form={form}
          onChange={handleFormChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={saving}
        />
      )}
    </div>
  );
  data.forEach((item) => {
    console.log(
      "userName =",
      JSON.stringify(item.userName),
      "Match =",
      String(item.userName ?? "")
        .trim()
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    );
  });


}

// ─── Initial empty form ───────────────────────────────────────────────────────
const EMPTY_FORM = {
  userName: "",
  fullName: "",
  designation: "",
  employeeCode: "",
  mobileNo: "",
  emailId: ""
};

// ─── Field config for the form ────────────────────────────────────────────────
const FORM_FIELDS = [
  { name: "userName", label: "User Name", type: "text", required: true },
  { name: "fullName", label: "Full Name", type: "text", required: true },
  { name: "designation", label: "Designation", type: "text", required: true },
  { name: "employeeCode", label: "Employee Code", type: "text", required: true },
  { name: "mobileNo", label: "Mobile No", type: "text", required: true },
  { name: "emailId", label: "Email Id", type: "text", required: true },


];
// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${status === "Active"
      ? "bg-green-100 text-green-700 border border-green-300"
      : "bg-red-100 text-red-700 border border-red-300"
      }`}
  >
    {status || "-"}
  </span>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
function ProcessorModal({
  mode,
  form,
  onChange,
  onClose,
  onSubmit,
  loading,
}) {
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-700 rounded-t-2xl">
          <h2 className="text-white font-bold text-lg uppercase tracking-wide">
            {isEdit ? "Edit User" : "Add User"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition text-xl"
          >
            <FaTimes />
          </button>
        </div>
        {/* Modal Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORM_FIELDS.map(({ name, label, type, required }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type={type}
                  value={form[name] || ""}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Full Name → Only Alphabets + Space
                    if (name === "fullName") {
                      value = value.replace(/[^A-Za-z ]/g, "");
                    }
                    // Mobile No → Only Numbers + Max 10 Digit
                    if (name === "mobileNo") {
                      value = value.replace(/\D/g, "").slice(0, 10);
                    }
                    if (name === "emailId") {
                      value = value.replace(/\s/g, "");
                    }
                    onChange(name, value);
                  }}
                  placeholder={`Enter ${label}`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Modal Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow transition"
          >
            <FaSave />
            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

