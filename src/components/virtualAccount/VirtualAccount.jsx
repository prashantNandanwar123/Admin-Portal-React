import { useState } from "react";
import { Plus, RefreshCw, ArrowUpDown, Filter, Search } from "lucide-react";
import CreateVirtualAccountModal from "./CreateVirtualAccountModal";

const DEMO_ACCOUNTS = [
  {
    id: "1987000008145063",
    createdOn: "Jan 29, 2026, 12:32 PM",
    amount: 11020.0,
    status: "Closed",
    expiryDate: "Feb 28, 2026, 11:59 PM",
    description: "Payment for Project 981 - P...",
    reference: "PR981_INV221",
  },
  {
    id: "1987000008145055",
    createdOn: "Jan 29, 2026, 11:32 AM",
    amount: 24650.0,
    status: "Active",
    expiryDate: "Apr 4, 2026, 11:59 PM",
    description: "Payment for Phase -1 Const...",
    reference: "PR21_INV301",
  },
  {
    id: "1987000008088715",
    createdOn: "Jan 27, 2026, 12:26 PM",
    amount: 31900.0,
    status: "Active",
    expiryDate: "Feb 26, 2026, 11:59 PM",
    description: "Payment for RC Constructi...",
    reference: "INV_98021",
  },
  {
    id: "1987000007785399",
    createdOn: "Dec 30, 2025, 01:04 PM",
    amount: 32880.0,
    status: "Active",
    expiryDate: "Jan 31, 2026, 11:59 PM",
    description: "Collecting payments from ...",
    reference: "MPCL_BILL021",
  },
  {
    id: "1987000007785189",
    createdOn: "Dec 30, 2025, 11:39 AM",
    amount: 11320.0,
    status: "Active",
    expiryDate: "Jan 29, 2026, 11:59 PM",
    description: "RC Construction Materials",
    reference: "INV_2101",
  },
  {
    id: "1987000007696232",
    createdOn: "Dec 23, 2025, 11:38 AM",
    amount: 25250.0,
    status: "Active",
    expiryDate: "Jan 22, 2026, 11:59 PM",
    description: "M-Sand and Concrete",
    reference: "PR21_INV912",
  },
];

const TABS = ["All", "Active", "Closed"];

function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
        isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function VirtualAccount() {
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const filteredAccounts =
    activeTab === "All"
      ? DEMO_ACCOUNTS
      : DEMO_ACCOUNTS.filter((a) => a.status === activeTab);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-10 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">
          Virtual Accounts
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            New Virtual Account
          </button>
          <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            <RefreshCw size={16} />
          </button>
          <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-4 bg-gray-50/60">
        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-400 bg-white">
          <Filter size={16} />
        </button>
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Virtual Account ID or Account# or Reference#"
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg bg-gray-100 px-3 py-2.5">
          <span className="text-sm font-medium text-gray-500">Date</span>
          <select className="text-sm bg-transparent text-gray-400 focus:outline-none">
            <option>Select</option>
            <option>Today</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg bg-gray-100 px-3 py-2.5">
          <span className="text-sm font-medium text-gray-500">Status</span>
          <select className="text-sm bg-transparent text-gray-700 focus:outline-none">
            <option>All</option>
            <option>Active</option>
            <option>Closed</option>
          </select>
        </div>
        <div className="relative max-w-[180px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Customer ID"
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                Virtual Account ID
              </th>
              <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                Created on ↓
              </th>
              <th className="text-right font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                Amount
              </th>
              <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                Status
              </th>
              <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                Expiry date
              </th>
              <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                Description
              </th>
              <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                Reference
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((acc) => (
              <tr
                key={acc.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-blue-600 font-medium">
                  {acc.id}
                </td>
                <td className="px-6 py-4 text-gray-600">{acc.createdOn}</td>
                <td className="px-6 py-4 text-right text-gray-900">
                  ₹
                  {acc.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={acc.status} />
                </td>
                <td className="px-6 py-4 text-gray-600">{acc.expiryDate}</td>
                <td className="px-6 py-4 text-gray-600">
                  {acc.description}
                </td>
                <td className="px-6 py-4 text-gray-600">{acc.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateVirtualAccountModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}