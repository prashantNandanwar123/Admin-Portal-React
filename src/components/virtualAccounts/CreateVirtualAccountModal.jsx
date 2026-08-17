import { useState } from "react";
import { X } from "lucide-react";

export default function CreateVirtualAccountModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    accountName: "",
    amount: "",
    expiryDate: "",
    description: "",
    reference: "",
  });

  if (!isOpen) return null;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCreate = () => {
    // Wire this up to your create-account API call
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            New virtual account
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Account name
            </label>
            <input
              type="text"
              value={form.accountName}
              onChange={handleChange("accountName")}
              placeholder="Payment for Project 981"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                value={form.amount}
                onChange={handleChange("amount")}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Expiry date
            </label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={handleChange("expiryDate")}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Payment for RC Construction materials"
              rows={2}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reference
            </label>
            <input
              type="text"
              value={form.reference}
              onChange={handleChange("reference")}
              placeholder="PR21_INV301"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}