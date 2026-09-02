import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { QrCode } from "lucide-react";

export default function VPaymentType({
  refId,
  data,
  setData,
  errors,
  handleNext,
  handleBack
}) {
  const [apiData, setApiData] = useState({});

  useEffect(() => {
    if (!refId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `viewMerchantPaymentType/${refId}`
        );
        if (response?.respCode === 0) {
          const res = response?.respData;
          setApiData(res || {});
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [refId]);

  // Date formatter
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";


  return (
    <div className="m-1">
      <div>
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl sm:text-2xl uppercase text-blue-900 font-bold py-1">
              View Payment Type (UPI)
            </h2>
          </div>
          <p className="pb-4 text-sm text-blue-900 ml-14">
            Payment Type Form collects transaction method details for setup.
          </p>
        </div>

        {/* ── Payment Type card ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-5">
          {/* UPI header */}
          <div className="bg-blue-500 text-white px-4 py-3 rounded-lg mb-6">
            <h2 className="text-lg font-semibold">UPI</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">
            {/* Processor */}
            <div>
              <label className={labelClass}>
                Processor
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            {/* Acquirer */}
            <div>
              <label className={labelClass}>
                Acquirer
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            {/* Merchant Name */}
            <div>
              <label className={labelClass}>
                Merchant Name
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Effective Date
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Status
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Sort Order
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Per Transaction Limit
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Processor</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Acquirer</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Merchant Name</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Status</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Sort</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Limit</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Date</th>
                </tr>
              </thead>

              <tbody>
                <tr className="bg-white">
                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiProcessor || "-"}
                  </td>
                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiType || "-"}
                  </td>
                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiMerchant || "-"}
                  </td>
                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiStatus || "-"}
                  </td>

                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiSortOrder || "-"}
                  </td>

                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiPerTxnLimit || "-"}
                  </td>

                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {formatDate(apiData?.upiEffectiveDate) || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*BACK &  NEXT BUTTON */}
      <div className="flex justify-between items-center gap-4 mt-8 mb-10 sm:mb-15">
        <button
          type="button"
          onClick={handleBack}
          className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-5 py-2 rounded-lg shadow-sm transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
