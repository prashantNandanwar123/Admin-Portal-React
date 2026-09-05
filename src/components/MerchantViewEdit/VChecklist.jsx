import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { FileCheck2, ClipboardList, ListChecks } from "lucide-react";



export default function VChecklist({
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
          `viewMerchantChecklist/${refId}`
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

  const inputClass =
    "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[14px] text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
  const labelClass =
    "mb-1 block text-[15px] font-medium text-gray-700";


  return (
    <div className="m-2">
      {/* Header */}
      <div className="pr-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-700" />
          </div>
          <h2 className="text-xl sm:text-2xl uppercase text-blue-900 font-bold">
            View Check List
          </h2>
        </div>
        <p className="text-sm text-blue-900 ml-12 sm:ml-14">
          Review the merchant's underwriting and compliance checklist along with document verification status.
        </p>
      </div>

      <div className="pt-5">
        {/* Top Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <ClipboardList className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <h2 className="text-lg sm:text-[20px] font-light text-gray-800 uppercase">
              Check List
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Column 1 */}
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Name of the Merchant
                </label>

                <input
                  type="text"
                  value={apiData?.CL_NameOfTheMerchant || ""}
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>

              {/* Existing/New Relationship */}
              <div>
                <label className={labelClass}>
                  Existing / New Relationship
                </label>

                <div className="flex h-10 items-center gap-5 text-[14px]">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="relationship"
                      value="Existing"
                      checked={apiData?.CL_ExistingNewRelationship === "Existing"}
                      readOnly
                    />
                    Existing
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="relationship"
                      value="New Relationship"
                      checked={apiData?.CL_ExistingNewRelationship === "New Relationship"}
                      readOnly
                    />
                    New Relationship
                  </label>
                </div>
              </div>

              {/* Cross Border */}
              <div>
                <label className={labelClass}>
                  Cross Border Transactions
                </label>

                <div className="flex h-10 items-center gap-5 text-[14px]">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="crossborder"
                      value="Yes"
                      checked={apiData?.CL_CrossBorderTransactions === "Yes"}
                      readOnly
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="crossborder"
                      value="No"
                      checked={apiData?.CL_CrossBorderTransactions === "No"}
                      readOnly
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Secured Cross Border */}
              <div>
                <label className={labelClass}>
                  Secured Cross Border Limit
                </label>
                <input
                  type="text"
                  value={apiData?.CL_SecuredCrossBorderLimit || ""}
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-5">
              {/* Address */}
              <div>
                <label className={labelClass}>
                  Address
                </label>
                <input
                  type="text"
                  value={apiData?.CL_Address || ""}
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>
              {/* Payment Hold */}
              <div>
                <label className={labelClass}>
                  Payment Hold Over
                </label>

                <div className="flex h-10 items-center gap-5 text-[14px]">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymenthold"
                      value="Yes"
                      checked={apiData?.CL_PaymentHoldOver === "Yes"}
                      readOnly
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymenthold"
                      value="No"
                      checked={apiData?.CL_PaymentHoldOver === "No"}
                      readOnly
                    />
                    No
                  </label>
                </div>
              </div>

              {/* 3D Secure */}
              <div>
                <label className={labelClass}>
                  3D Secure
                </label>

                <div className="flex h-10 items-center gap-5 text-[14px]">

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="secure3d"
                      value="Yes"
                      checked={apiData?.CL_3DSecure === "Yes"}
                      readOnly
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="secure3d"
                      value="No"
                      checked={apiData?.CL_3DSecure === "No"}
                      readOnly
                    />
                    No
                  </label>

                </div>
              </div>

              {/* Unsecured Transaction */}
              <div>
                <label className={labelClass}>
                  Unsecured Transactions Limit
                </label>

                <input
                  type="text"
                  value={apiData?.CL_UnsecuredTransactionsLimit || ""}
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Merchant Business Type
                </label>

                <select
                  className={`${inputClass} bg-gray-100`}
                  value={apiData?.CL_MerchantBusinessType || ""}
                  disabled
                >
                  <option value="">-- Select --</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Cable">Cable</option>
                  <option value="Gov">Gov</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>

              {/* MSF */}
              <div>
                <label className={labelClass}>
                  MSF <span className="text-red-600">*</span>
                </label>

                <div className="flex h-10 items-center gap-5 text-[14px]">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="msf"
                      value="Yes"
                      checked={apiData?.CL_MSF === "Yes"}
                      readOnly
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="msf"
                      value="No"
                      checked={apiData?.CL_MSF === "No"}
                      readOnly
                    />
                    No
                  </label>

                </div>
              </div>

              {/* Domestic User Limit */}
              <div>
                <label className={labelClass}>
                  Domestic User Transaction Limits
                </label>

                <input
                  type="text"
                  value={apiData?.CL_DomesticUserTransactionLimits || ""}
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>

              {/* Charge Banks Recover */}
              <div>
                <label className={labelClass}>
                  Charge Banks Recover
                </label>

                <div className="flex h-10 items-center gap-5 text-[14px]">

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="recover"
                      value="Instant"
                      checked={apiData?.CL_ChargeBanksRecover === "Instant"}
                      readOnly
                    />
                    Instant
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="recover"
                      value="Crystallization"
                      checked={apiData?.CL_ChargeBanksRecover === "Crystallization"}
                      readOnly
                    />
                    Crystallization
                  </label>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Title */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-6">
          <div className="flex items-center gap-3 my-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
              <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg sm:text-[21px] font-light text-gray-800">
              Merchant Check List
            </h2>
          </div>
          <p className="text-sm text-gray-500 -mt-2 mb-4 ml-11 sm:ml-12">
            Verification checklist items with status and remarks captured during merchant onboarding review.
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full  border-collapse">
              <thead>
                <tr className="border-y border-gray-200 bg-[#fafafa]">
                  <th className="px-2 py-2 text-left text-[15px] font-bold text-gray-700">
                    Item
                  </th>
                  <th className="w-[170px] px-2 py-2 text-left text-[15px] font-bold text-gray-700">
                    Status
                  </th>
                  <th className="w-[320px] px-2 py-2 text-left text-[15px] font-bold text-gray-700">
                    Results / Remarks
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* ROW 1 */}
                <tr className="border-b border-gray-200">
                  <td className="px-2 py-2 text-[15px]">
                    Valid Gov. / Tax Registration, Financial Statement Submitted and verified
                  </td>

                  <td className="px-2 py-2">
                    <div className="flex gap-3 text-[15px]">

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="vgtStatus"
                          value="Yes"
                          checked={apiData?.mcl_VGTRegistration_Status === "Yes"}
                          readOnly
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="vgtStatus"
                          value="No"
                          checked={apiData?.mcl_VGTRegistration_Status === "No"}
                          readOnly
                        />
                        No
                      </label>

                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={apiData?.mcl_VGTRegistration_ReSult || ""}
                      readOnly
                      className="h-6 w-full border border-gray-400 bg-gray-100 px-2 text-xs outline-none"
                    />
                  </td>
                </tr>
                {/* ROW 2 */}
                <tr className="border-b border-gray-200">
                  <td className="px-2 py-2 text-[15px]">
                    Website checks completed
                  </td>

                  <td className="px-2 py-2">
                    <div className="flex gap-3 text-[15px]">

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="wcStatus"
                          value="Yes"
                          checked={apiData?.mcl_WCCompleted_Status === "Yes"}
                          readOnly
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="wcStatus"
                          value="No"
                          checked={apiData?.mcl_WCCompleted_Status === "No"}
                          readOnly
                        />
                        No
                      </label>

                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={apiData?.mcl_WCCompleted_Result || ""}
                      readOnly
                      className="h-6 w-full border border-gray-400 bg-gray-100 px-2 text-xs outline-none"
                    />
                  </td>
                </tr>
                {/* ROW 3 */}
                <tr className="border-b border-gray-200">
                  <td className="px-2 py-2 text-[15px]">
                    Merchant ration / underwriting *
                  </td>

                  <td className="px-2 py-2">
                    <div className="flex gap-3 text-[15px]">

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="underwritingStatus"
                          value="Yes"
                          checked={apiData?.mcl_MRUnderwriting_Status === "Yes"}
                          readOnly
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="underwritingStatus"
                          value="No"
                          checked={apiData?.mcl_MRUnderwriting_Status === "No"}
                          readOnly
                        />
                        No
                      </label>

                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={apiData?.mcl_MRUnderwriting_Result || ""}
                      readOnly
                      className="h-6 w-full border border-gray-400 bg-gray-100 px-2 text-xs outline-none"
                    />
                  </td>
                </tr>
                {/* ROW 4 */}
                <tr className="border-b border-gray-200">
                  <td className="px-2 py-2 text-[15px]">
                    Site inspection completed *
                  </td>

                  <td className="px-2 py-2">
                    <div className="flex gap-3 text-[15px]">

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="inspectionStatus"
                          value="Yes"
                          checked={apiData?.mcl_SInspectionCompleted_Status === "Yes"}
                          readOnly
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="inspectionStatus"
                          value="No"
                          checked={apiData?.mcl_SInspectionCompleted_Status === "No"}
                          readOnly
                        />
                        No
                      </label>

                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={apiData?.mcl_SInspectionCompleted_Result || ""}
                      readOnly
                      className="h-6 w-full border border-gray-400 bg-gray-100 px-2 text-xs outline-none"
                    />
                  </td>
                </tr>
                {/* ROW 5 */}
                <tr className="border-b border-gray-200">
                  <td className="px-2 py-2 text-[15px]">
                    Business approvals *
                  </td>

                  <td className="px-2 py-2">
                    <div className="flex gap-3 text-[15px]">

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="approvalsStatus"
                          value="Yes"
                          checked={apiData?.mcl_BApprovals_Status === "Yes"}
                          readOnly
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="approvalsStatus"
                          value="No"
                          checked={apiData?.mcl_BApprovals_Status === "No"}
                          readOnly
                        />
                        No
                      </label>

                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={apiData?.mcl_BApprovals_Result || ""}
                      readOnly
                      className="h-6 w-full border border-gray-400 bg-gray-100 px-2 text-xs outline-none"
                    />
                  </td>
                </tr>
                {/* ROW 6 */}
                <tr className="border-b border-gray-200">
                  <td className="px-2 py-2 text-[15px]">
                    MATCH / VMTS / CIBIL Checks *
                  </td>

                  <td className="px-2 py-2">
                    <div className="flex gap-3 text-[15px]">

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="mvcStatus"
                          value="Yes"
                          checked={apiData?.mcl_MVCChecks_Status === "Yes"}
                          readOnly
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="mvcStatus"
                          value="No"
                          checked={apiData?.mcl_MVCChecks_Status === "No"}
                          readOnly
                        />
                        No
                      </label>

                    </div>
                  </td>

                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={apiData?.mcl_MVCChecks_result || ""}
                      readOnly
                      className="h-6 w-full border border-gray-400 bg-gray-100 px-2 text-xs outline-none"
                    />
                  </td>
                </tr>
                {/* ROW 7 */}
                <tr className="border-b border-gray-200">
                  <td className="px-2 py-2 text-[15px]">
                    KYC documents verified and confirmed *
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex gap-3 text-[15px]">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="kycStatus"
                          value="Yes"
                          checked={apiData?.mcl_KYCConfirmed_Status === "Yes"}
                          readOnly
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="kycStatus"
                          value="No"
                          checked={apiData?.mcl_KYCConfirmed_Status === "No"}
                          readOnly
                        />
                        No
                      </label>

                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={apiData?.mcl_KYCConfirmed_Result || ""}
                      readOnly
                      className="h-6 w-full border border-gray-400 bg-gray-100 px-2 text-xs outline-none"
                    />
                  </td>
                </tr>                
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*BACK &  NEXT BUTTON */}
      <div className="flex gap-4 mt-10 justify-between items-center">
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
            className="inline-flex items-center gap-2 bg-amber-400  text-gray-900 font-semibold px-5 py-2 rounded-lg shadow-sm transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}