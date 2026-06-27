import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

export default function PMSFFee({
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
          `rMerchantMsfConvenience/${refId}`

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

  return (
    <>

      <div>
        <h2 className="text-[20px] font-bold text-lg text-gray-700 mb-6 border-b border-gray-300 pb-3">
          MSF / Convenience Fee
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Processor */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Acquirer Bank
            </label>

            <input
              type="text"
              value={apiData?.upiAcquirerBankName || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Acquirer */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Processor MID
            </label>

            <input
              type="text"
              value={apiData?.upiMID || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Merchant Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Slab Upto
            </label>

            <input
              type="text"
              value={apiData?.upiSlabUpto || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Effective From
            </label>

            <input
              type="text"
              value={apiData?.upiEffectiveFrom || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Effective To
            </label>

            <input
              type="text"
              value={apiData?.upiEffectiveTo || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              International Fixed
            </label>

            <input
              type="text"
              value={apiData?.upiInternationalFixed || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              International Per
            </label>

            <input
              type="text"
              value={apiData?.upiInternationalPer || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Domestic Onus Fixed
            </label>

            <input
              type="text"
              value={apiData?.upiDomesticOnusFixed || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Domestic Onus Per
            </label>

            <input
              type="text"
              value={apiData?.upiDomesticOnusper || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Domestic Offus Fixed
            </label>

            <input
              type="text"
              value={apiData?.upiDomesticOffusFixed || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Domestic Offus Per
            </label>

            <input
              type="text"
              value={apiData?.upiDomesticOffusper || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Charge Type
            </label>

            <input
              type="text"
              value={apiData?.upiChargeType || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Enter GST in Percentage
            </label>

            <input
              type="text"
              value={apiData?.upiGstper || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Fee Type
            </label>

            <input
              type="text"
              value={apiData?.upiFeeType || ""}
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
              value={apiData?.upiStatus || ""}
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
              value={apiData?.upiSortOrder || ""}
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
              value={apiData?.upiPerTxnLimit || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

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