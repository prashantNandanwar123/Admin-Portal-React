import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { FaPlus, FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

// ─── Initial empty form ───────────────────────────────────────────────────────
const EMPTY_FORM = {
  userName: "",
  roleFunction: [],
  roleDescription: "",
};

// ─── Field config for the form ────────────────────────────────────────────────
const FORM_FIELDS = [
  {
    name: "userName",
    label: "User Name",
    type: "select",
    required: true,
  },

  {
    name: "roleFunction",
    label: "Role Function",
    type: "select",
    multiple: true,
    required: true,
    options: [
      "Dashboard",
      "Merchant Registration",
      "Risk Approval",
      "Merchant View / Edit",
      "Merchant Crediential",
      "Merchant Webhook",
      "Report",
      "Master",
      "User Management",
      "Reseller",
      "Virtual Accounts"
    ],
  },

  {
    name: "roleDescription",
    label: "Role Description",
    type: "text",
    required: true,
  },

];

// ─── Modal ────────────────────────────────────────────────────────────────────
function ProcessorModal({
  mode,//add //edit
  form,//Data aya
  onChange,
  onClose,
  onSubmit,
  loading,//savinng
  userList,
}) {

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4 overflow-hide">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-700 rounded-t-2xl">
          <h2 className="text-white font-bold text-lg uppercase tracking-wide">
            {isEdit ? "Edit User" : "Add Role"}
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
            {FORM_FIELDS.map(({ name, label, type, required, options }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {name === "roleFunction" ? (
                  <div className="border border-gray-300 rounded-lg p-3 grid grid-cols-2 gap-3 bg-gray-50">
                    {options?.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={form.roleFunction.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onChange("roleFunction", [
                                ...form.roleFunction,
                                option,
                              ]);
                            } else {
                              onChange(
                                "roleFunction",
                                form.roleFunction.filter(
                                  (val) =>
                                    val.trim().toLowerCase() !==
                                    option.trim().toLowerCase()
                                ));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : type === "select" ? (
                  isEdit ? (
                    <input
                      type="text"
                      value={form[name] || ""}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={form[name] || ""}
                      onChange={(e) => onChange(name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Select {label}</option>
                      {userList.map((user, index) => (
                        <option key={index} value={user}>
                          {user}
                        </option>
                      ))}
                    </select>
                  )
                ) : (
                  <div className="relative">
                    <input
                      autoComplete="off"
                      value={form[name]}
                      onChange={(e) => onChange(name, e.target.value)}
                      placeholder={`Enter ${label}`}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                    </button>
                  </div>
                )}
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
            disabled={loading} //false
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Role() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);//saving
  const [modalMode, setModalMode] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);


  // Search
  const filteredData = data.filter((item) => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;

    const valuesToCheck = [
      item.id,
      item.userName,
      item.roleDescription,
      item.creationDate,
      item.status,
      ...(Array.isArray(item.roleFunction)
        ? item.roleFunction
        : (item.roleFunction || "").split(","))
    ];

    return valuesToCheck.some((val) =>
      String(val).toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    fetchProcessors();
  }, []);

  // ─── Fetch List ─────────────────────────────────────────────────────────────
  const fetchProcessors = async () => {
    try {
      setLoading(true);
      // Interceptor unwraps response.data — resData IS the JSON body
      const resData = await axiosInstance.post("/getAllRole");
      if (resData?.respCode === 0) {
        const normalizedData = (resData.respData || []).map((item) => ({
          ...item,
          roleFunction: Array.isArray(item.roleFunction)
            ? item.roleFunction
            : item.roleFunction
              ? item.roleFunction.split(",").map(v => v.trim())
              : []
        }));

        setData(normalizedData);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error(error)
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Modal Fetch ApI
  const fetchUserNameList = async () => {
    try {
      const response = await axiosInstance.post("/fetchUserName");
      if (response?.respCode === 0) {
        setUserList(response?.respData?.UserName || []);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // ─── Open Add Modal ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setModalMode("add");
    fetchUserNameList();
  };

  // ─── Open Edit Modal ─────────────────────────────────────────────────────────
  const openEdit = (item) => {
    setForm({
      userName: item.userName || "",
      roleFunction: Array.isArray(item.roleFunction)
        ? item.roleFunction
        : item.roleFunction
          ? item.roleFunction.split(",").map((item) => item.trim())
          : [],
      roleDescription: item.roleDescription || "",
    });

    setEditId(item.id);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const handleFormChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ─── Save (Add or Edit) ──────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {      
      setSaving(true);

      const payload = {
        userName: form.userName,
        roleFunction: form.roleFunction,
        roleDescription: form.roleDescription,
      };

      let response;
      if (modalMode === "edit") {
        response = await axiosInstance.post(
          `/updateRoleAccess/${editId}`,
          payload
        );

      } else {
        response = await axiosInstance.post(
          "/createRole",
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

  // ─── Update Status ───────────────────────────────────────────────────────────
  const handleStatusChange = async (item) => {
    try {
      const payload = {
        status: item.status === "A" ? "D" : "A",
        userName: item.userName,
      };

      const response = await axiosInstance.post(
        "/updateLoginStatus",
        payload
      );

      if (response?.respCode === 0) {
        toast.success(response?.respMsg);
        fetchProcessors();
      } else {
        toast.error(response?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // ─── Table columns ───────────────────────────────────────────────────────────
  const TABLE_COLS = [
    "ID",
    "USER NAME",
    "ROLE FUNCTION",
    "ROLE DESCRIPTION",
    "CREATED DATE",
    "STATUS",
    "ACTION",
  ];


  // Bottom Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  return (
    <div className="p-4 md:p-6">
      {/* ── Header ── */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl uppercase pb-3 text-blue-900 font-extrabold">
            Role & Access
          </h1>
          <p className="pb-3 text-lg text-blue-900">
            Create and manage user roles with customized permissions, access controls, and authorization settings securely.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm shadow transition self-start md:self-auto"
        >
          <FaPlus />
          Add Role
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
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full border border-slate-300 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>

        <div className="w-full overflow-x-auto overflow-hidden">
          <table className="min-w-[1200px] w-full text-xs break-words">
            <thead>
              <tr className="bg-orange-600 text-white">
                {TABLE_COLS.map((col) => (
                  <th key={col} className="px-3 py-3 text-left font-semibold tracking-wide">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-base font-noraml">
              {loading ? (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="text-center py-14">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-9 w-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-500 text-sm">
                        Loading roles...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id ?? index}
                    className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    {/* ID */}
                    <td className="px-3 py-3 text-gray-500">
                      {index + 1}
                    </td>

                    {/* USER NAME */}
                    <td className="px-3 py-3  text-blue-700">
                      {item.userName || "-"}
                    </td>

                    {/* ROLE FUNCTION */}
                    <td className="px-3 py-3  text-gray-700">
                      {(item.roleFunction || []).join(", ")}
                    </td>

                    {/* ROLE DESCRIPTION */}
                    <td className="px-3 py-3 text-gray-600">
                      {item.roleDescription || "-"}
                    </td>

                    {/* create Date */}
                    <td className="px-3 py-3 max-w-[160px] truncate text-gray-500">
                      {item.creationDate || "-"}
                    </td>

                    {/* STATUS */}
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

                    {/* ACTION */}
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
                  <td
                    colSpan={TABLE_COLS.length}
                    className="text-center py-14 text-gray-400 text-sm"
                  >
                    No Roles Found
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 transition-all ${currentPage === totalPages || totalPages === 0
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

      {/* ── Add / Edit Modal ── */}
      {modalMode && (
        <ProcessorModal
          mode={modalMode}//add//edit
          form={form}//edit ke sath data
          onChange={handleFormChange}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={saving}//saving
          userList={userList}
        />
      )}
    </div>
  );
}