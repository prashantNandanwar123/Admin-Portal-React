import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";


const initForm = {
  processor: "",
  acquirer: "",
  merchantName: "",
  effectiveDate: "",
  status: "",
  sortOrder: "",
  perTransactionLimit: "",
};

export default function PaymentType({
  data,
  setData,
  handleNext,
  handleBack,
}) {
  const [activeTab] = useState("UPI");
  const [form, setForm] = useState(initForm);
  const [tableData, setTableData] = useState([]);

  const [showAddError, setShowAddError] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [acquirerList, setAcquirerList] = useState([]);
  const [merchantName, setMerchantList] = useState([]);


  // ✅ Auto hide Add error
  useEffect(() => {
    if (showAddError) {
      const timer = setTimeout(() => {
        setShowAddError(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAddError]);

  // ✅ Auto hide Save error
  useEffect(() => {
    if (showSaveError) {
      const timer = setTimeout(() => {
        setShowSaveError(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSaveError]);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    fetchAcquirer();
  }, []);

  const fetchAcquirer = async () => {
    try {
      const response = await axiosInstance.post("/fetchAquringBank");
      const apiData =
        response?.respData || response?.respData || {};
      setAcquirerList(apiData?.upiName || []);

    }

    catch (error) {
      console.error(
        "[BasicDetails] fetchDetailsCollection → API Error:",
        error
      );
    }
  };

  const fetchMerchantName = async (AcqBankName) => {
    try {
      const response = await axiosInstance.post(
        `/getMSFUpiMerchantName/${AcqBankName}`
      );

      const apiData =
        response?.respData || response?.respData || {};
      setMerchantList(apiData?.merchantList || []);
    } catch (error) {
      console.error(error);
      setMerchantList([]);
    }
  };


  // ✅ Add row
  const handleAdd = () => {
    if (
      !form.processor ||
      !form.acquirer ||
      !form.merchantName ||
      !form.effectiveDate ||
      !form.status ||
      !form.sortOrder ||
      !form.perTransactionLimit
    ) {
      setShowAddError(true);
      return;
    }

    setShowAddError(false);
    setShowSaveError(false);

    setTableData((prev) => [...prev, form]);
    setForm(initForm);
  };

  // ✅ Remove row
  const handleRemove = (indexToRemove) => {
    const updated = tableData.filter((_, i) => i !== indexToRemove);
    setTableData(updated);
  };

  // ✅ Save API
  const savePaymentType = async () => {
    try {
      if (tableData.length === 0) {
        setShowSaveError(true);
        return;
      }

      setShowSaveError(false);

      const firstRow = tableData[0];

      const payload = {
        ref_id: data?.refId,
        upiProcessor: firstRow.processor,
        upiType: firstRow.acquirer,
        upiMerchant: firstRow.merchantName,
        upiEffectiveDate: firstRow.effectiveDate,
        upiStatus: firstRow.status,
        upiSortOrder: firstRow.sortOrder,
        upiPerTxnLimit: firstRow.perTransactionLimit,
      };

      const response = await axiosInstance.post(
        "/savePaymentType",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = response;
      if (resData?.respCode === 0) {
        toast.success(response?.respMsg);
        setData((prev) => ({
          ...prev,
          refId: resData?.respData?.ref_id || prev.refId,
          selectedAcquirer: tableData[0]?.acquirer,
        }));

        handleNext();
      } else {
        toast.error(response?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white";

  const labelClass = "block text-sm text-gray-700 mb-1";

  const req = <span className="text-red-500">*</span>;

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl uppercase pb-2 text-blue-900 font-extrabold">
        Payment Type Form (UPI)
      </h2>
      <p className="pb-4 border-b border-gray-300 text-sm text-blue-900">
        Payment Type Form collects transaction method details for setup.
      </p>

      <div className="py-6">
        {/* UPI header */}
        <div className="bg-blue-500 text-white px-4 py-3 rounded-md mb-6">
          <h2 className="text-lg font-semibold">UPI</h2>
        </div>
        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Processor {req}</label>
            <select
              className={inputClass}
              value={form.processor}
              onChange={(e) => updateField("processor", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="TP">Payments Solutions</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Acquirer </label>
            <select
              className={inputClass}
              value={form.acquirer}
              onChange={(e) => {
                const value = e.target.value;

                updateField("acquirer", value);

                // ✅ AUTO CALL API
                fetchMerchantName(value);

                // optional reset
                updateField("merchantName", "");
              }}
            >
              <option value="">-- Select --</option>
              {acquirerList.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Merchant Name {req}</label>
            <select
              className={inputClass}
              value={form.merchantName}
              onChange={(e) => updateField("merchantName", e.target.value)}
            >
              <option value="">-- Select --</option>
              {merchantName.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Effective Date {req}</label>
            <input
              type="date"
              className={inputClass}
              value={form.effectiveDate}
              onChange={(e) => updateField("effectiveDate", e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Status {req}</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Active">Active</option>
              <option value="Deactive">Deactive</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Sort Order {req}</label>
            <input
              className={inputClass}
              value={form.sortOrder}
              maxLength={10}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  updateField("sortOrder", e.target.value);
                }
              }}
            />
          </div>

          <div>
            <label className={labelClass}>Per Transaction Limit {req}</label>
            <input
              className={inputClass}
              value={form.perTransactionLimit}
              maxLength={7}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  updateField("perTransactionLimit", e.target.value);
                }
              }}
            />
          </div>
        </div>
        {/* ADD ERROR */}
        {showAddError && (
          <div className="flex justify-center mb-4 mt-5 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded text-sm">
            <div className="text-center w-fit">
              Please fill the missing details in the above fields
              <br />
              --- OR ---
              <br />
              Fill in the correct details
            </div>
          </div>
        )}
        {/* Add Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Add NEW UPI
          </button>
        </div>

        {/* TABLE ERROR */}
        {showSaveError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4 text-sm">
            Please add a row | Fill the mandatory fields
          </div>
        )}

        {/* Table */}
        {tableData.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Processor</th>
                  <th className="border p-2">Acquirer</th>
                  <th className="border p-2">Merchant</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Sort</th>
                  <th className="border p-2">Limit</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{item.processor}</td>
                    <td className="border p-2">{item.acquirer}</td>
                    <td className="border p-2">{item.merchantName}</td>
                    <td className="border p-2">{item.status}</td>
                    <td className="border p-2">{item.sortOrder}</td>
                    <td className="border p-2">{item.perTransactionLimit}</td>
                    <td className="border p-2">{item.effectiveDate}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleRemove(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Back
          </button>

          <button
            onClick={savePaymentType}
            className="bg-orange-500 text-white px-6 py-2 rounded"
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
}