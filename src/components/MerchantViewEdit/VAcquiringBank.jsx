import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useLocation } from "react-router-dom";

export default function VRAcquiringBank({
  refId,
  data,
  setData,
  errors,
  handleNext,
  handleBack
}) {

  const location = useLocation();
  const [apiData, setApiData] = useState({});


  useEffect(() => {
    if (!refId) return;

    const fetchData = async () => {
      try {

        const response = await axiosInstance.post(
          `/viewMerchantAcquiringBank/${refId}`

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
        <h2 className="text-2xl uppercase text-blue-900 font-extrabold border-b border-gray-300 py-3">
          View Acquiring Bank Details
        </h2>
      </div>

      {/* ── Fee Setup ─────────────────────────────────────────────────── */}
      <div className="">
        <div className="pt-4">
          <h2 className="text-[18px] text-[#5c5c5c] mb-5">
            Fee Setup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-5">

            {[
              {
                label: "One Time Fixed Fee",
                value: apiData?.FS_OneTimeFixedFee,
              },
              {
                label: "Statement Fee",
                value: apiData?.FS_StatementFee,
              },
              {
                label: "Terminal Fee",
                value: apiData?.FS_TerminalFee,
              },
              {
                label: "Minimum Usage (in Days)",
                value: apiData?.FS_MiniUsageDays,
              },
              {
                label: "Minimum Transaction Amount",
                value: apiData?.FS_MiniTranAmount,
              },
              {
                label: "Minimum Usage Fee",
                value: apiData?.FS_MiniUsageFee,
              },
              {
                label: "AMC Amount",
                value: apiData?.FS_AMCAmount,
              },
              {
                label: "Non Usage (in Days)",
                value: apiData?.FS_NonUsageDays,
              },
              {
                label: "Non Usage Fee",
                value: apiData?.FS_NonUsageFee,
              },
            ].map(({ label, value }, index) => (
              <div key={index}>
                <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                  {label}
                </label>

                <input
                  type="text"
                  value={value || ""}
                  readOnly
                  className="w-full h-8 border border-gray-400 rounded-sm bg-gray-100 px-3 outline-none"
                />
              </div>
            ))}

            {/* AMC Type */}
            <div>
              <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                AMC Type
              </label>

              <input
                type="text"
                value={apiData?.FS_AMCType || ""}
                readOnly
                className="w-full h-8 border border-gray-400 rounded-sm bg-gray-100 px-3 outline-none"
              />
            </div>

          </div>
        </div>
      </div>

      {/* ── Settlement Setup ──────────────────────────────────────────── */}
      <div className="border-t border-gray-300 pt-4">
        <h2 className="text-[18px] text-[#5c5c5c] mb-5">
          Settlement Setup
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-7 gap-y-5">

          {/* Settlement Type */}
          <div>
            <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
              Settlement Type
            </label>

            <div className="flex items-center gap-5 mt-2">
              {["Manual", "Automatic"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-1 text-[14px] text-[#5c5c5c]"
                >
                  <input
                    type="radio"
                    checked={apiData?.SS_SettlementType === type}
                    readOnly
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Settlement Cycle */}
          <div>
            <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
              Settlement Cycle (If Automated)
            </label>

            <input
              type="text"
              value={apiData?.SS_SettlementCycle || ""}
              readOnly
              className="w-full h-8 border border-gray-400 rounded-sm bg-gray-100 px-3 outline-none"
            />
          </div>

          {/* Payment By */}
          <div>
            <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
              Payment By
            </label>

            <input
              type="text"
              value={apiData?.SS_PaymentBy || ""}
              readOnly
              className="w-full h-8 border border-gray-400 rounded-sm bg-gray-100 px-3 outline-none"
            />
          </div>

          {/* Payment Advice */}
          <div>
            <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
              Payment Advice
            </label>

            <input
              type="text"
              value={apiData?.SS_PaymentAdvice || ""}
              readOnly
              className="w-full h-8 border border-gray-400 rounded-sm bg-gray-100 px-3 outline-none"
            />
          </div>

        </div>
      </div>

      {/* ── Beneficiary Account Details ───────────────────────────────── */}
      <div className="border-t border-gray-300 pt-4 mt-5">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Beneficiary Account Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[
            {
              label: "Beneficiary Account Name",
              value: apiData?.BAD_BeneficiaryAccountName,
            },
            {
              label: "Beneficiary Account No",
              value: apiData?.BAD_BeneficiaryAccountNo,
            },
            {
              label: "Beneficiary Bank Code",
              value: apiData?.BAD_BeneficiaryBankCode,
            },
            {
              label: "Beneficiary Bank Name",
              value: apiData?.BAD_BeneficiaryBankName,
            },
            {
              label: "Beneficiary Branch Name",
              value: apiData?.BAD_BeneficiaryBranchName,
            },
            {
              label: "Beneficiary Branch Code",
              value: apiData?.BAD_BeneficiaryBranchCode,
            },
            {
              label: "IFSC Code",
              value: apiData?.BAD_IFSCCode,
            },
          ].map(({ label, value }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>

              <input
                type="text"
                value={value || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>
          ))}

        </div>
      </div>
      {/* ── Miscellaneous ─────────────────────────────────────────────── */}
      <div className="border-t border-gray-300 pt-4 mt-5">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Miscellaneous
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Text Inputs */}
          {[
            {
              label: "Daily Transaction Limit",
              value: apiData?.VPA_Mis_DailyTranLimit,
            },
            {
              label: "Per Transaction Limit",
              value: apiData?.misPerTransactionLimit,
            },
            {
              label: "Fuel Remark",
              value: apiData?.VPA_Mis_FuelRemark,
            },
            {
              label: "Call Charges",
              value: apiData?.VPA_Mis_CallCharges,
            },
            {
              label: "Secret Key",
              value: apiData?.VPA_Mis_SecretKey,
            },
            {
              label: "Merchant Reimbursement",
              value: apiData?.VPA_Mis_MerchantReimbursement,
            },
            {
              label: "Customer Id",
              value: apiData?.VPA_Mis_CustomerId,
            },
            {
              label: "VPA",
              value: apiData?.VPA_Mis_VPA,
            },
          ].map(({ label, value }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>

              <input
                type="text"
                value={value || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>
          ))}

          {/* Select Type Fields */}
          {[
            {
              label: "Daily Transaction Limit Status",
              value: apiData?.misTransactionLimitStatus,
            },
            {
              label: "Application Mode",
              value: apiData?.VPA_Mis_AppMode,
            },
            {
              label: "Per Transaction Limit Status",
              value: apiData?.misPerTransactionLimitStatus,
            },
            {
              label: "Transaction Mode",
              value: apiData?.VPA_Mis_TranMode,
            },
            {
              label: "FIRC Frequency",
              value: apiData?.VPA_Mis_FIRCFrequency,
            },
            {
              label: "Fuel Association",
              value: apiData?.VPA_Mis_FuelAssociation,
            },
          ].map(({ label, value }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>

              <input
                type="text"
                value={value || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>
          ))}

          {/* Radio Fields */}
          {[
            {
              label: "FIRC",
              field: "VPA_Mis_FIRC",
            },
            {
              label: "Document Required",
              field: "VPA_Mis_DocumentRequired",
            },
            {
              label: "Document Pending",
              field: "VPA_Mis_DocumentPending",
            },
          ].map(({ label, field }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>

              <div className="flex items-center gap-6 h-11">
                {["Yes", "No"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="radio"
                      checked={apiData?.[field] === opt}
                      readOnly
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

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