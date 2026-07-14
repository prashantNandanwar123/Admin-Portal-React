import React, { useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";


import {
  FaSearch,
  FaSave,
  FaEye,
  FaCopy,
} from "react-icons/fa";

export default function MerchantCredential() {
  const [mid, setMid] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);

  // ================= SEARCH API =================
  const handleSearch = async () => {
    if (!mid) {
      return;
    }

    try {
      setLoading(true);
      const resData = await axiosInstance.post(
        `/getMerchantCrediential/${mid}`
      );
      if (resData?.respCode === 0) {
        const formattedData = (resData?.respData || []).map((item) => ({
          merchantName: item[0],
          saltKey: item[1],
          secretKey: item[2],
          challanLink: item[3],
          ip: item[4],
          ipCheck: item[5],
          mid: item[6],
        }));
        setData(formattedData);
        setMid("");

      } else {
        setData([]);
        toast.error(resData?.respMsg);
        setMid("");
      }
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE API =================
  const handleUpdate = async (item) => {
    try {
      setLoading(true);
      const payload = {
        mid: item.mid,
        ip: item.ip || "",
        ipCheck: item.ipCheck || "",
      };

      const resData = await axiosInstance.post(
        "/updateMerchantCredential",
        payload
      );

      if (resData?.respCode === 0) {
        toast.success(resData?.respMsg);
        handleSearch();

      } else {
        toast.error(resData?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= COPY FUNCTION =================
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };


  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h2 className="text-4xl uppercase pb-3 text-blue-900 font-extrabold">
          Merchant Credential
        </h2>
        <p className="pb-3 text-lg text-blue-900">
          Manage merchant API credentials, secret keys, authentication details, and integration settings securely.
        </p>
      </div>
      {/* ================= SEARCH BOX ================= */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* MID */}
          <div className="w-full md:w-96">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Merchant MID
            </label>

            <input
              type="text"
              value={mid}
              onChange={(e) => setMid(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter MID"
              inputMode="numeric"
              maxLength={15} // Optional
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow"
          >
            <FaSearch />
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="mt-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="px-4 py-4 text-left">
                  Merchant Name
                </th>
                <th className="px-4 py-4 text-left">
                  MID
                </th>
                <th className="px-4 py-4 text-left">
                  Access Key
                </th>
                <th className="px-4 py-4 text-left">
                  Secret Key
                </th>
                <th className="px-4 py-4 text-left">
                  IP
                </th>
                <th className="px-4 py-4 text-left">
                  IP Check
                </th>
                <th className="px-4 py-4 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10"
                  >
                    <div className="flex justify-center">
                      <div className="h-10 w-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                    </div>

                    <p className="mt-3 text-gray-500">
                      Processing...
                    </p>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    {/* Merchant Name */}
                    <td className="px-4 py-4 font-semibold text-gray-700">
                      {item.merchantName || "-"}
                    </td>

                    {/* MID */}
                    <td className="px-4 py-4 text-gray-700">
                      {item.mid || "-"}
                    </td>

                    {/* Salt Key */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 break-all">
                          {item.saltKey || "-"}
                        </span>
                        <button
                          onClick={() =>
                            copyText(item.saltKey)
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </td>

                    {/* Secret Key */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 break-all">
                          {item.secretKey || "-"}
                        </span>

                        <button
                          onClick={() =>
                            copyText(item.secretKey)
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={item.ip || ""}
                        onChange={(e) => {
                          let value = e.target.value;

                          // Sirf digits aur dots allow
                          if (!/^[0-9.]*$/.test(value)) return;

                          // Ek octet me max 3 digits
                          const parts = value.split(".");
                          if (parts.some((part) => part.length > 3)) return;

                          // Max 4 octets allow
                          if (parts.length > 4) return;

                          const updated = [...data];
                          updated[index].ip = value;
                          setData(updated);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>

                    {/* IP Check */}
                    <td className="px-4 py-4">
                      <select
                        value={item.ipCheck || ""}
                        onChange={(e) => {
                          const updated = [...data];
                          updated[index].ipCheck =
                            e.target.value;
                          setData(updated);
                        }}
                        className="border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        {/* Update */}
                        <button
                          onClick={() =>
                            handleUpdate(item)
                          }
                          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs shadow"
                        >
                          <FaSave />
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-12 text-gray-500"
                  >
                    No Merchant Credential Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}