import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";


export default function MerchantWebhook() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    mid: "",
    webhookUrl: "",
    type: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);
  // ─── Pagination Count ─────────────────────────────────────────────────────
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleSizeChange = (newSize) => {
    setSize(newSize);
    setPage(0);
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

  // Search
  const filteredData = data.filter((item) => {
    const search = searchTerm.trim().toLowerCase();
    return Object.values(item).some((field) =>
      String(field ?? "")
        .trim()
        .toLowerCase()
        .includes(search)
    )
  })

  const startIndex = page * size; // iT wil search the data
  const endIndex = startIndex + size; // it will apply the pagination
  const currentData = filteredData.slice(startIndex, endIndex); // and show the data in the table

  // ================= GET ALL WEBHOOK =================
  const fetchWebhookList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/webhook/all?page=${page}&size=${size}`
      );

      if (response.respCode === 0) {
        const list =
          response?.respData.data || []

        setData(list);
        setTotalPages(response?.respData?.totalPages || 0);
        setTotalRecords(response?.respData?.totalRecords || 0);
      }
      else {
        toast.error(response.respMsg);
      }
    } catch (error) {
      toast.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWebhookList();
  }, [page, size]);

  // ================= SAVE WEBHOOK =================
  const handleSaveWebhook = async () => {
    try {
      setLoading(true);

      const payload = {
        mid: formData.mid,
        webhookUrl: formData.webhookUrl,
        type: formData.type,
        createdBy: userData?.userName,
      };

      const response = await axiosInstance.post(
        "/webhook/save",
        payload
      );

      if (response?.respCode === 0) {
        toast.success(response.respMsg);
        setShowModal(false);
        setFormData({
          mid: "",
          webhookUrl: "",
          type: "",
        });

        fetchWebhookList();

      } else {
        toast.error(response.respMsg);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- UPDATE WEBHOOK --------------------
  const handleUpdateWebhook = async (item) => {
    try {
      setLoading(true);
      const payload = {
        mid: item.mid,
        webhookUrl: item.webhookUrl,
        type: item.type,
      };
      const resData = await axiosInstance.post(
        "/webhook/editWebhookUrl",
        payload
      );
      if (resData?.respCode === 0) {
        toast.success(resData.respMsg);
        fetchWebhookList();
      } else {
        toast.error(resData?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE WEBHOOK =================
  const handleDelete = async (mid, type) => {
    const confirmDelete = window.confirm("Are you sure want to delete?");
    if (!confirmDelete) return;
    try {
      setLoading(true);
      const payload = {
        mid: mid,
        type: type,
      };
      const response = await axiosInstance.post(
        `/webhook/delete`,
        payload
      );
      toast.success(response.respMsg);
      fetchWebhookList();
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE STATUS =================
  const handleStatusUpdate = async (mid, status) => {
    const confirmUpdate = window.confirm("Are you sure you want to update the status?");
    if (!confirmUpdate) return;
    try {
      setLoading(true);
      const payload = {
        mid,
        status,
      };
      console.log("Payload for status update:", payload); // Debugging line

      const response = await axiosInstance.post(
        "/webhook/updateWebhookStatus",
        payload
      );

      toast.success(response.respMsg);
      fetchWebhookList();
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-2xl font-medium text-[#1A2233]">
            Webhook Management
          </h1>
          <p className="pb-3 text-sm text-slate-800">
            Manage merchant webhook URLs and status.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#fec931] text-black px-5 py-3 rounded-lg shadow font-meduim">
          + Add Webhook
        </button>
      </div>

      {/* -------TABLE ------- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-8">
        <div className="w-full flex justify-end mb-4">
          <div className="w-full flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-600 font-medium">Show</span>
              <select
                value={size}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#fec931]">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-slate-600 font-medium">entries</span>
            </div>
            <div className="relative w-70">
              <FaSearch className="absolute top-4 left-3 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-slate-300 pl-10 pr-4 py-2 rounded-xl outline-none outline-none focus:ring-1 focus:ring-[#fec931]" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fec931] text-black uppercase border border-gray-300">
                <th className="px-4 py-2.5 text-center font-medium">MID</th>
                <th className="px-4 py-2.5 text-center font-medium">Webhook URL</th>
                <th className="px-4 py-2.5 text-left font-medium">Webhook Type</th>
                <th className="px-4 py-2.5 text-center font-medium">Status</th>
                <th className="px-4 py-2.5 text-center font-medium">Created At</th>
                <th className="px-4 py-2.5 text-center font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="h-10 w-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-3 text-gray-500">
                      Processing...
                    </p>
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={index}
                    className="border-b border border-gray-300">
                    {/* MID */}
                    <td className="px-4 py-4 font-semibold text-gray-700">
                      {item.mid}
                    </td>
                    {/* WEBHOOK URL */}
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={item.webhookUrl || ""}
                        onChange={(e) => {
                          const updated = [...data];
                          updated[index].webhookUrl =
                            e.target.value;
                          setData(updated);
                        }}
                        placeholder="Enter Webhook URL"
                        className="border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </td>
                    {/* TYPE */}
                    <td className="px-4 py-4 font-semibold text-gray-700">
                      {item.type}
                    </td>
                    {/* STATUS */}
                    <td className="px-4 py-4">
                      <select
                        value={item.status || ""}
                        onChange={(e) =>
                          handleStatusUpdate(
                            item.mid,
                            e.target.value
                          )
                        }
                        className="border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="Active">Active</option>
                        <option value="Deactive">Deactive</option>
                      </select>
                    </td>
                    {/* CREATED DATE */}
                    <td className="px-4 py-4 text-gray-700">
                      {item.createdAt}
                    </td>
                    {/* ACTION */}
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateWebhook(item)
                          }
                          className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs shadow">
                          <FaSave />
                          Update
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDelete(item.mid, item.type)
                          }
                          className="bg-red-700 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs shadow">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-gray-500">
                    No Webhook Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* ── Pagination ── */}
          {totalPages > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-5 py-3 ">
              <div className="text-sm text-gray-600">
                Showing page{" "}
                <span className="font-bold text-slate-900">{page + 1}</span>
                {" "}of{" "}
                <span className="font-bold text-slate-900">{totalPages}</span>
                {" "}|{" "}Total Records:{" "}
                <span className="font-bold text-slate-900">{totalRecords}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 transition"
                >
                  ← Prev
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded text-sm font-semibold transition ${p === page
                      ? "bg-[#fec931] text-black shadow"
                      : "border hover:bg-gray-100"
                      }`}
                  >
                    {p + 1}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 rounded border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 mx-8 lg:mx-0">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg border-t-2 border-black shadow-2xl">
            {/* TITLE */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-black mb-2 uppercase">
                Add Webhook URL
              </h1>
              <p className="text-sm text-yellow-500">
                Only one webhook URL can be added at a time
              </p>
            </div>

            <div className="border-b border-gray-200 mb-6"></div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                MID
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={15}
                value={formData.mid}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mid: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="Enter MID"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            {/* WEBHOOK URL */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="text"
                value={formData.webhookUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    webhookUrl: e.target.value,
                  })
                }
                placeholder="https://example.com/webhook"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-500 mb-2">
                Webhook Type
              </label>

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
               outline-none transition bg-white"
              >
                <option value="">Select Webhook Type</option>
                <option value="PAYIN">Payin</option>
                <option value="ONRAMP">OnRamp</option>
                <option value="OFFRAMP">OffRamp</option>
              </select>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveWebhook}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#fec931] text-black font-medium transition"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}