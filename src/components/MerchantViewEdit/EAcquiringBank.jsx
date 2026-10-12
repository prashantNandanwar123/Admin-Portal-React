import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { CircleDollarSign, Landmark, WalletCards, Settings2, ArrowRight, ArrowLeft } from "lucide-react";

export default function ERAcquiringBank({
  refId,
  data,
  setData,
  handleNext,
  handleBack
}) {

  useEffect(() => {
    if (!refId) return;

    // FetchData APi Call for view
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

  const handleFeeChange = (field, value) => {
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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
        msCurrency: data?.msCurrency,
        misPerTransactionLimit: data?.misPerTransactionLimit,
        misPerTransactionLimitStatus: data?.misPerTransactionLimitStatus,
        VPA_Mis_DocumentRequired: data?.VPA_Mis_DocumentRequired,
        VPA_Mis_DocumentPending: data?.VPA_Mis_DocumentPending,
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
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[20px]">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500"></div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
          </div>
          <h2 className="text-xl sm:text-xl text-slate-800 font-semibold -mt-3">
            Edit Acquiring Bank Setup Details
          </h2>
        </div>
        <p className="ml-14 text-sm text-slate-700 -mt-3">
          Edit and manage all essential merchant acquiring bank information
          including settlement details, transaction settings for secure and
          seamless banking operations.
        </p>
      </div>

      {/* ── Fee Setup ─────────────────────────────────────────────────── */}
      <div className="py-5 bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-100 flex items-center justify-center shrink-0">
              <CircleDollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 uppercase flex items-center gap-2">
              Fee Setup
            </h2>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-5">
          {[
            { label: "One Time Fixed Fee", field: "FS_OneTimeFixedFee", required: true, },
            { label: "Statement Fee", field: "FS_StatementFee", required: true, },
            { label: "Terminal Fee", field: "FS_TerminalFee", required: true, },
            { label: "Minimum Usage (in Days)", field: "FS_MiniUsageDays", required: true, },
            { label: "Minimum Transaction Amount", field: "FS_MiniTranAmount", required: true },
            { label: "Minimum Usage Fee", field: "FS_MiniUsageFee", required: true },
            { label: "AMC Amount", field: "FS_AMCAmount", required: true },
            { label: "Non Usage (in Days)", field: "FS_NonUsageDays", required: true },
            { label: "Non Usage Fee", field: "FS_NonUsageFee", required: true },
          ].map(({ label, field, required }, index) => (
            <div key={index}>
              <label className="block text-[14px] font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={data?.[field] || ""}
                onChange={(e) =>
                  handleFeeChange(field, e.target.value)
                }
                className="w-full h-8 border border-gray-400 rounded-sm px-3 outline-none"
              />
            </div>
          ))}

          {/* AMC Type */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              AMC Type<span className="text-red-500 ml-1">*</span>
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
          <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-100 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 uppercase flex items-center gap-2">
            Settlement Setup
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-7 gap-y-5">
          {/* Settlement Type */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">
              Settlement Type<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center gap-5 mt-2">
              {["Manual", "Automatic"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-1 text-[14px] font-medium text-gray-700"
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
              label: "Settlement Cycle (If Automated)", field: "SS_SettlementCycle",
              options: ["Daily", "Daily Twice", "Two Days Once", "Weekly"], required: true
            },
            {
              label: "Payment By", field: "SS_PaymentBy",
              options: ["A/C Credit", "IMPS", "NEFT", "RTGS"], required: true
            },
            {
              label: "Payment Advice", field: "SS_PaymentAdvice",
              options: ["Daily", "Monthly", "Weekly"], required: true
            },
          ].map((item, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-[14px] font-medium text-gray-700 mb-2">
                {item.label}
                {item.required && <span className="text-red-500 ml-1">*</span>}
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
          <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-100 flex items-center justify-center shrink-0">
            <WalletCards className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 uppercase flex items-center gap-2">
            Beneficiary Account Details
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Beneficiary Account Name", field: "BAD_BeneficiaryAccountName", required: true },
            { label: "Beneficiary Account No", field: "BAD_BeneficiaryAccountNo", required: true },
            { label: "Beneficiary Bank Code", field: "BAD_BeneficiaryBankCode", required: true },
            { label: "Beneficiary Bank Name", field: "BAD_BeneficiaryBankName", required: true },
            { label: "Beneficiary Branch Name", field: "BAD_BeneficiaryBranchName", },
            { label: "Beneficiary Branch Code", field: "BAD_BeneficiaryBranchCode", },
            { label: "IFSC Code", field: "BAD_IFSCCode", required: true },
          ].map(({ label, field, required }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
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
          <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-100 flex items-center justify-center shrink-0">
            <Settings2 className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 uppercase flex items-center gap-2">
            Miscellaneous
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Row 1 - Daily Transaction Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Transaction Limit<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={data?.misTransactionLimit || ""}
              onChange={(e) =>
                handleChange("misTransactionLimit", e.target.value)
              }
              className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Transaction Limit Status<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={data?.misTransactionLimitStatus || ""}
              onChange={(e) =>
                handleChange("misTransactionLimitStatus", e.target.value)
              }
              className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              <option value="HOLD">HOLD</option>
              <option value="BLOCK">BLOCK</option>
              <option value="NONE">NONE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Currency Type<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={data?.msCurrency || ""}
              onChange={(e) =>
                handleChange("msCurrency", e.target.value)
              }
              className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              <option value="INR">INR - INDIA</option>
              <option value="IDR">IDR - INDONESIA</option>
              <option value="VND">VND - VIETNAM</option>
            </select>
          </div>

          {/* Row 2 - Per Transaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Per Transaction Limit<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={data?.misPerTransactionLimit || ""}
              onChange={(e) =>
                handleChange("misPerTransactionLimit", e.target.value)
              }
              className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Per Transaction Limit Status<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={data?.misPerTransactionLimitStatus || ""}
              onChange={(e) =>
                handleChange("misPerTransactionLimitStatus", e.target.value)
              }
              className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              <option value="HOLD">HOLD</option>
              <option value="BLOCK">BLOCK</option>
              <option value="NONE">NONE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Required
            </label>
            <div className="flex items-center gap-6 h-11">
              {["Yes", "No"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-sm text-gray-700">                
                  <input
                    type="radio"
                    checked={data?.VPA_Mis_DocumentRequired === opt}
                    onChange={() =>
                      handleChange("VPA_Mis_DocumentRequired", opt)
                    }
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Row 3 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Pending
            </label>

            <div className="flex items-center gap-6 h-11">
              {["Yes", "No"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-sm text-gray-700">                
                  <input
                    type="radio"
                    checked={data?.VPA_Mis_DocumentPending === opt}
                    onChange={() =>
                      handleChange("VPA_Mis_DocumentPending", opt)
                    }
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Id
            </label>
            <input
              type="text"
              value={data?.VPA_Mis_CustomerId || ""}
              onChange={(e) =>
                handleChange("VPA_Mis_CustomerId", e.target.value)
              }
              className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              VPA
            </label>
            <input
              type="text"
              value={data?.VPA_Mis_VPA || ""}
              onChange={(e) =>
                handleChange("VPA_Mis_VPA", e.target.value)
              }
              className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/*BACK &  NEXT BUTTON */}
      <div className="flex gap-4 mt-10 d-flex justify-between align-items-center">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-full"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSaveAndNext}
            className="bg-green-500 hover:bg-green-500 text-white px-6 py-2 rounded">
            Update
          </button>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-[#fec931] text-black font-semibold px-6 py-2.5 rounded-full shadow-sm transition">
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}