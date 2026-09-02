import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";

const initForm = {
  processor: "",
  acquirer: "",
  merchantName: "",
  effectiveDate: "",
  status: "",
  sortOrder: "",
  perTransactionLimit: "",
};

export default function EPaymentType({
  refId,
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
  const [merchantList, setMerchantList] = useState([]);

  useEffect(() => {
    if (!refId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `rMerchantPaymentType/${refId}`
        );

        // Adjust according to your API structure
        const res = response?.data || response;

        if (res?.respCode === 0) {
          const data = res?.respData || {};

          const formattedRow = {
            processor: data?.upiProcessor || "",
            acquirer: data?.upiType || "",
            merchantName: data?.upiMerchant || "",
            effectiveDate: data?.upiEffectiveDate || "",
            status: data?.upiStatus || "",
            sortOrder: data?.upiSortOrder || "",
            perTransactionLimit: data?.upiPerTxnLimit || "",
          };

          setData((prev) => ({
            ...prev,
            selectedAcquirer: data?.upiType,
          }));
          setTableData([formattedRow]);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [refId]);


  //  Auto hide Add error
  useEffect(() => {
    if (showAddError) {
      const timer = setTimeout(() => {
        setShowAddError(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAddError]);

  //  Auto hide Save error
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

  //  Add row
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

  //  Remove row
  const handleRemove = (indexToRemove) => {
    const updated = tableData.filter((_, i) => i !== indexToRemove);
    setTableData(updated);
  };

  //  Save API
  const saveEditPaymentType = async () => {
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
        "/saveEditPaymentType",
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

      } else {
        toast.error(response?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  //   const saveEditPaymentType = async () => {
  //   try {
  //     if (tableData.length === 0) {
  //       setShowSaveError(true);
  //       return;
  //     }

  //     setShowSaveError(false);

  //     // ✅ Multiple rows payload
  //     const payload = tableData.map((row) => ({
  //       ref_id: data?.refId,

  //       upiProcessor: row.processor,
  //       upiAcquirer: row.acquirer,
  //       upiType: activeTab,
  //       upiMerchant: row.merchantName,
  //       upiEffectiveDate: row.effectiveDate,
  //       upiStatus: row.status,
  //       upiSortOrder: row.sortOrder,
  //       upiPerTxnLimit: row.perTransactionLimit,
  //     }));

  //     console.log("FINAL PAYLOAD", payload);

  //     const response = await axiosInstance.post(
  //       "/saveEditPaymentType",
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const resData = response?.data || response;

  //     if (resData?.respCode === 0) {
  //       toast.success(resData?.respMsg || "Saved Successfully");

  //       setData((prev) => ({
  //         ...prev,
  //         refId: resData?.respData?.ref_id || prev.refId,
  //         selectedAcquirer: tableData[0]?.acquirer,
  //       }));

  //       handleNext();
  //     } else {
  //       toast.error(resData?.respMsg || "Save Failed");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong");
  //   }
  // };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white";

  const labelClass = "block text-sm text-gray-700 mb-1";

  const req = <span className="text-red-500">*</span>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
          <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
        </div>
        <h2 className="text-2xl uppercase text-blue-900 font-extrabold">
          Edit Payment Type Form (UPI)
        </h2>
      </div>
      <p className="ml-12 text-sm text-blue-900">
        Payment Type Form collects transaction method details for setup.
      </p>

      <div className="pt-2">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-8">
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

                  //  AUTO CALL API
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
                {merchantList.map((item, index) => (
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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-8">
          <div className="mt-2 flex justify-center">
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
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Back
          </button>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={saveEditPaymentType}
              className="bg-green-500 hover:bg-green-500 text-white px-6 py-2 rounded"
            >
              Update
            </button>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-2.5 rounded shadow-sm transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}