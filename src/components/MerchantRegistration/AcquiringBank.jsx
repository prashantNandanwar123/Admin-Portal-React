import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { Receipt, Landmark, UserRound, SlidersHorizontal } from "lucide-react";

import { toast } from "react-toastify";

export default function AcquiringBank({ data, setData, handleNext,
  handleBack }) {
  const [refid, setRefId] = useState("");
  const [errors, setErrors] = useState({});
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };


  const saveAcquiringBank = async () => {

    try {
      const payload = {
        ref_id: data?.refId,                          // flows from BasicDetails
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

      const response = await axiosInstance.post("/saveMerchantAcquiringBank", payload);

      if (response?.respCode === 0) {
        toast.success(response?.respMsg);
        setData((prev) => ({
          ...prev,
          refId: response?.respData?.ref_id,
        }));
        handleNext();
      } else {
        toast.error(response?.respMsg);
        if (response?.respData && typeof response.respData === "object") {
          Object.values(response.respData).forEach((msg) => {
            toast.error(msg);
          });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleNumberChange = (e, field) => {
    const value = e.target.value;

    // allow only numbers (and empty)
    if (/^\d*$/.test(value)) {
      setData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const validate = () => {
    let newErrors = {};

    const fields = [
      "FS_OneTimeFixedFee",
      "FS_StatementFee",
      "FS_TerminalFee",
      "FS_MiniUsageDays",
      "FS_MiniTranAmount",
      "FS_MiniUsageFee",
      "FS_AMCAmount",
      "FS_NonUsageDays",
      "FS_NonUsageFee",
    ];

    fields.forEach((field) => {
      if (!data?.[field]) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveAcquiringBank();
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600">
            <Landmark size={18} />
          </span>
          <h2 className="text-xl sm:text-1xl uppercase text-blue-900 font-bold">
            Acquiring Bank Setup Details
          </h2>
        </div>

        <p className="ml-12 text-sm text-blue-900 leading-relaxed font-noraml">
          Configure and manage all essential merchant acquiring bank information including
          settlement details, transaction settings for secure and
          seamless banking operations.
        </p>

        {/* ── Fee Setup ─────────────────────────────────────────────────── */}
        <div className="py-5">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600">
                <Receipt size={16} />
              </span>
              <h2 className="text-[18px] text-[#5c5c5c] font-semibold">
                Fee Setup
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-5">
              {[
                { label: "One Time Fixed Fee", field: "FS_OneTimeFixedFee", required: true },
                { label: "Statement Fee", field: "FS_StatementFee", required: true },
                { label: "Terminal Fee", field: "FS_TerminalFee", required: true },
                { label: "Minimum Usage (in Days)", field: "FS_MiniUsageDays", required: true },
                { label: "Minimum Transaction Amount", field: "FS_MiniTranAmount", required: true },
                { label: "Minimum Usage Fee", field: "FS_MiniUsageFee", required: true },
                { label: "AMC Amount", field: "FS_AMCAmount", required: true },
                { label: "Non Usage (in Days)", field: "FS_NonUsageDays", required: true },
                { label: "Non Usage Fee", field: "FS_NonUsageFee", required: true },
              ].map(({ label, field, required }) => (
                <div key={field}>
                  <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                  </label>

                  <input
                    type="text"
                    required={required}
                    maxLength={8}
                    value={data?.[field] || ""}
                    onChange={(e) => handleNumberChange(e, field)}
                    className="w-full h-10 border border-gray-300 rounded px-3 bg-white text-gray-700 outline-none"
                  />

                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}

              {/* AMC Type */}
              <div>
                <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                  AMC Type <span className="text-red-500">*</span>
                </label>

                <select
                  className="w-full h-10 border border-gray-300 rounded px-3 bg-white text-gray-700 outline-none"
                  value={data?.FS_AMCType || ""}
                  required
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      FS_AMCType: e.target.value,
                    }))
                  }
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
        </div>

        {/* ── Settlement Setup ──────────────────────────────────────────── */}
        <div className="pb-5">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                <Landmark size={16} />
              </span>
              <h2 className="text-[18px] text-[#5c5c5c] font-semibold">Settlement Setup</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-7 gap-y-5">

              {/* ✅ Fixed: value+onChange now on the <input>, not <label> */}
              <div>
                <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                  Settlement Type <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-5 mt-2">
                  {["Manual", "Automatic"].map((type) => (
                    <label key={type} className="flex items-center gap-1 text-[14px] text-[#5c5c5c]">
                      <input
                        type="radio"
                        name="SS_SettlementType"
                        required
                        value={type}
                        checked={data?.SS_SettlementType === type}
                        onChange={(e) => handleChange("SS_SettlementType", e.target.value)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {[
                { label: "Settlement Cycle (If Automated)", field: "SS_SettlementCycle", options: ["Daily", "Daily Twice", "Two Days Once", "Weekly"] },
                { label: "Payment By", field: "SS_PaymentBy", options: ["A/C Credit", "IMPS", "NEFT", "RTGS"] },
                { label: "Payment Advice", field: "SS_PaymentAdvice", options: ["Daily", "Monthly", "Weekly"] },
              ].map(({ label, field, options }) => (
                <div key={field}>
                  <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data?.[field] || ""}
                    required
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full h-8 border border-gray-400 rounded-sm bg-white px-3 text-sm text-gray-600 outline-none"
                  >
                    <option value="">-- Select --</option>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Beneficiary Account Details ───────────────────────────────── */}
        <div className="pb-5">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                <UserRound size={16} />
              </span>
              <h2 className="text-2xl font-semibold text-gray-700">
                Beneficiary Account Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Beneficiary Account Name",
                  field: "BAD_BeneficiaryAccountName",
                  required: true,
                  pattern: /^[A-Za-z ]+$/,
                  message: "Only alphabets are allowed",
                },
                {
                  label: "Beneficiary Account No",
                  field: "BAD_BeneficiaryAccountNo",
                  required: true,
                  maxLength: 25,
                  pattern: /^[0-9]+$/,
                  message: "Only numbers are allowed",
                },
                {
                  label: "Beneficiary Bank Code",
                  field: "BAD_BeneficiaryBankCode",
                  required: true,
                  maxLength: 20,
                  pattern: /^[A-Za-z0-9]+$/,
                  message: "Only numbers are allowed",
                },
                {
                  label: "Beneficiary Bank Name",
                  field: "BAD_BeneficiaryBankName",
                  required: true,
                  maxLength: 100,
                  pattern: /^[A-Za-z ]+$/,
                  message: "Only alphabets are allowed",
                },
                {
                  label: "Beneficiary Branch Name",
                  field: "BAD_BeneficiaryBranchName",
                  maxLength: 50,
                  pattern: /^[A-Za-z ]+$/,
                  message: "Only alphabets are allowed",
                },
                {
                  label: "Beneficiary Branch Code",
                  field: "BAD_BeneficiaryBranchCode",
                  maxLength: 12,
                  pattern: /^[A-Z0-9]+$/,
                  message: "Only numbers are allowed",
                },
                {
                  label: "IFSC Code",
                  field: "BAD_IFSCCode",
                  required: true,
                  placeholder: "ABCD***",
                  pattern: /^[A-Z0-9]+$/,
                  maxLength: 11,
                },
              ].map(
                ({
                  label,
                  field,
                  required,
                  pattern,
                  message,
                  maxLength,
                }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                      {required && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      type="text"
                      value={data?.[field] || ""}
                      required
                      maxLength={maxLength}
                      placeholder={
                        field === "BAD_IFSCCode"
                          ? "SBIN0001234"
                          : "Enter value"
                      }
                      onChange={(e) => {

                        let value = e.target.value;

                        // ONLY for IFSC Code
                        if (field === "BAD_IFSCCode") {
                          value = value.toUpperCase();
                          // remove special characters and spaces
                          value = value.replace(/[^A-Z0-9]/g, "");
                        }
                        // ONLY for Benificiary  Branch Code
                        if (field === "BAD_BeneficiaryBranchCode") {
                          value = value.toUpperCase();
                          // remove everything except capital letters and numbers
                          value = value.replace(/[^A-Z0-9]/g, "");
                        }
                        if (pattern && value && !pattern.test(value)) {
                          setErrors((prev) => ({
                            ...prev,
                            [field]: message,
                          }));
                        } else {
                          setErrors((prev) => ({
                            ...prev,
                            [field]: "",
                          }));
                        }

                        handleChange(field, value);
                      }}
                      className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {errors?.[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* ── Miscellaneous ─────────────────────────────────────────────── */}
        <section className="pb-5">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600">
                <SlidersHorizontal size={16} />
              </span>
              <h2 className="text-2xl font-semibold text-gray-700">
                Miscellaneous
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Daily Transaction Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Transaction Limit
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  maxLength={8}
                  required
                  value={data?.misTransactionLimit || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Only numbers allowed
                    if (/^\d*$/.test(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        misTransactionLimit: "",
                      }));

                      handleChange("misTransactionLimit", value);
                    }
                  }}
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {errors?.misTransactionLimit && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.misTransactionLimit}
                  </p>
                )}
              </div>

              {/* Daily Transaction Limit Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Transaction Limit Status
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  value={data?.misTransactionLimitStatus || ""}
                  required
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

              {/* Application Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Mode
                </label>

                <select
                  value={data?.VPA_Mis_AppMode || ""}
                  onChange={(e) =>
                    handleChange("VPA_Mis_AppMode", e.target.value)
                  }
                  required
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select --</option>
                  <option value="BUS MODE">BUS MODE</option>
                  <option value="FULL MODE">FULL MODE</option>
                  <option value="KOTAK ADMIN MENU">KOTAK ADMIN MENU</option>
                  <option value="LODHA ADMIN MENU">LODHA ADMIN MENU</option>
                  <option value="LODHA-PALAVA ADMIN MENU">
                    LODHA-PALAVA ADMIN MENU
                  </option>
                  <option value="MERCHANT MENU">MERCHANT MENU</option>
                </select>
              </div>
              {/* Per Transaction Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Per Transaction Limit
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  value={data?.misPerTransactionLimit || ""}
                  required
                  maxLength={8}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers
                    if (/^\d*$/.test(value)) {
                      handleChange("misPerTransactionLimit", value);
                    }
                  }}
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {errors?.misPerTransactionLimit && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.misPerTransactionLimit}
                  </p>
                )}
              </div>
              {/* Per Transaction Limit Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Per Transaction Limit Status
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  value={data?.misPerTransactionLimitStatus || ""}
                  required
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

              {/* Transaction Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Mode
                </label>

                <select
                  value={data?.VPA_Mis_TranMode || ""}
                  onChange={(e) =>
                    handleChange("VPA_Mis_TranMode", e.target.value)
                  }
                  required
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select --</option>
                  <option value="Last 5 Transactions (Offline)">
                    Last 5 Transactions (Offline)
                  </option>
                  <option value="Purchase Bus Ticket">
                    Purchase Bus Ticket
                  </option>
                  <option value="Balance Enquiry">
                    Balance Enquiry
                  </option>
                  <option value="Bus pass validation">
                    Bus pass validation
                  </option>
                </select>
              </div>

              {/* FIRC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FIRC (Foreign Inward Remittance Certificate)
                  <span className="text-red-500"> *</span>
                </label>

                <div className="flex items-center gap-6 h-11">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="VPA_Mis_FIRC"
                      value="Yes"
                      required
                      checked={data?.VPA_Mis_FIRC === "Yes"}
                      onChange={(e) =>
                        handleChange("VPA_Mis_FIRC", e.target.value)
                      }
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="VPA_Mis_FIRC"
                      value="No"
                      checked={data?.VPA_Mis_FIRC === "No"}
                      onChange={(e) =>
                        handleChange("VPA_Mis_FIRC", e.target.value)
                      }
                    />
                    No
                  </label>
                </div>
              </div>

              {/* FIRC Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FIRC Frequency
                </label>

                <select
                  value={data?.VPA_Mis_FIRCFrequency || ""}
                  onChange={(e) =>
                    handleChange("VPA_Mis_FIRCFrequency", e.target.value)
                  }
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select --</option>
                  <option value="Daily">Daily</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              {/* Fuel Association */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Association
                </label>

                <select
                  value={data?.VPA_Mis_FuelAssociation || ""}
                  onChange={(e) =>
                    handleChange("VPA_Mis_FuelAssociation", e.target.value)
                  }
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select --</option>
                  <option value="BPCL">BPCL</option>
                  <option value="CNG">CNG</option>
                  <option value="Essar Fuel">Essar Fuel</option>
                  <option value="Fuel ME">Fuel ME</option>
                  <option value="HP GAS">HP GAS</option>
                  <option value="HPCL">HPCL</option>
                  <option value="IBP">IBP</option>
                  <option value="IOCL">IOCL</option>
                  <option value="LPG">LPG</option>
                  <option value="MGL">MGL</option>
                  <option value="MNGL">MNGL</option>
                  <option value="Reliance">Reliance</option>
                  <option value="No Name">No Name</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* Fuel Remark */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Remark
                </label>

                <input
                  type="text"
                  value={data?.VPA_Mis_FuelRemark || ""}
                  onChange={(e) =>
                    handleChange("VPA_Mis_FuelRemark", e.target.value)
                  }
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Call Charges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call Charges
                </label>

                <input
                  type="text"
                  value={data?.VPA_Mis_CallCharges || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value && !/^[0-9]+$/.test(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        VPA_Mis_CallCharges: "Only numbers are allowed",
                      }));
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        VPA_Mis_CallCharges: "",
                      }));
                    }

                    handleChange("VPA_Mis_CallCharges", value);
                  }}
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {errors?.VPA_Mis_CallCharges && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.VPA_Mis_CallCharges}
                  </p>
                )}
              </div>

              {/* Secret Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Key
                </label>

                <input
                  type="text"
                  value={data?.VPA_Mis_SecretKey || ""}
                  onChange={(e) =>
                    handleChange("VPA_Mis_SecretKey", e.target.value)
                  }
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Document Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Required
                </label>

                <div className="flex items-center gap-6 h-11">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="VPA_Mis_DocumentRequired"
                      value="Yes"
                      checked={data?.VPA_Mis_DocumentRequired === "Yes"}
                      onChange={(e) =>
                        handleChange(
                          "VPA_Mis_DocumentRequired",
                          e.target.value
                        )
                      }
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="VPA_Mis_DocumentRequired"
                      value="No"
                      checked={data?.VPA_Mis_DocumentRequired === "No"}
                      onChange={(e) =>
                        handleChange(
                          "VPA_Mis_DocumentRequired",
                          e.target.value
                        )
                      }
                    />
                    No
                  </label>
                </div>
              </div>
              {/* Document Pending */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Pending
                </label>

                <div className="flex items-center gap-6 h-11">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="VPA_Mis_DocumentPending"
                      value="Yes"
                      checked={data?.VPA_Mis_DocumentPending === "Yes"}
                      onChange={(e) =>
                        handleChange(
                          "VPA_Mis_DocumentPending",
                          e.target.value
                        )
                      }
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="VPA_Mis_DocumentPending"
                      value="No"
                      checked={data?.VPA_Mis_DocumentPending === "No"}
                      onChange={(e) =>
                        handleChange(
                          "VPA_Mis_DocumentPending",
                          e.target.value
                        )
                      }
                    />
                    No
                  </label>
                </div>
              </div>
              {/* Merchant Reimbursement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merchant Reimbursement
                </label>

                <input
                  type="text"
                  value={data?.VPA_Mis_MerchantReimbursement || ""}
                  onChange={(e) =>
                    handleChange("VPA_Mis_MerchantReimbursement", e.target.value)
                  }
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Customer Id */}
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
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* VPA */}
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
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SAVE BUTTON */}
        <div className="flex gap-4 mt-10 d-flex justify-between align-items-center">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 text-white px-5 py-1 rounded-full hover:bg-gray-600"
          >
            Back
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-amber-400  text-gray-900 font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
          >
            Save & Next
          </button>
        </div>
      </form>
    </>
  );
}
