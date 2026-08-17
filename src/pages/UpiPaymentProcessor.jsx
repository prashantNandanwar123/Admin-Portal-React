import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { FaPlus, FaEdit, FaSave, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";


// ─── Constants ────────────────────────────────────────────────────────────────
const ROWS_PER_PAGE = 10;


const EMPTY_FORM = {
  processor: "",
  acquirer: "",
  midName: "",
  mid: "",
  tid: "",
  mcc: "",
  currency: "INR",
  transactionLimit: "",
  saltKey: "",
  secretKey: "",
  bankURL: "",
  version: "",
  bankCode: "",
  accessCode: "",
  processorBSF: "",
  processorGST: "",
};

const FORM_FIELDS = [
  {
    name: "processor",
    label: "UPI Processor",
    type: "select",
    required: true,
    options: ["TP"],
  },
  {
    name: "acquirer",
    label: "UPI Acquirer",
    type: "select",
    required: true,
    options: ["UNLIMIT","ENKASH", "IDFC"],
  },
  {
    name: "midName",
    label: "MID Name",
    type: "text",
    required: true,
    pattern: "^[A-Za-z ]+$",
    patternMsg: "Only letters and spaces allowed",
  },
  { name: "mid", label: "Merchant / Secret ID", type: "text", required: true },
  { name: "tid", label: "TID", type: "text", required: true },
  { name: "mcc", label: "MCC", type: "text", required: true },
  {
    name: "currency",
    label: "Currency",
    type: "text",
    required: true,
    disabled: true,
  },
  {
    name: "transactionLimit",
    label: "Transaction Limit",
    type: "text",
    required: true,
    pattern: "^[0-9]+$",
    patternMsg: "Only numeric digits allowed",
    maxLength: 7,
  },
  { name: "saltKey", label: "Salt Key", type: "text", required: true },
  { name: "secretKey", label: "Secret Key", type: "text", required: true },
  {
    name: "bankURL",
    label: "Bank URL",
    type: "text",
    required: true,
    placeholder: "https://www.example.com",
    pattern: "^https?:\\/\\/.+",
    patternMsg: "Must start with http:// or https://",
  },
  {
    name: "version",
    label: "Version",
    type: "text",
    required: true,
    pattern: "^[0-9.]+$",
    patternMsg: "Only digits and dots allowed",
  },
  {
    name: "bankCode",
    label: "Bank Code",
    type: "text",
    required: true,
    pattern: "^[A-Za-z0-9]+$",
    patternMsg: "Only alphanumeric characters allowed",
    maxLength: 15,
  },
  {
    name: "accessCode",
    label: "Access Code",
    type: "text",
    required: true,
    pattern: "^[A-Za-z0-9]+$",
    patternMsg: "Only alphanumeric characters allowed",
    maxLength: 15,
  },
  {
    name: "processorGST",
    label: "GST (%)",
    type: "text",
    required: true,
    pattern: "^(100|[1-9]?\\d)(\\.\\d{1,2})?$",
    patternMsg: "Enter a valid GST percentage (0–100)",
  },
];

// ─── Validate full form, returns errors object ────────────────────────────────
function validateForm(form) {
  const errors = {};
  FORM_FIELDS.forEach(({ name, label, required, pattern, patternMsg, disabled }) => {
    if (disabled) return;
    const val = (form[name] || "").trim();

    if (required && !val) {
      errors[name] = `${label} is required`;
      return;
    }
    if (val && pattern) {
      const regex = new RegExp(pattern);
      if (!regex.test(val)) {
        errors[name] = patternMsg || `${label} format is invalid`;
      }
    }
  });
  return errors;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isActive = status === 1 || status === "1" || status === "Active";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${isActive
        ? "bg-green-100 text-green-700 border border-green-300"
        : "bg-red-100 text-red-700 border border-red-300"
        }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ total, page, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  // Show at most 5 page buttons centered around current
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  const visiblePages = pages.slice(start - 1, end);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t text-xs text-gray-500 flex-wrap gap-2">
      <span>
        Showing{" "}
        <span className="font-bold text-blue-700">
          {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)}
        </span>{" "}
        of <span className="font-bold text-blue-700">{total}</span> processor(s)
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded border border-gray-300 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <FaChevronLeft size={10} />
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => onChange(1)}
              className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-200 transition font-semibold"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-gray-400">…</span>}
          </>
        )}

        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-7 h-7 rounded border font-semibold transition ${p === page
              ? "bg-blue-700 text-white border-blue-700"
              : "border-gray-300 hover:bg-gray-200"
              }`}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
            <button
              onClick={() => onChange(totalPages)}
              className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-200 transition font-semibold"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded border border-gray-300 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <FaChevronRight size={10} />
        </button>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ProcessorModal({ mode, form, onChange, onClose, onSubmit, loading }) {
  const isEdit = mode === "edit";
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (name, value) => {
    onChange(name, value);
    if (touched[name]) {
      // Re-validate field on change after first touch
      const fieldDef = FORM_FIELDS.find((f) => f.name === name);
      if (!fieldDef) return;
      const val = value.trim();
      let err = "";
      if (fieldDef.required && !val) {
        err = `${fieldDef.label} is required`;
      } else if (val && fieldDef.pattern) {
        const regex = new RegExp(fieldDef.pattern);
        if (!regex.test(val)) err = fieldDef.patternMsg || `${fieldDef.label} format is invalid`;
      }
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldDef = FORM_FIELDS.find((f) => f.name === name);
    if (!fieldDef || fieldDef.disabled) return;
    const val = (form[name] || "").trim();
    let err = "";
    if (fieldDef.required && !val) {
      err = `${fieldDef.label} is required`;
    } else if (val && fieldDef.pattern) {
      const regex = new RegExp(fieldDef.pattern);
      if (!regex.test(val)) err = fieldDef.patternMsg || `${fieldDef.label} format is invalid`;
    }
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = () => {
    // Touch all fields
    const allTouched = {};
    FORM_FIELDS.forEach(({ name }) => (allTouched[name] = true));
    setTouched(allTouched);

    const errs = validateForm(form);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    onSubmit();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-700 rounded-t-2xl">
          <h2 className="text-white font-bold text-lg uppercase tracking-wide">
            {isEdit ? "Edit UPI Processor" : "Add UPI Processor"}
          </h2>
          <button onClick={onClose} className="text-white hover:text-blue-200 transition text-xl">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORM_FIELDS.map(({ name, label, type, required, options, pattern, maxLength, placeholder, disabled }) => {
              const err = errors[name];
              const isTouched = touched[name];

              return (
                <div key={name}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {type === "select" ? (
                    <>
                      <select
                        value={form[name] || ""}
                        onChange={(e) => handleChange(name, e.target.value)}
                        onBlur={() => handleBlur(name)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 transition ${isTouched && err
                          ? "border-red-400 focus:ring-red-300 bg-red-50"
                          : "border-gray-300 focus:ring-blue-500"
                          }`}
                      >
                        <option value="">Select {label}</option>
                        {options?.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {isTouched && err && (
                        <p className="text-red-500 text-xs mt-1">{err}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        type={type}
                        value={name === "currency" ? "INR" : form[name] || ""}
                        readOnly={disabled}
                        maxLength={maxLength}
                        placeholder={placeholder || (disabled ? "" : `Enter ${label}`)}
                        onBlur={() => handleBlur(name)}
                        onChange={(e) => {
                          if (disabled) return;
                          const value = e.target.value;
                          // Live pattern filtering only for specific fields (midName, transactionLimit etc.)
                          // but NOT for fields where partial input might not match yet (bankURL, version, GST)
                          const liveFilterFields = ["midName", "transactionLimit", "bankCode", "accessCode"];
                          if (pattern && liveFilterFields.includes(name)) {
                            const regex = new RegExp(pattern);
                            if (value === "" || regex.test(value)) {
                              handleChange(name, value);
                            }
                          } else {
                            handleChange(name, value);
                          }
                        }}
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 transition ${disabled
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                          : isTouched && err
                            ? "border-red-400 focus:ring-red-300 bg-red-50"
                            : "border-gray-300 focus:ring-blue-500"
                          }`}
                      />
                      {isTouched && err && (
                        <p className="text-red-500 text-xs mt-1">{err}</p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UpiPaymentProcessor() {
  const [data, setData] = useState([]);
  // Pagination
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal
  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);

  const filteredData = data.filter((item) => {
    const search = searchTerm.trim().toLowerCase();

    return Object.entries(item).some(([key, value]) => {
      if (key === "secretKey" || key === "saltKey") return false;

      return String(value ?? "")
        .toLowerCase()
        .includes(search);
    });
  });
  useEffect(() => {
    fetchProcessors();
  }, []);

  // ─── Fetch ───────────────────────────────────────────────────────────────────
  const fetchProcessors = async () => {
    try {
      setLoading(true);
      const resData = await axiosInstance.post("/MasterPaymentProcessorUpi");
      if (resData?.respCode === 0) {
        setData(resData.respData || []);
        setPage(1);
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Modal Helpers ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setModalMode("add");
  };

  const openEdit = (item) => {
    setForm({
      processor: item.processor || "",
      acquirer: item.acquirer || "",
      midName: item.midName || "",
      mid: item.mid || "",
      tid: item.tid || "",
      mcc: item.mcc || "",
      currency: item.currency || "INR",
      transactionLimit: String(item.transactionLimit || ""),
      saltKey: item.saltKey || "",
      secretKey: item.secretKey || "",
      bankURL: item.bankURL || "",
      version: item.version || "",
      bankCode: item.bankCode || "",
      accessCode: item.accessCode || "",
      processorBSF: item.processorBSF || "",
      processorGST: String(item.processorGST || ""),
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

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = modalMode === "edit" ? { ...form, id: editId } : { ...form };

      const endpoint =
        modalMode === "edit"
          ? `/submitEditMasterPaymentProcessorUpi/${editId}`
          : "/submtMasterPaymentProcessorUpi";

      const resData = await axiosInstance.post(endpoint, payload);

      if (resData?.respCode === 0) {
        toast.success(resData.respMsg);
        closeModal();
        fetchProcessors();

      } else {
        toast.error(resData.respMsg);
      }
    } catch (error) {
      toast.error("Operation Failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Paginated slice ─────────────────────────────────────────────────────────
  const totalRows = filteredData.length;
  const pagedData = filteredData.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const TABLE_COLS = [
    "#", "UPI Processor", "UPI Acquirer", "MID Name", "Merchant ID",
    "Currency", "Txn Limit", "Bank URL", "Bank Code",
    "GST (%)", "Creation Date", "Status", "Action",
  ];
  

  return (
    <div className="min-h-screen  p-4 md:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl uppercase pb-3 text-blue-900 font-extrabold">
            UPI Payment Processor
          </h2>
          <p className="pb-3 text-lg text-blue-900">
            Process and manage UPI payments with real-time transaction handling and secure Payment routing.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm shadow transition self-start md:self-auto"
        >
          <FaPlus />
          Add Processor
        </button>
      </div>

      {/* Table Card */}
      <div className="w-full flex justify-end mb-4">
        <div className="relative w-80">
          <FaSearch className="absolute top-4 left-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search merchant..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full border border-slate-300 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-orange-600 text-white">
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
                      <span className="text-gray-500 text-sm">Loading processors...</span>
                    </div>
                  </td>
                </tr>
              ) : pagedData.length > 0 ? (
                pagedData.map((item, index) => {
                  const globalIndex = (page - 1) * ROWS_PER_PAGE + index + 1;
                  return (
                    <tr
                      key={item.id}
                      className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                    >
                      <td className="px-3 py-3 text-gray-500 font-medium">{globalIndex}</td>
                      <td className="px-3 py-3 font-bold text-blue-700">{item.processor || "-"}</td>
                      <td className="px-3 py-3">{item.acquirer || "-"}</td>
                      <td className="px-3 py-3 font-semibold text-gray-700">{item.midName || "-"}</td>
                      <td className="px-3 py-3 font-mono text-gray-600">{item.mid || "-"}</td>
                      <td className="px-3 py-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
                          {item.currency || "INR"}
                        </span>
                      </td>
                      <td className="px-3 py-3">₹{item.transactionLimit || "0"}</td>
                      <td
                        className="px-3 py-3 max-w-[160px] truncate text-gray-500"
                        title={item.bankURL}
                      >
                        {item.bankURL || "-"}
                      </td>
                      <td className="px-3 py-3">{item.bankCode || "-"}</td>
                      <td className="px-3 py-3">{item.processorGST ?? "-"}</td>
                      <td className="px-3 py-3">{item.creationDate ?? "-"}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => openEdit(item)}
                          className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow transition"
                        >
                          <FaEdit />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={TABLE_COLS.length} className="text-center py-14 text-gray-400 text-sm">
                    No UPI Processors Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          
        </div>

        {/* Pagination */}
        {!loading && totalRows > 0 && (
          <Pagination
            total={totalRows}
            page={page}
            perPage={ROWS_PER_PAGE}
            onChange={(p) => setPage(p)}
          />
        )}
      </div>

      {/* Modal */}
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
}