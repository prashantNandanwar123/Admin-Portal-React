import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axiosInstance from "../api/axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const formatDisplay = (val) => val.replace(/-/g, "/");
  const formatStore = (val) => val.replace(/\//g, "-");

  const today = new Date().toISOString().split("T")[0];
  console.log("today date", today);

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

  // 🔹 Convert YYYY-MM-DD → DD/MM/YYYY HH:mm:ss
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold uppercase">
          Welcome Back,
          <span className="ml-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent font-extrabold">
            {user.userName || "Admin"}
          </span>
          <div></div>
        </h1>
        <p className="text-[#0A66C2] font-normal">
          Your payment gateway is running at Good performance. Here's your
          real-time financial overview for today.
        </p>
      </div>

      <div className="flex items-center justify-end gap-4 rounded-md">
        {/* FROM */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 font-normal">From:</span>
          <div
            className="flex items-stretch border border-gray-300 rounded overflow-hidden bg-white relative"
            style={{ height: "36px" }}
          >
            <input
              type="text"
              value={fromDate ? fromDate.split("-").reverse().join("/") : ""}
              readOnly
              className="px-3 text-sm outline-none bg-transparent cursor-pointer"
              style={{ height: "100%", width: "110px" }}
            />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="absolute opacity-0 w-0 h-0"
              id="fromPicker"
            />
            <div
              className="bg-blue-600 w-9 flex items-center justify-center flex-shrink-0 cursor-pointer"
              onClick={() => document.getElementById("fromPicker").showPicker()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 font-normal">To:</span>
          <div
            className="flex items-stretch border border-gray-300 rounded overflow-hidden bg-white relative"
            style={{ height: "36px" }}
          >
            <input
              type="text"
             value={toDate ? toDate.split("-").reverse().join("/") : ""}
              readOnly
              className="px-3 text-sm outline-none bg-transparent cursor-pointer"
              style={{ height: "100%", width: "110px" }}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="absolute opacity-0 w-0 h-0"
              id="toPicker"
            />
            <div
              className="bg-blue-600 w-9 flex items-center justify-center flex-shrink-0 cursor-pointer"
              onClick={() => document.getElementById("toPicker").showPicker()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
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
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 rounded-md transition-all duration-200 active:scale-95"
          style={{ height: "36px" }}
        >
          <Search size={15} className="opacity-90" />
          <span className="text-sm font-semibold tracking-wide">SEARCH</span>
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Success Transaction"
          count={data.success_count}
          amount={`₹${data.success_amount / 100}`}
          gradient="from-green-400 to-emerald-600"
        />

        <Card
          title="Pending Transaction"
          count={data.pending_count}
          amount={`₹${data.pending_amount / 100}`}
          gradient="from-yellow-400 to-orange-500"
        />

        <Card
          title="Failed Transaction"
          count={data.failed_count}
          amount={`₹${data.failed_amount / 100}`}
          gradient="from-red-400 to-pink-600"
        />

        <Card
          title="Total Transaction"
          count={data.total_count}
          amount={`₹${data.total_amount / 100}`}
          gradient="from-blue-400 to-indigo-600"
        />
      </div>
    </div>
  );
}

function Card({ title, count, amount, gradient }) {
  return (
    <div
      className={`p-6 rounded-2xl text-white bg-gradient-to-r ${gradient} shadow-lg hover:scale-105 transition-all duration-300`}
    >
      <p className="text-sm opacity-90">{title}</p>

      {/* Amount */}
      <h2 className="text-3xl font-bold mt-2">{amount}</h2>

      {/* Count */}
      <p className="text-sm mt-1 opacity-80">{count} Transactions</p>
    </div>
  );
}
