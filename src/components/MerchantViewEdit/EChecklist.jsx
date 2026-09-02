import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Menu } from "lucide-react";
import { toast } from "react-toastify";
import { ClipboardCheck, ListChecks } from "lucide-react";

export default function EChecklist({
  refId,
  data,
  setData,
  errors,
  handleNext,
  handleBack
}) {
  const [apiData, setApiData] = useState({});
  const [checklistData, setChecklistData] = useState({

    NameOfTheMerchant: "",
    Address: "",
    MerchantBusinessType: "",
    ExistingNewRelationship: "",

    PaymentHoldOver: "",
    MSF: "",
    CrossBorderTransactions: "",
    DSecure: "",
    DomesticUserTransactionLimits: "",
    SecuredCrossBorderLimit: "",
    UnsecuredTransactionsLimit: "",
    ChargeBanksRecover: "",

    vgtStatus: "",
    vgtResult: "",

    wcStatus: "",
    wcResult: "",

    underwritingStatus: "",
    underwritingResult: "",

    inspectionStatus: "",
    inspectionResult: "",

    approvalsStatus: "",
    approvalsResult: "",

    mvcStatus: "",
    mvcResult: "",

    kycStatus: "",
    kycResult: "",

  });

  // Fetch Api Calling

  useEffect(() => {
    if (!refId) return;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `rMerchantChecklist/${refId}`
        );
        if (response?.respCode === 0) {
          const res = response?.respData;
          setApiData(res || {});

          setChecklistData({
            NameOfTheMerchant:
              res?.CL_NameOfTheMerchant || "",

            Address:
              res?.CL_Address || "",

            MerchantBusinessType:
              res?.CL_MerchantBusinessType || "",

            ExistingNewRelationship:
              res?.CL_ExistingNewRelationship || "",

            PaymentHoldOver:
              res?.CL_PaymentHoldOver || "",

            MSF:
              res?.CL_MSF || "",

            CrossBorderTransactions:
              res?.CL_CrossBorderTransactions || "",

            DSecure:
              res?.CL_3DSecure || "",

            DomesticUserTransactionLimits:
              res?.CL_DomesticUserTransactionLimits || "",

            SecuredCrossBorderLimit:
              res?.CL_SecuredCrossBorderLimit || "",

            UnsecuredTransactionsLimit:
              res?.CL_UnsecuredTransactionsLimit || "",

            ChargeBanksRecover:
              res?.CL_ChargeBanksRecover || "",

            vgtStatus:
              res?.MCL_VGTRegistration_Status || "",

            vgtResult:
              res?.MCL_VGTRegistration_ReSult || "",

            wcStatus:
              res?.MCL_WCCompleted_Status || "",

            wcResult:
              res?.MCL_WCCompleted_Result || "",

            underwritingStatus:
              res?.MCL_MRUnderwriting_Status || "",

            underwritingResult:
              res?.MCL_MRUnderwriting_Result || "",

            inspectionStatus:
              res?.MCL_SInspectionCompleted_Status || "",

            inspectionResult:
              res?.MCL_SInspectionCompleted_Result || "",

            approvalsStatus:
              res?.MCL_BApprovals_Status || "",

            approvalsResult:
              res?.MCL_BApprovals_Result || "",

            mvcStatus:
              res?.MCL_MVCChecks_Status || "",

            mvcResult:
              res?.MCL_MVCChecks_result || "",

            kycStatus:
              res?.MCL_KYCConfirmed_Status || "",

            kycResult:
              res?.MCL_KYCConfirmed_Result || "",
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [refId]);

  // This Api Are Save Edited Data
  const saveMerchantCheckList = async () => {
    try {

      const payload = {
        ref_id: refId,

        //Check List Input 
        CL_NameOfTheMerchant:
          checklistData.NameOfTheMerchant,

        CL_Address:
          checklistData.Address,

        CL_MerchantBusinessType:
          checklistData.MerchantBusinessType,

        CL_ExistingNewRelationship:
          checklistData.ExistingNewRelationship,

        CL_PaymentHoldOver:
          checklistData.PaymentHoldOver,

        CL_MSF:
          checklistData.MSF,

        CL_CrossBorderTransactions:
          checklistData.CrossBorderTransactions,

        CL_3DSecure:
          checklistData.DSecure,

        CL_DomesticUserTransactionLimits:
          checklistData.DomesticUserTransactionLimits,

        CL_SecuredCrossBorderLimit:
          checklistData.SecuredCrossBorderLimit,

        CL_UnsecuredTransactionsLimit:
          checklistData.UnsecuredTransactionsLimit,

        CL_ChargeBanksRecover:
          checklistData.ChargeBanksRecover,

        //Merchant Check List 

        MCL_VGTRegistration_Status:
          checklistData.vgtStatus,

        MCL_VGTRegistration_ReSult:
          checklistData.vgtResult,

        MCL_WCCompleted_Status:
          checklistData.wcStatus,

        MCL_WCCompleted_Result:
          checklistData.wcResult,

        MCL_MRUnderwriting_Status:
          checklistData.underwritingStatus,

        MCL_MRUnderwriting_Result:
          checklistData.underwritingResult,

        MCL_SInspectionCompleted_Status:
          checklistData.inspectionStatus,

        MCL_SInspectionCompleted_Result:
          checklistData.inspectionResult,

        MCL_BApprovals_Status:
          checklistData.approvalsStatus,

        MCL_BApprovals_Result:
          checklistData.approvalsResult,

        MCL_MVCChecks_Status:
          checklistData.mvcStatus,

        MCL_MVCChecks_result:
          checklistData.mvcResult,

        MCL_KYCConfirmed_Status:
          checklistData.kycStatus,

        MCL_KYCConfirmed_Result:
          checklistData.kycResult,

      };

      const response =
        await axiosInstance.post(
          "/saveEditMeCheckList",
          payload,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const resData = response;
      if (resData?.respCode === 0) {
        toast.success(resData?.respMsg);
        setData((prev) => ({
          ...prev,
          refId:
            resData?.respData?.ref_id ||
            prev.refId,
        }));

      } else {
        toast.error(resData?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const updateChecklist = (field, value) => {
    setChecklistData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const inputClass =
    "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[14px] text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
  const labelClass =
    "mb-1 block text-[15px] font-medium text-gray-700";
  const req = <span className="text-red-500">*</span>

  return (

    <>
      <div>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-5 h-5 text-yellow-600" />
          </div>

          <h2 className="text-2xl uppercase text-blue-900 font-bold">
            Edited Checklist Form
          </h2>
        </div>

        <p className="text-md text-blue-900 ml-12">
          Checklist Form collects essential information such as
          personal and contact details to create a user profile.
        </p>

        <div>
          {/* Check List Title */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
                <ListChecks className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-light text-gray-700">
                Check List
              </h2>
            </div>

            {/* Check List */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 text-5xl">
              {/* Column 1 */}
              <div className="space-y-5">
                {/* Name Of The Merchant */}
                <div>
                  <label className={labelClass}>
                    Name of the Merchant {req}
                  </label>

                  <input
                    type="text"
                    name="CL_NameOfTheMerchant"
                    value={checklistData.NameOfTheMerchant}
                    maxLength={50}
                    required
                    placeholder="Enter Merchant Name"
                    className={inputClass}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^A-Za-z ]/g, "");
                      updateChecklist("NameOfTheMerchant", value);
                    }}
                  />
                </div>

                {/* Existing/New Relationship */}
                <div>
                  <label className={labelClass}>
                    Existing / New Relationship {req}
                  </label>

                  <div className="flex h-10 items-center gap-5 text-[14px]">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_ExistingNewRelationship"
                        value="Existing"
                        checked={
                          checklistData.ExistingNewRelationship === "Existing"
                        }
                        onChange={(e) =>
                          updateChecklist(
                            "ExistingNewRelationship",
                            e.target.value
                          )
                        }
                      />
                      Existing
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_ExistingNewRelationship"
                        value="New Relationship"
                        checked={
                          checklistData.ExistingNewRelationship ===
                          "New Relationship"
                        }
                        onChange={(e) =>
                          updateChecklist(
                            "ExistingNewRelationship",
                            e.target.value
                          )
                        }
                      />
                      New Relationship
                    </label>
                  </div>
                </div>

                {/* Cross Border */}
                <div>
                  <label className={labelClass}>
                    Cross Border Transactions {req}
                  </label>
                  <div className="flex h-10 items-center gap-5 text-[14px]">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_CrossBorderTransactions"
                        value="Yes"
                        checked={
                          checklistData.CrossBorderTransactions === "Yes"
                        }
                        onChange={(e) =>
                          updateChecklist(
                            "CrossBorderTransactions",
                            e.target.value
                          )
                        }
                      />
                      Yes
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_CrossBorderTransactions"
                        value="No"
                        checked={
                          checklistData.CrossBorderTransactions === "No"
                        }
                        onChange={(e) =>
                          updateChecklist(
                            "CrossBorderTransactions",
                            e.target.value
                          )
                        }
                      />
                      No
                    </label>

                  </div>
                </div>

                {/* Secured Cross Border */}
                <div>
                  <label className={labelClass}>
                    Secured Cross Border Limit {req}
                  </label>

                  <input
                    type="text"
                    name="CL_SecuredCrossBorderLimit"
                    value={checklistData.SecuredCrossBorderLimit}
                    maxLength={10}
                    required
                    placeholder="Enter Limit"
                    className={inputClass}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      updateChecklist("SecuredCrossBorderLimit", value);
                    }}
                  />
                </div>

              </div>

              {/* Column 2 */}
              <div className="space-y-5">

                {/* Address */}
                <div>
                  <label className={labelClass}>
                    Address {req}
                  </label>

                  <input
                    type="text"
                    name="CL_Address"
                    value={checklistData.Address}
                    maxLength={200}
                    required
                    placeholder="Enter Address"
                    className={inputClass}
                    onChange={(e) => {
                      const value = e.target.value.replace(
                        /[^A-Za-z0-9\s,./#&()-]/g,
                        ""
                      );

                      updateChecklist("Address", value);
                    }}
                  />
                </div>

                {/* Payment Hold */}
                <div>
                  <label className={labelClass}>
                    Payment Hold Over {req}
                  </label>
                  <div className="flex h-10 items-center gap-5 text-[14px]">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_PaymentHoldOver"
                        value="Yes"
                        checked={checklistData.PaymentHoldOver === "Yes"}
                        onChange={(e) =>
                          updateChecklist(
                            "PaymentHoldOver",
                            e.target.value
                          )
                        }
                      />
                      Yes
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_PaymentHoldOver"
                        value="No"
                        checked={checklistData.PaymentHoldOver === "No"}
                        onChange={(e) =>
                          updateChecklist(
                            "PaymentHoldOver",
                            e.target.value
                          )
                        }
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* 3D Secure */}
                <div>
                  <label className={labelClass}>
                    3D Secure {req}
                  </label>
                  <div className="flex h-10 items-center gap-5 text-[14px]">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_3DSecure"
                        value="Yes"
                        checked={checklistData.DSecure === "Yes"}
                        onChange={(e) =>
                          updateChecklist("DSecure", e.target.value)
                        }
                      />
                      Yes
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_3DSecure"
                        value="No"
                        checked={checklistData.DSecure === "No"}
                        onChange={(e) =>
                          updateChecklist("DSecure", e.target.value)
                        }
                      />
                      No
                    </label>

                  </div>
                </div>

                {/* Unsecured Transaction */}
                <div>
                  <label className={labelClass}>
                    Unsecured Transactions Limit {req}
                  </label>
                  <input
                    type="text"
                    name="CL_UnsecuredTransactionsLimit"
                    value={checklistData.UnsecuredTransactionsLimit}
                    maxLength={8}
                    required
                    placeholder="Enter Transaction Limit"
                    className={inputClass}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      updateChecklist(
                        "UnsecuredTransactionsLimit",
                        value
                      );
                    }}
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-5">
                {/* Merchant Business Type */}
                <div>
                  <label className={labelClass}>
                    Merchant Business Type {req}
                  </label>

                  <select
                    className={inputClass}
                    name="CL_MerchantBusinessType"
                    value={checklistData.MerchantBusinessType}
                    onChange={(e) =>
                      updateChecklist(
                        "MerchantBusinessType",
                        e.target.value
                      )
                    }
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
                    MSF (Merchant Service Fee){req}
                  </label>

                  <div className="flex h-10 items-center gap-5 text-[14px]">

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_MSF"
                        value="Yes"
                        checked={checklistData.MSF === "Yes"}
                        onChange={(e) =>
                          updateChecklist("MSF", e.target.value)
                        }
                      />
                      Yes
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_MSF"
                        value="No"
                        checked={checklistData.MSF === "No"}
                        onChange={(e) =>
                          updateChecklist("MSF", e.target.value)
                        }
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* Domestic User Limit */}
                <div>
                  <label className={labelClass}>
                    Domestic User Transaction Limits {req}
                  </label>
                  <input
                    type="text"
                    name="CL_DomesticUserTransactionLimits"
                    value={checklistData.DomesticUserTransactionLimits}
                    maxLength={8}
                    placeholder="Enter Transaction Limit"
                    className={inputClass}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      updateChecklist(
                        "DomesticUserTransactionLimits",
                        value
                      );
                    }}
                  />
                </div>

                {/* Charge Banks Recover */}
                <div>
                  <label className={labelClass}>
                    Charge Banks Recover {req}
                  </label>
                  <div className="flex h-10 items-center gap-5 text-[14px]">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_ChargeBanksRecover"
                        value="Instant"
                        checked={
                          checklistData.ChargeBanksRecover === "Instant"
                        }
                        onChange={(e) =>
                          updateChecklist(
                            "ChargeBanksRecover",
                            e.target.value
                          )
                        }
                      />
                      Instant
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="CL_ChargeBanksRecover"
                        value="Crystallization"
                        checked={
                          checklistData.ChargeBanksRecover ===
                          "Crystallization"
                        }
                        onChange={(e) =>
                          updateChecklist(
                            "ChargeBanksRecover",
                            e.target.value
                          )
                        }
                      />
                      Crystallization
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Merchant Check List Title */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-light text-gray-800">
                Merchant Check List
              </h2>
            </div>
            {/* Table */}
            <div className="overflow-x-auto text-5xl">
              <table className="w-full  border-collapse text-4xl">
                <thead>
                  <tr className="border-y border-gray-300 bg-[#fafafa]">
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
                            required
                            checked={checklistData.vgtStatus === "Yes"}
                            onChange={() =>
                              updateChecklist("vgtStatus", "Yes")
                            }
                          />
                          Yes
                        </label>

                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="vgtStatus"
                            required
                            checked={checklistData.vgtStatus === "No"}
                            onChange={() =>
                              updateChecklist("vgtStatus", "No")
                            }
                          />
                          No
                        </label>
                      </div>
                    </td>

                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={checklistData.vgtResult}
                        required
                        onChange={(e) =>
                          updateChecklist(
                            "vgtResult",
                            e.target.value
                          )
                        }
                        className="h-6 w-full border border-gray-400 px-2 text-xs outline-none"
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
                            required
                            checked={checklistData.wcStatus === "Yes"}
                            onChange={() =>
                              updateChecklist("wcStatus", "Yes")
                            }
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="wcStatus"
                            required
                            checked={checklistData.wcStatus === "No"}
                            onChange={() =>
                              updateChecklist("wcStatus", "No")
                            }
                          />
                          No
                        </label>
                      </div>
                    </td>

                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={checklistData.wcResult}
                        required
                        onChange={(e) =>
                          updateChecklist(
                            "wcResult",
                            e.target.value
                          )
                        }
                        className="h-6 w-full border border-gray-400 px-2 text-xs outline-none"
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
                            required
                            checked={
                              checklistData.underwritingStatus === "Yes"
                            }
                            onChange={() =>
                              updateChecklist(
                                "underwritingStatus",
                                "Yes"
                              )
                            }
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="underwritingStatus"
                            required
                            checked={
                              checklistData.underwritingStatus === "No"
                            }
                            onChange={() =>
                              updateChecklist(
                                "underwritingStatus",
                                "No"
                              )
                            }
                          />
                          No
                        </label>
                      </div>
                    </td>

                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={checklistData.underwritingResult}
                        required
                        onChange={(e) =>
                          updateChecklist(
                            "underwritingResult",
                            e.target.value
                          )
                        }
                        className="h-6 w-full border border-gray-400 px-2 text-xs outline-none"
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
                            required
                            checked={
                              checklistData.inspectionStatus === "Yes"
                            }
                            onChange={() =>
                              updateChecklist(
                                "inspectionStatus",
                                "Yes"
                              )
                            }
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="inspectionStatus"
                            required
                            checked={
                              checklistData.inspectionStatus === "No"
                            }
                            onChange={() =>
                              updateChecklist(
                                "inspectionStatus",
                                "No"
                              )
                            }
                          />
                          No
                        </label>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={checklistData.inspectionResult}
                        required
                        onChange={(e) =>
                          updateChecklist(
                            "inspectionResult",
                            e.target.value
                          )
                        }
                        className="h-6 w-full border border-gray-400 px-2 text-xs outline-none"
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
                            required
                            checked={
                              checklistData.approvalsStatus === "Yes"
                            }
                            onChange={() =>
                              updateChecklist(
                                "approvalsStatus",
                                "Yes"
                              )
                            }
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="approvalsStatus"
                            required
                            checked={
                              checklistData.approvalsStatus === "No"
                            }
                            onChange={() =>
                              updateChecklist(
                                "approvalsStatus",
                                "No"
                              )
                            }
                          />
                          No
                        </label>
                      </div>
                    </td>

                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={checklistData.approvalsResult}
                        required
                        onChange={(e) =>
                          updateChecklist(
                            "approvalsResult",
                            e.target.value
                          )
                        }
                        className="h-6 w-full border border-gray-400 px-2 text-xs outline-none"
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
                            required
                            checked={
                              checklistData.mvcStatus === "Yes"
                            }
                            onChange={() =>
                              updateChecklist(
                                "mvcStatus",
                                "Yes"
                              )
                            }
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="mvcStatus"
                            required
                            checked={
                              checklistData.mvcStatus === "No"
                            }
                            onChange={() =>
                              updateChecklist(
                                "mvcStatus",
                                "No"
                              )
                            }
                          />
                          No
                        </label>
                      </div>
                    </td>

                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={checklistData.mvcResult}
                        required
                        onChange={(e) =>
                          updateChecklist(
                            "mvcResult",
                            e.target.value
                          )
                        }
                        className="h-6 w-full border border-gray-400 px-2 text-xs outline-none"
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
                            checked={
                              checklistData.kycStatus === "Yes"
                            }
                            onChange={() =>
                              updateChecklist(
                                "kycStatus",
                                "Yes"
                              )
                            }
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="kycStatus"
                            checked={
                              checklistData.kycStatus === "No"
                            }
                            onChange={() =>
                              updateChecklist(
                                "kycStatus",
                                "No"
                              )
                            }
                          />
                          No
                        </label>
                      </div>
                    </td>

                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={checklistData.kycResult}
                        required
                        onChange={(e) =>
                          updateChecklist(
                            "kycResult",
                            e.target.value
                          )
                        }
                        className="h-6 w-full border border-gray-400 px-2 text-xs outline-none"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
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

          <div className="flex justify-center">
            <button
              type="button"
              onClick={saveMerchantCheckList}
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
    </>
  );
}