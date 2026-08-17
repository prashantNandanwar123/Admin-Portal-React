import { useEffect, useState } from "react";
import {
  Search,
  TrendingUp,
  Clock,
  XCircle,
  Wallet,
  FileText,
  CheckCircle2,
  Gift,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../api/axios";

// 🔹 DEMO DATA — used only as a fallback so the UI has something to show
// before the backend sends chart_data / recent_transactions.
// Remove this once your API returns real values for these fields.
const DEMO_CHART_DATA = [
  { time: "00:00", success: 0, pending: 0, failed: 0 },
  { time: "02:00", success: 2, pending: 0, failed: 0 },
  { time: "04:00", success: 5, pending: 1, failed: 0 },
  { time: "06:00", success: 9, pending: 2, failed: 0 },
  { time: "08:00", success: 12, pending: 4, failed: 0 },
  { time: "10:00", success: 22, pending: 9, failed: 0 },
  { time: "12:00", success: 30, pending: 13, failed: 0 },
  { time: "14:00", success: 27, pending: 12, failed: 0 },
  { time: "16:00", success: 20, pending: 8, failed: 0 },
  { time: "18:00", success: 13, pending: 5, failed: 0 },
  { time: "20:00", success: 7, pending: 3, failed: 0 },
  { time: "22:00", success: 3, pending: 1, failed: 0 },
  { time: "24:00", success: 0, pending: 0, failed: 0 },
];

const DEMO_RECENT_TRANSACTIONS = [
  {
    id: 1,
    merchantName: "HelloPe Financial Services Pvt Ltd",
    transactionId: "TXN1234567890",
    amount: 30.0,
    status: "Success",
    time: "22/05/2025 14:30:22",
  },
];

export default function Dashboard() {
  const [data, setData] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const payload = {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      };

      const res = await axiosInstance.post("/ReportsDashboard", payload);
      setData(res.respData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Laptop / Desktop
        main.style.overflowY = "hidden";
      } else {
        // Mobile
        main.style.overflowY = "auto";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      // Other pages ke liye Layout ka default restore
      main.style.overflowY = "auto";
    };
  }, []);

  // 🔹 Convert YYYY-MM-DD → DD/MM/YYYY HH:mm:ss
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  // Derived / fallback values so the UI still renders sensibly
  // if the backend hasn't been extended with these fields yet.
  const totalCount = data.total_count || 0;
  const totalAmount = (data.total_amount || 0) / 100;
  const successRate =
    data.success_rate ??
    (totalCount ? ((data.success_count / totalCount) * 100).toFixed(2) : "0.00");
  const failureRate =
    data.failure_rate ??
    (totalCount ? ((data.failed_count / totalCount) * 100).toFixed(2) : "0.00");
  const avgTransactionValue =
    data.avg_transaction_value ??
    (totalCount ? (totalAmount / totalCount).toFixed(2) : "0.00");
  const refunds = (data.refunds || 0) / 100 || 0;

  // Falls back to demo data only when the API hasn't sent these fields yet.
  const chartData =
    data.chart_data && data.chart_data.length > 0 ? data.chart_data : DEMO_CHART_DATA;
  const recentTransactions =
    data.recent_transactions && data.recent_transactions.length > 0
      ? data.recent_transactions
      : DEMO_RECENT_TRANSACTIONS;

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-4 sm:p-6 xl:py-3 xl:px-6 xl space-y-6 xl:space-y-2.5 hide-scrollbar">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 xl:gap-2">
        <div className="pt-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-2xl font-bold text-[#1A2233]">
            Welcome back, {user.userName || "Administrator"}{" "}
            <span className="inline-block">👋</span>
          </h1>
          <p className="text-[#5B6478] text-sm sm:text-base xl:text-xs mt-1 xl:mt-0.5">
            Your payment gateway is running at peak performance. Here's your
            real-time financial overview for today.
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 xl:gap-2 pt-2">
          {/* FROM */}
          <div className="flex items-center gap-2 xl:gap-1.5">
            <span className="text-sm xl:text-xs text-gray-600 font-medium">From:</span>
            <div
              className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden bg-white relative shadow-sm xl:!h-[30px]"
              style={{ height: "38px" }}
            >
              <input
                type="text"
                value={fromDate ? fromDate.split("-").reverse().join("/") : ""}
                readOnly
                className="px-3 xl:px-2 text-sm xl:text-xs outline-none bg-transparent cursor-pointer w-[100px] sm:w-[110px] xl:w-[85px]"
                style={{ height: "100%" }}
              />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
                id="fromPicker"
              />
              <div
                className="bg-white w-9 xl:w-7 flex items-center justify-center flex-shrink-0 cursor-pointer border-l border-gray-200"
                onClick={() => document.getElementById("fromPicker").showPicker()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5B6478"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
          </div>

          {/* TO */}
          <div className="flex items-center gap-2 xl:gap-1.5">
            <span className="text-sm xl:text-xs text-gray-600 font-medium">To:</span>
            <div
              className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden bg-white relative shadow-sm xl:!h-[30px]"
              style={{ height: "38px" }}
            >
              <input
                type="text"
                value={toDate ? toDate.split("-").reverse().join("/") : ""}
                readOnly
                className="px-3 xl:px-2 text-sm xl:text-xs outline-none bg-transparent cursor-pointer w-[100px] sm:w-[110px] xl:w-[85px]"
                style={{ height: "100%" }}
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
                id="toPicker"
              />
              <div
                className="bg-white w-9 xl:w-7 flex items-center justify-center flex-shrink-0 cursor-pointer border-l border-gray-200"
                onClick={() => document.getElementById("toPicker").showPicker()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5B6478"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 xl:gap-1.5 bg-[#F5B933] hover:bg-[#e5ab27] text-[#1A2233] px-4 xl:px-3 rounded-lg transition-all duration-200 active:scale-95 font-semibold shadow-sm xl:!h-[30px]"
            style={{ height: "38px" }}
          >
            <Search size={15} />
            <span className="text-sm xl:text-xs">Search</span>
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 xl:gap-3 xl:pt-4">
        <Card
          title="Successful Transactions"
          amount={`₹${(data.success_amount / 100).toFixed(2)}`}
          count={data.success_count}
          trend={data.success_trend}
          icon={<TrendingUp size={20} />}
          iconBg="bg-[#22C55E]"
          cardBg="bg-[#EFFBF3]"
          badgeColor="text-[#22C55E] bg-[#DCFCE7]"
        />
        <Card
          title="Pending Transactions"
          amount={`₹${(data.pending_amount / 100).toFixed(2)}`}
          count={data.pending_count}
          trend={data.pending_trend}
          icon={<Clock size={20} />}
          iconBg="bg-[#F59E0B]"
          cardBg="bg-[#FEF6E9]"
          badgeColor="text-[#B45309] bg-[#FEF3C7]"
        />
        <Card
          title="Failed Transactions"
          amount={`₹${(data.failed_amount / 100).toFixed(2)}`}
          count={data.failed_count}
          trend={data.failed_trend}
          icon={<XCircle size={20} />}
          iconBg="bg-[#F43F5E]"
          cardBg="bg-[#FDF0F3]"
          badgeColor="text-[#BE123C] bg-[#FFE4E6]"
        />
        <Card
          title="Total Transactions"
          amount={`₹${totalAmount.toFixed(2)}`}
          count={data.total_count}
          trend={data.total_trend}
          icon={<Wallet size={20} />}
          iconBg="bg-[#4C6FFF]"
          cardBg="bg-[#EEF3FD]"
          badgeColor="text-[#3B4CC0] bg-[#E0E7FF]"
        />
      </div>

      {/* CHART + SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 xl:gap-2.5 xl:pt-4">
        {/* CHART */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4 sm:p-6 xl:p-3">
          <div className="flex items-center justify-between mb-4 xl:mb-1.5">
            <h3 className="font-bold text-[#1A2233] text-base sm:text-lg xl:text-sm">
              Transaction Overview
            </h3>
            <button className="flex items-center gap-2 text-sm xl:text-[11px] border border-gray-200 rounded-lg px-3 xl:px-2 py-1.5 xl:py-0.5 text-gray-600 bg-white">
              Today
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>

          <div className="flex items-center gap-5 xl:gap-2.5 mb-2 xl:mb-0.5 text-xs sm:text-sm xl:text-[11px]">
            <Legend color="#22C55E" label="Successful" />
            <Legend color="#F59E0B" label="Pending" />
            <Legend color="#F43F5E" label="Failed" />
          </div>

          <div className="w-full h-[260px] sm:h-[300px] xl:h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF1F6" />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9AA3B2" }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9AA3B2" }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="success"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fill="url(#successGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#pendingGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="#F43F5E"
                  strokeWidth={2}
                  fill="url(#failedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 xl:p-3">
          <div className="flex items-center justify-between mb-4 xl:mb-1.5">
            <h3 className="font-bold text-[#1A2233] text-base sm:text-lg xl:text-sm">Summary</h3>
            <button className="text-sm xl:text-[11px] text-[#1A2233] font-semibold hover:underline flex items-center gap-1">
              View Report <span>→</span>
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            <SummaryRow
              icon={<Wallet size={16} />}
              iconBg="bg-[#E0E7FF] text-[#4C6FFF]"
              label="Total Transaction Amount"
              value={`₹${totalAmount.toFixed(2)}`}
            />
            <SummaryRow
              icon={<FileText size={16} />}
              iconBg="bg-[#EDE9FE] text-[#7C3AED]"
              label="Average Transaction Value"
              value={`₹${avgTransactionValue}`}
            />
            <SummaryRow
              icon={<CheckCircle2 size={16} />}
              iconBg="bg-[#DCFCE7] text-[#22C55E]"
              label="Success Rate"
              value={`${successRate}%`}
              valueColor="text-[#22C55E]"
            />
            <SummaryRow
              icon={<XCircle size={16} />}
              iconBg="bg-[#FFE4E6] text-[#F43F5E]"
              label="Failure Rate"
              value={`${failureRate}%`}
              valueColor="text-[#F43F5E]"
            />
            <SummaryRow
              icon={<Gift size={16} />}
              iconBg="bg-[#FBE9D2] text-[#C2792D]"
              label="Refunds"
              value={`₹${refunds.toFixed(2)}`}
            />
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 xl:p-3 xl:mt-4">
        <div className="flex items-center justify-between mb-4 xl:mb-1.5">
          <h3 className="font-bold text-[#1A2233] text-base sm:text-lg xl:text-sm">
            Recent Transactions
          </h3>
          <button className="text-sm xl:text-[11px] bg-[#F5B933] hover:bg-[#e5ab27] text-[#1A2233] font-semibold px-4 xl:px-2.5 py-1.5 xl:py-0.5 rounded-lg transition-all">
            View All
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[640px] xl:min-w-0 text-sm xl:text-[11px]">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="py-2 xl:py-1 px-4 sm:px-2 font-medium">ID</th>
                <th className="py-2 xl:py-1 px-4 sm:px-2 font-medium">Merchant Name</th>
                <th className="py-2 xl:py-1 px-4 sm:px-2 font-medium">Transaction ID</th>
                <th className="py-2 xl:py-1 px-4 sm:px-2 font-medium">Amount</th>
                <th className="py-2 xl:py-1 px-4 sm:px-2 font-medium">Status</th>
                <th className="py-2 xl:py-1 px-4 sm:px-2 font-medium">Time</th>
                <th className="py-2 xl:py-1 px-4 sm:px-2"></th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 xl:py-3 px-4 text-center text-gray-400">
                    No transactions to show
                  </td>
                </tr>
              ) : (
                recentTransactions.map((txn, i) => (
                  <tr key={txn.id || i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 xl:py-1.5 px-4 sm:px-2 text-gray-500">{txn.id ?? i + 1}</td>
                    <td className="py-3 xl:py-1.5 px-4 sm:px-2 text-[#1A2233] font-medium whitespace-nowrap">
                      {txn.merchantName}
                    </td>
                    <td className="py-3 xl:py-1.5 px-4 sm:px-2 text-gray-500 whitespace-nowrap">
                      {txn.transactionId}
                    </td>
                    <td className="py-3 xl:py-1.5 px-4 sm:px-2 text-[#1A2233] font-medium">
                      ₹{Number(txn.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3 xl:py-1.5 px-4 sm:px-2">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="py-3 xl:py-1.5 px-4 sm:px-2 text-gray-500 whitespace-nowrap">
                      {txn.time}
                    </td>
                    <td className="py-3 xl:py-1.5 px-4 sm:px-2 text-gray-400">
                      <MoreVertical size={16} className="xl:!w-3.5 xl:!h-3.5 cursor-pointer" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, amount, count, trend, icon, iconBg, badgeColor, cardBg }) {
  return (
    <div className={`${cardBg} rounded-2xl p-4 sm:p-5 xl:p-2.5`}>
      <div className="flex items-start justify-between mb-4 xl:mb-1.5">
        <div className="flex items-center gap-3 xl:gap-1.5">
          <div className={`${iconBg} text-white rounded-xl w-10 h-10 xl:w-7 xl:h-7 flex items-center justify-center flex-shrink-0 [&>svg]:xl:!w-4 [&>svg]:xl:!h-4`}>
            {icon}
          </div>
          <p className="text-sm xl:text-[11px] text-gray-500 font-medium leading-tight">{title}</p>
        </div>
        {trend !== undefined && trend !== null && (
          <span className={`${badgeColor} text-xs xl:text-[9px] font-semibold px-2 xl:px-1 py-1 xl:py-0.5 rounded-full whitespace-nowrap`}>
            {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl xl:text-lg font-bold text-[#1A2233]">{amount}</h2>
      <p className="text-sm xl:text-[11px] text-gray-400 mt-1 xl:mt-0.5">{count ?? 0} Transactions</p>
    </div>
  );
}

function SummaryRow({ icon, iconBg, label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between py-3 xl:py-1.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3 xl:gap-1.5">
        <div className={`${iconBg} rounded-lg w-8 h-8 xl:w-5 xl:h-5 flex items-center justify-center flex-shrink-0 [&>svg]:xl:!w-3 [&>svg]:xl:!h-3`}>
          {icon}
        </div>
        <span className="text-sm xl:text-[11px] text-gray-600">{label}</span>
      </div>
      <span className={`text-sm xl:text-[11px] font-semibold ${valueColor || "text-[#1A2233]"}`}>{value}</span>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-gray-500">{label}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const styles =
    s === "success"
      ? "bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]"
      : s === "pending"
        ? "bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]"
        : s === "failed"
          ? "bg-[#FFE4E6] text-[#F43F5E] border border-[#FCA5B1]"
          : "bg-gray-100 text-gray-500 border border-gray-200";
  return (
    <span className={`${styles} text-xs xl:text-[9px] font-semibold px-2.5 xl:px-1.5 py-1 xl:py-0.5 rounded-full capitalize`}>
      {status || "—"}
    </span>
  );
}