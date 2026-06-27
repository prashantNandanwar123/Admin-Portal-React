import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Menu } from "lucide-react";


export default function PChecklist({
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
          `rMerchantChecklist/${refId}`

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
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-300  px-4 py-3">
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-slate-600 text-white">
            <Menu size={12} />
          </div>
          <h1 className="text-[22px] font-bold uppercase tracking-wide text-[#1d5d9b]">
            Check List
          </h1>
        </div>

        <div className="p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-gray-800">
            Check List
          </h2>

          {/* Top Form */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Column 1 */}
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  Name of the Merchant
                </label>
                <input
                  type="text"
                  value={apiData?.CL_NameOfTheMerchant || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  Existing / New Relationship
                </label>
                <input
                  type="text"
                  value={apiData?.CL_ExistingNewRelationship || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  Cross Border Transactions
                </label>
                <input
                  type="text"
                  value={apiData?.CL_CrossBorderTransactions || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  Secured Cross Border Limit
                </label>
                <input
                  type="text"
                  value={apiData?.CL_SecuredCrossBorderLimit || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

            </div>

            {/* Column 2 */}
            <div className="space-y-5">

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  value={apiData?.CL_Address || ""}
                  readOnly
                  className="h-9 w-full resize-none rounded-sm border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  Payment Hold Over
                </label>
                <input
                  type="text"
                  value={apiData?.CL_PaymentHoldOver || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  3D Secure
                </label>
                <input
                  type="text"
                  value={apiData?.CL_3DSecure || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  Unsecured Transactions Limit
                </label>
                <input
                  type="text"
                  value={apiData?.CL_UnsecuredTransactionsLimit || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

            </div>

            {/* Column 3 */}
            <div className="space-y-5">

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  Merchant Business Type
                </label>
                <input
                  type="text"
                  value={apiData?.CL_MerchantBusinessType || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  MSF
                </label>
                <input
                  type="text"
                  value={apiData?.CL_MSF || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  Domestic User Transaction Limits
                </label>
                <input
                  type="text"
                  value={apiData?.CL_DomesticUserTransactionLimits || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-700">
                  Charge Banks Recover
                </label>
                <input
                  type="text"
                  value={apiData?.CL_ChargeBanksRecover || ""}
                  readOnly
                  className="h-9 w-full rounded-sm border border-gray-300 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

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
      </div>
    </>




  );
}