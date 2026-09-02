import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { CircleDollarSign, Landmark, WalletCards, MoreHorizontal, Settings2 } from "lucide-react";

export default function ERAcquiringBank({
  refId,
  data,
  setData,
  errors,
  handleNext,
  handleBack
}) {

  const location = useLocation();

  useEffect(() => {
    if (!refId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `/rMerchantAcquiringBank/${refId}`
        );
        if (response?.respCode === 0) {
          const res = response?.respData || {};
          // IMPORTANT
          setData((prev) => ({
            ...prev,
            ...res,

            refId:
              res?.ref_id ||
              res?.refId ||
              refId,
          }));
        }
      } catch (error) {
        toast.error(error);
      }
    };

    fetchData();
  }, [refId]);

  // COMMON HANDLE CHANGE
  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAndNext = async () => {
    try {

      const payload = {
        ref_id: data?.refId || refId,

        FS_OneTimeFixedFee: data?.FS_OneTimeFixedFee,
        FS_StatementFee: data?.FS_StatementFee,
        FS_TerminalFee: data?.FS_TerminalFee,
        FS_MiniUsageDays: data?.FS_MiniUsageDays,
        FS_MiniTranAmount: data?.FS_MiniTranAmount,
        FS_MiniUsageFee: data?.FS_MiniUsageFee,

        FS_AMCType: data?.FS_AMCType,
        FS_AMCAmount: data?.FS_AMCAmount,
        FS_NonUsageDays: data?.FS_NonUsageDays,
        FS_NonUsageFee: data?.FS_NonUsageFee,
        SS_SettlementType: data?.SS_SettlementType,
        SS_SettlementCycle: data?.SS_SettlementCycle,

        SS_PaymentBy: data?.SS_PaymentBy,
        SS_PaymentAdvice: data?.SS_PaymentAdvice,
        BAD_BeneficiaryAccountName: data?.BAD_BeneficiaryAccountName,
        BAD_BeneficiaryAccountNo: data?.BAD_BeneficiaryAccountNo,
        BAD_BeneficiaryBankCode: data?.BAD_BeneficiaryBankCode,
        BAD_BeneficiaryBankName: data?.BAD_BeneficiaryBankName,
        BAD_BeneficiaryBranchName: data?.BAD_BeneficiaryBranchName,
        BAD_BeneficiaryBranchCode: data?.BAD_BeneficiaryBranchCode,
        BAD_IFSCCode: data?.BAD_IFSCCode,

        // Miscellaneous
        misTransactionLimit: data?.misTransactionLimit,
        misTransactionLimitStatus: data?.misTransactionLimitStatus,
        VPA_Mis_AppMode: data?.VPA_Mis_AppMode,
        misPerTransactionLimit: data?.misPerTransactionLimit,
        misPerTransactionLimitStatus: data?.misPerTransactionLimitStatus,

        VPA_Mis_TranMode: data?.VPA_Mis_TranMode,
        VPA_Mis_FIRC: data?.VPA_Mis_FIRC,
        VPA_Mis_FIRCFrequency: data?.VPA_Mis_FIRCFrequency,
        VPA_Mis_FuelAssociation: data?.VPA_Mis_FuelAssociation,
        VPA_Mis_FuelRemark: data?.VPA_Mis_FuelRemark,
        VPA_Mis_CallCharges: data?.VPA_Mis_CallCharges,
        VPA_Mis_SecretKey: data?.VPA_Mis_SecretKey,
        VPA_Mis_DocumentRequired: data?.VPA_Mis_DocumentRequired,
        VPA_Mis_DocumentPending: data?.VPA_Mis_DocumentPending,
        VPA_Mis_MerchantReimbursement: data?.VPA_Mis_MerchantReimbursement,
        VPA_Mis_CustomerId: data?.VPA_Mis_CustomerId,
        VPA_Mis_VPA: data?.VPA_Mis_VPA,

      };

      const response = await axiosInstance.post("/saveEditMeAcquiringBank", payload);
      if (response?.respCode === 0) {
        toast.success(response?.respMsg);
        setData((prev) => ({
          ...prev,
          refId: response?.respData?.ref_id,
        }));

      } else {
        toast.error(response?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5 text-yellow-700" />
            </div>
            <h2 className="text-2xl uppercase text-blue-900 font-bold py-2">
              Edited Acquiring Bank Setup Details
            </h2>
          </div>
        </div>
        <p className="text-sm ml-12 text-blue-900 leading-relaxed font-noraml pb-3">
          Configure and manage all essential merchant acquiring bank information including
          settlement details, transaction settings for secure and
          seamless banking operations.
        </p>
      </div>

      {/* ── Fee Setup ─────────────────────────────────────────────────── */}
      <div className="py-5 bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
              <CircleDollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-700">
              Fee Setup
            </h2>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-5">
          {[
            {
              label: "One Time Fixed Fee",
              field: "FS_OneTimeFixedFee",
            },
            {
              label: "Statement Fee",
              field: "FS_StatementFee",
            },
            {
              label: "Terminal Fee",
              field: "FS_TerminalFee",
            },
            {
              label: "Minimum Usage (in Days)",
              field: "FS_MiniUsageDays",
            },
            {
              label: "Minimum Transaction Amount",
              field: "FS_MiniTranAmount",
            },
            {
              label: "Minimum Usage Fee",
              field: "FS_MiniUsageFee",
            },
            {
              label: "AMC Amount",
              field: "FS_AMCAmount",
            },
            {
              label: "Non Usage (in Days)",
              field: "FS_NonUsageDays",
            },
            {
              label: "Non Usage Fee",
              field: "FS_NonUsageFee",
            },
          ].map(({ label, field }, index) => (
            <div key={index}>
              <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                {label}
              </label>

              <input
                type="text"
                value={data?.[field] || ""}
                onChange={(e) =>
                  handleChange(field, e.target.value)
                }
                className="w-full h-8 border border-gray-400 rounded-sm px-3 outline-none"
              />
            </div>
          ))}

          {/* AMC Type */}
          <div>
            <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
              AMC Type
            </label>
            <select
              type="text"
              value={data?.FS_AMCType || ""}
              onChange={(e) =>
                handleChange("FS_AMCType", e.target.value)
              }
              className="w-full h-8 border border-gray-400 rounded-sm px-3 outline-none"
            >

              <option value="">-- Select --</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
        </div>

      </div>

      {/* ── Settlement Setup ──────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-8 pt-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-xl  font-medium text-gray-700">
            Settlement Setup
          </h2>
        </div>
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
                    checked={data?.SS_SettlementType === type}
                    onChange={() =>
                      handleChange("SS_SettlementType", type)
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {[
            {
              label: "Settlement Cycle (If Automated)",
              field: "SS_SettlementCycle",
              options: ["Daily", "Daily Twice", "Two Days Once", "Weekly"],
            },
            {
              label: "Payment By",
              field: "SS_PaymentBy",
              options: ["A/C Credit", "IMPS", "NEFT", "RTGS"],
            },
            {
              label: "Payment Advice",
              field: "SS_PaymentAdvice",
              options: ["Daily", "Monthly", "Weekly"],
            },
          ].map((item, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                {item.label}
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-[14px]"
                value={data?.[item.field] || ""}
                onChange={(e) => handleChange(item.field, e.target.value)}
              >
                <option value="">Select {item.label}</option>
                {item.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* ── Beneficiary Account Details ───────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-8 pt-4 mt-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
            <WalletCards className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-xl font-medium text-gray-700">
            Beneficiary Account Details
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Beneficiary Account Name",
              field: "BAD_BeneficiaryAccountName",
            },
            {
              label: "Beneficiary Account No",
              field: "BAD_BeneficiaryAccountNo",
            },
            {
              label: "Beneficiary Bank Code",
              field: "BAD_BeneficiaryBankCode",
            },
            {
              label: "Beneficiary Bank Name",
              field: "BAD_BeneficiaryBankName",
            },
            {
              label: "Beneficiary Branch Name",
              field: "BAD_BeneficiaryBranchName",
            },
            {
              label: "Beneficiary Branch Code",
              field: "BAD_BeneficiaryBranchCode",
            },
            {
              label: "IFSC Code",
              field: "BAD_IFSCCode",
            },
          ].map(({ label, field }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>

              <input
                type="text"
                value={data?.[field] || ""}
                onChange={(e) =>
                  handleChange(field, e.target.value)
                }
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
      {/* ── Miscellaneous ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-8 pt-4 mt-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-yellow-600" />
          </div>

          <h2 className="text-xl font-medium text-gray-700">
            Miscellaneous
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Text Inputs */}
          {[
            {
              label: "Daily Transaction Limit",
              field: "misTransactionLimit",
            },
            {
              label: "Per Transaction Limit",
              field: "misPerTransactionLimit",
            },
            {
              label: "Fuel Remark",
              field: "VPA_Mis_FuelRemark",
            },
            {
              label: "Call Charges",
              field: "VPA_Mis_CallCharges",
            },
            {
              label: "Secret Key",
              field: "VPA_Mis_SecretKey",
            },
            {
              label: "Merchant Reimbursement",
              field: "VPA_Mis_MerchantReimbursement",
            },
            {
              label: "Customer Id",
              field: "VPA_Mis_CustomerId",
            },
            {
              label: "VPA",
              field: "VPA_Mis_VPA",
            },
          ].map(({ label, field }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>

              <input
                type="text"
                value={data?.[field] || ""}
                onChange={(e) =>
                  handleChange(field, e.target.value)
                }
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>
          ))}

          {/* Select Type Fields */}
          {[
            {
              label: "Daily Transaction Limit Status",
              field: "misTransactionLimitStatus",
              options: ["HOLD", "BLOCK", "NONE"],
            },
            {
              label: "Application Mode",
              field: "VPA_Mis_AppMode",
              options: [
                "BUS MODE",
                "FULL MODE",
                "KOTAK ADMIN MENU",
                "LODHA ADMIN MENU",
                "LODHA-PALAVA ADMIN MENU",
                "MERCHANT MENU",
              ],
            },
            {
              label: "Per Transaction Limit Status",
              field: "misPerTransactionLimitStatus",
              options: ["HOLD", "BLOCK", "NONE"],
            },
            {
              label: "Transaction Mode",
              field: "VPA_Mis_TranMode",
              options: [
                "Last 5 Transactions (Offline)",
                "Purchase Bus Ticket",
                "Balance Enquiry",
                "Bus pass validation",
              ],
            },
            {
              label: "FIRC",
              field: "VPA_Mis_FIRC",
              options: ["Yes", "No"],
            },
            {
              label: "FIRC Frequency",
              field: "VPA_Mis_FIRCFrequency",
              options: ["Daily", "Monthly"],
            },
          ].map((item, index) => (
            <div key={index} className="mb-4">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                {item.label}
              </label>

              <select
                value={data?.[item.field] || ""}
                onChange={(e) => handleChange(item.field, e.target.value)}
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select --</option>

                {item.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

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
                      checked={data?.[field] === opt}
                      onChange={() =>
                        handleChange(field, opt)
                      }
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

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSaveAndNext}
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

    </>

  );
}