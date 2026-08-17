import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { FaSearch, FaFileExcel } from "react-icons/fa";

// ─── Excel / CSV Export ───────────────────────────────────────────────────────
const exportToExcel = (data) => {
  if (!data.length) return alert("No data to export");

  const headers = [
    "MID", "DBA Name", "Merchant Type", "Payment Type",
    "Order No", "Txn Ref No", "Proc Ref ID",
    "Pay Amount", "MSF Fee", "MSF GST Fee",
    "Convenience Fee", "GST Fee", "Total Amount",
    "Txn Date", "Txn Resp Date",
    "Full Name", "Mobile No", "Email ID",
    "Response Message", "RRN", "Charge Type",
  ];

  const rows = data.map((r) => [
    r.mid, r.dbaName, r.merchantType, r.paymentType,
    r.meOrderNo, r.meTrnRefNo, r.procTrnRefId,
    r.payAmount, r.msfFee, r.msfGstFee,
    r.convenienceFee ?? "", r.gstFee ?? "", r.totalAmount,
    r.txnDate, r.txnRespDate,
    r.fullName, r.mobileNo, r.emailId,
    r.respMessage, r.rrn ?? "", r.chargeType,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((v) => `"${v}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TxnReport_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ msg }) => {
  const lower = (msg || "").toLowerCase();
  const isSuccess = lower.includes("success") || lower.includes("approved");
  const isPending = lower.includes("pending");

  const cls = isSuccess
    ? "bg-green-100 text-green-700 border border-green-300"
    : isPending
      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
      : "bg-red-100 text-red-700 border border-red-300";

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${cls}`}>
      {msg || "-"}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Reports() {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd for input[type=date]

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  // Search Data
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value ?? "")
        .trim()
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )
  );


  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // ─── Format date: yyyy-mm-dd → dd/mm/yyyy ──────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  // ─── Search API ─────────────────────────────────────────────────────────────
  const fetchData = async (currentPage = 0, currentSize = size) => {
    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }
    try {
      setLoading(true);
      // Interceptor unwraps response.data — resData IS the JSON body
      const resData = await axiosInstance.post(
        `/TxnReport?page=${currentPage}&size=${currentSize}`,
        {
          fromDate: formatDate(fromDate),
          toDate: formatDate(toDate),
        }
      );

      if (resData?.respCode === 0) {
        setData(resData.data || []);
        setTotalPages(resData.totalPages || 0);
        setTotalRecords(resData.totalRecords || 0);
        setPage(currentPage);
      } else {
        setData([]);
        setTotalPages(0);
        setTotalRecords(0);
      }
      setSearched(true);
    } catch (error) {
      console.error("TXN REPORT ERROR :", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchData(0, size);
  const handlePageChange = (newPage) => fetchData(newPage, size);
  const handleSizeChange = (newSize) => {
    setSize(newSize);
    fetchData(0, newSize);
  };

  // ─── Pagination helpers ─────────────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(0, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // ─── Table columns config ───────────────────────────────────────────────────
  const columns = [
    { label: "#", key: "srNo" },
    { label: "MID", key: "mid" },
    { label: "Fee Type", key: "FeeType" },
    { label: "DBA Name", key: "dbaName" },
    { label: "Merchant Type", key: "merchantType" },
    { label: "Payment Type", key: "paymentType" },
    { label: "Order No", key: "meOrderNo" },
    { label: "Txn Ref No", key: "meTrnRefNo" },
    { label: "Proc Ref ID", key: "procTrnRefId" },
    { label: "Pay Amt", key: "payAmount" },
    { label: "MSF Fee", key: "msfFee" },
    { label: "MSF GST", key: "msfGstFee" },
    { label: "Conv. Fee", key: "convenienceFee" },
    { label: "GST Fee", key: "gstFee" },
    { label: "Total Amt", key: "totalAmount" },
    { label: "Txn Date", key: "txnDate" },
    { label: "Resp Date", key: "txnRespDate" },
    { label: "Customer Name", key: "fullName" },
    { label: "Mobile", key: "mobileNo" },
    { label: "Email", key: "emailId" },
    { label: "Status", key: "respMessage" },
    { label: "RRN", key: "rrn" },
  ];

  return (
    <div className="min-h-screen p-4 w-full overflow-x-auto">
      {/* ── Header ── */}
      <div className="mb-5">
        <h2 className="text-4xl uppercase pb-3 text-blue-900 font-extrabold">
          Transaction Report
        </h2>
        <p className="pb-3 text-lg text-blue-900">
          View and monitor transaction records with detailed reports, status tracking, payment insights, and export options.
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <div className="mb-5">
        <div className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
          {/* From Date */}
          <div className="w-full md:w-52">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              max={today}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* To Date */}
          <div className="w-full md:w-52">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              max={today}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Search */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow transition"
          >
            <FaSearch />
            {loading ? "Searching..." : "Search"}
          </button>

          {/* Excel Download */}
          <button
            onClick={() => exportToExcel(data)}
            disabled={!data.length}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow transition"
          >
            <FaFileExcel />
            Excel
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="w-full">
        {/* Search */}
        <div className="flex justify-end mb-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-600 font-medium">Show</span>
              <select
                value={size}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1.5 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25 </option>
                <option value={50}>50 </option>
              </select>
              <span className="text-slate-600 font-medium">entries</span>
            </div>

            <div className="relative w-full max-w-xs">
              <FaSearch className="absolute top-4 left-3 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search merchant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-slate-300 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Table Scroll */}
        <div
          style={{
            width: "calc(100vw - 320px)",
            overflowX: "scroll",
            overflowY: "hidden",
          }}
        >
          <div
            className="border border-gray-300"
            style={{
              minWidth: "1800px",
            }}
          >
            <table
              style={{
                minWidth: "1800px",
              }}
              className="w-full text-xs whitespace-nowrap"
            >
              <thead>
                <tr className="bg-orange-600 text-white">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-3 py-3 text-left font-semibold tracking-wide"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-14">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-9 w-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-500 text-sm">
                          Loading transactions...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b hover:bg-blue-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                    >
                      <td className="px-3 py-2.5 text-gray-600 font-medium">
                        {page * size + index + 1}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-blue-700">
                        {item.mid || "-"}
                      </td>
                      <td className="px-3 py-2.5">{item.chargeType || "-"}</td>

                      <td className="px-3 py-2.5">{item.dbaName || "-"}</td>
                      <td className="px-3 py-2.5">{item.merchantType || "-"}</td>

                      <td className="px-3 py-2.5">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                          {item.paymentType || "-"}
                        </span>
                      </td>

                      <td className="px-3 py-2.5">{item.meOrderNo || "-"}</td>
                      <td className="px-3 py-2.5">{item.meTrnRefNo || "-"}</td>
                      <td className="px-3 py-2.5">{item.procTrnRefId || "-"}</td>

                      <td className="px-3 py-2.5 font-semibold text-gray-800">
                        ₹{item.payAmount / 100 || "0"}
                      </td>

                      <td className="px-3 py-2.5">{item.msfFee ?? "-"}</td>
                      <td className="px-3 py-2.5">{item.msfGstFee ?? "-"}</td>
                      <td className="px-3 py-2.5">{item.convenienceFee ?? "-"}</td>
                      <td className="px-3 py-2.5">{item.gstFee ?? "-"}</td>

                      <td className="px-3 py-2.5 font-bold text-gray-800">
                        ₹{item.totalAmount / 100 || "0"}
                      </td>

                      <td className="px-3 py-2.5">{item.txnDate || "-"}</td>
                      <td className="px-3 py-2.5">{item.txnRespDate || "-"}</td>
                      <td className="px-3 py-2.5">{item.fullName || "-"}</td>
                      <td className="px-3 py-2.5">{item.mobileNo || "-"}</td>
                      <td className="px-3 py-2.5">{item.emailId || "-"}</td>

                      <td className="px-3 py-2.5">
                        <StatusBadge msg={item.respMessage} />
                      </td>

                      <td className="px-3 py-2.5">{item.rrn || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length}>
                      <div
                        style={{
                          width: "1800px",
                        }}
                        className="text-center py-14 text-gray-400 text-sm"
                      >
                        {searched
                          ? "No transactions found for the selected date range."
                          : "Select a date range and click Search to view transactions."}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4 px-5 py-3">
            <div className="text-sm text-gray-600">
              Showing page{" "}
              <span className="font-bold text-blue-700">{page + 1}</span> of{" "}
              <span className="font-bold text-blue-700">{totalPages}</span> |
              Total Records:{" "}
              <span className="font-bold text-blue-700">{totalRecords}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="px-3 py-1.5 rounded border text-sm font-medium disabled:opacity-40"
              >
                ← Prev
              </button>

              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded text-sm font-semibold ${p === page
                    ? "bg-orange-600 text-white"
                    : "border hover:bg-gray-100"
                    }`}
                >
                  {p + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded border text-sm font-medium disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


