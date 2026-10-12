import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { FaSearch, FaFileExcel, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

// ─── Excel / CSV Export ────────
const exportToExcel = (data) => {
  if (!data.length) return alert("No data to export");

  const headers = [
    "MID", "DBA Name", "Merchant Type", "Payment Type", "Currency",
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


// ─── Status Badge ──────────────────────────────────────────
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

  // ─── Search API ─────────────────────────────────────────────────────────────
  const fetchData = async (currentPage = 0, currentSize = size) => {
    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }
    try {
      setLoading(true);
      const resData = await axiosInstance.post(
        `/TxnReport?page=${currentPage}&size=${currentSize}`,
        {
          fromDate: formatDate(fromDate),
          toDate: formatDate(toDate),
        }
      );
      if (resData?.respCode === 0) {
        setData(resData.data || []);
        setTotalPages(Number(resData.totalPages) || 0);
        setTotalRecords(Number(resData.totalRecords) || 0);
        setPage(currentPage); //  new line
      }
      else {
        setData([]);
        setTotalPages(0);
        setTotalRecords(0);
        setPage(0);
      }
      setSearched(true);
    } catch (error) {
      setData([]);
      setTotalPages(0);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0, size);
  }, []);

  const handleSearch = () => {
    setPage(0);
    fetchData(0, size);
  };

  const handlePageChange = (newPage) => {
    if (loading) return;
    if (newPage < 0 || newPage >= totalPages) return;
    fetchData(newPage, size);
  };

  // Handle Size Chnage
  const handleSizeChange = (newSize) => {
    setSize(newSize);
    setPage(0);
    fetchData(0, newSize);
  }

  // ─── Pagination helpers ─────────────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    // First page
    pages.push(0);

    // Current page near the beginning
    if (page <= 3) {
      pages.push(1);
      pages.push(2);
      pages.push(3);
      pages.push("...");
      pages.push(totalPages - 1);

      return pages;
    }

    // Current page near the end
    if (page >= totalPages - 4) {
      pages.push("...");
      pages.push(totalPages - 4);
      pages.push(totalPages - 3);
      pages.push(totalPages - 2);
      pages.push(totalPages - 1);

      return pages;
    }

    // Current page in the middle
    pages.push("...");
    pages.push(page - 1);
    pages.push(page);
    pages.push(page + 1);
    pages.push("...");
    pages.push(totalPages - 1);

    return pages;
  };

  // ─── Table columns config ───────────────────────────────────────────────────
  const columns = [
    { label: "Sr.No", key: "srNo" },
    { label: "MID", key: "mid" },
    { label: "Fee Type", key: "FeeType" },
    { label: "DBA Name", key: "dbaName" },
    { label: "Merchant Type", key: "merchantType" },
    { label: "Payment Type", key: "paymentType" },
    { label: "Currency", key: "currency" },
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
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-2xl font-semibold">
          Transaction Report
        </h1>
        <p className="pb-3 text-sm text-slate-800">
          View and monitor transaction records with detailed reports, status tracking, payment insights, and export options.
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <div className="mb-5">
        <div className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
          <div className="w-full md:w-52">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              max={today}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-gray-500 text-sm"
            />
          </div>
          <div className="w-full md:w-52">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              max={today}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-gray-500 text-sm"
            />
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 md:flex-none bg-[#fec931] text-black px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-normal shadow transition">
              <FaSearch />
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              onClick={() => exportToExcel(data)}
              disabled={!data.length}
              className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow transition">
              <FaFileExcel />
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-8">
        <div className="w-full">
          <div className="flex justify-end mb-4">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-600 font-medium">Show</span>
                <select
                  value={size}
                  onChange={(e) => handleSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#fec931]"                >
                  <option value={10}>10</option>
                  <option value={25}>25 </option>
                  <option value={50}>50 </option>
                </select>
                <span className="text-slate-600 font-medium">entries</span>
              </div>

              <div className="relative">
                <FaSearch className="absolute top-4 left-3 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-slate-300 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#fec931]"
                />
              </div>
            </div>
          </div>

          {/* Table Scroll */}
          <div className="w-full overflow-x-auto overflow-y-hidden">
            <div className="min-w-[1800px]">
              <table className="w-full text-xs whitespace-nowrap border border-gray-300">
                <thead>
                  <tr className="bg-[#fec931] text-black uppercase">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-3 py-3 text-left font-semibold tracking-wide border border-gray-200">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={index}
                        className={`border-b hover:bg-gray-100  border-gray-300 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                      >
                        <td className="px-3 py-2.5 text-gray-600 font-medium border border-gray-200">
                          {page * size + index + 1}
                        </td>
                        <td className="px-3 py-2.5 border border-gray-200">
                          {item.mid || "-"}
                        </td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.chargeType || "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.dbaName || "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.merchantType || "-"}</td>

                        <td className="px-3 py-2.5 border border-gray-200">
                          <span className="text-black font-semibold">
                            {item.paymentType || "-"}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.currency || "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.meOrderNo || "-"}</td>
                        <td className="px-3 py-2.5  border border-gray-200">{item.meTrnRefNo || "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.procTrnRefId || "-"}</td>

                        <td className="px-3 py-2.5 font-semibold text-gray-800 border border-gray-200">
                          ₹{item.payAmount / 100 || "0"}
                        </td>

                        <td className="px-3 py-2.5 border border-gray-200">{item.msfFee ?? "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.msfGstFee ?? "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.convenienceFee ?? "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.gstFee ?? "-"}</td>

                        <td className="px-3 py-2.5 border border-gray-200 font-bold text-gray-800">
                          ₹{item.totalAmount / 100 || "0"}
                        </td>

                        <td className="px-3 py-2.5 border border-gray-200">{item.txnDate || "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.txnRespDate || "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.fullName || "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.mobileNo || "-"}</td>
                        <td className="px-3 py-2.5 border border-gray-200">{item.emailId || "-"}</td>

                        <td className="px-3 py-2.5 border border-gray-200">
                          <StatusBadge msg={item.respMessage} />
                        </td>

                        <td className="px-3 py-2.5 border border-gray-200">{item.rrn || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length}>
                        <div className="w-full text-center py-14 text-gray-400 text-sm">
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

              {/* Showing Information */}
              <div className="text-sm text-gray-600">
                Showing page{" "}
                <span className="font-bold text-yellow-400">
                  {page + 1}
                </span>{" "}
                of{" "}
                <span className="font-bold text-yellow-400">
                  {totalPages}
                </span>{" "}
                | Total Records:{" "}
                <span className="font-bold text-yellow-400">
                  {totalRecords}
                </span>
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* FIRST PAGE */}
                <button
                  type="button"
                  onClick={() => handlePageChange(0)}
                  disabled={page === 0 || loading}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition-all ${page === 0 || loading
                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <FaAngleDoubleLeft size={13} />
                </button>

                {/* PREVIOUS PAGE */}
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0 || loading}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition-all ${page === 0 || loading
                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <FaChevronLeft size={11} />
                </button>

                {/* PAGE NUMBERS */}
                {getPageNumbers().map((p, index) => {

                  // Dots
                  if (p === "...") {
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
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      disabled={loading}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${p === page
                        ? "bg-[#fec931] text-black shadow-sm"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {p + 1}
                    </button>
                  );
                })}

                {/* NEXT PAGE */}
                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages || loading}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition-all ${page + 1 >= totalPages || loading
                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <FaChevronRight size={11} />
                </button>

                {/* LAST PAGE */}
                <button
                  type="button"
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={page === totalPages - 1 || loading}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition-all ${page === totalPages - 1 || loading
                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <FaAngleDoubleRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



