import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

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
        console.log("API RESPONSE:", response);

        if (response?.respCode === 0) {
          const res = response?.respData;
          setApiData(res || {});
        }

      } catch (err) {
        console.error("API ERROR:", err);
      }
    };

    fetchData();
  }, [refId]);
  // Date formatter
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <>

      <div>
        {/* Header */}
        <div className="border-b border-gray-300">
          <h2 className="text-2xl uppercase text-blue-900 font-extrabold py-1">
            View Payment Type (UPI)
          </h2>
          <p className="py-4 text-sm text-blue-900">
            Payment Type Form collects transaction method details for setup.
          </p>
        </div>

        {/* UPI header */}
        <div className="bg-blue-500 text-white px-4 py-3 rounded-md mb-6 mt-5">
          <h2 className="text-lg font-semibold">UPI</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Processor */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Processor
            </label>

            <input
              type="text"
              value=""
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Acquirer */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Acquirer
            </label>

            <input
              type="text"
              value=""
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Merchant Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Merchant Name
            </label>

            <input
              type="text"
              value=""
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Effective Date
            </label>

            <input
              type="text"
              value=""
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Status
            </label>

            <input
              type="text"
              value=""
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Sort Order
            </label>

            <input
              type="text"
              value=""
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Per Transaction Limit
            </label>

            <input
              type="text"
              value=""
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

        </div>
        {/* TABLE SECTION */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Processor</th>
                <th className="border p-2">Acquirer</th>
                <th className="border p-2">Merchant Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Sort</th>
                <th className="border p-2">Limit</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-2">
                  {apiData?.upiProcessor || "-"}
                </td>

                <td className="border p-2">
                  {apiData?.upiType || "-"}
                </td>

                <td className="border p-2">
                  {apiData?.upiMerchant || "-"}
                </td>

                <td className="border p-2">
                  {apiData?.upiStatus || "-"}
                </td>

                <td className="border p-2">
                  {apiData?.upiSortOrder || "-"}
                </td>

                <td className="border p-2">
                  {apiData?.upiPerTxnLimit || "-"}
                </td>

                <td className="border p-2">
                  {formatDate(apiData?.upiEffectiveDate) || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      {/*BACK &  NEXT BUTTON */}
      <div className="flex gap-4 mt-10 d-flex justify-between align-items-center">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-500 text-white px-6 py-2 rounded"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="bg-orange-500 text-white px-6 py-2 rounded"
        >
          Next
        </button>
      </div>
    </>


  );
}