import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useLocation } from "react-router-dom";
import { BadgePercent, Landmark, WalletCards, SlidersHorizontal } from "lucide-react";
import { toast } from "react-toastify";



export default function VRAcquiringBank({
  refId,
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
        if (response?.respCode === 0) {
          toast.success(response.respMsg);
          const res = response?.respData;
          setApiData(res || {});
        } else {
          toast.error(response?.respMsg);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [refId]);

  const inputClass =
    "w-full h-10 sm:h-11 px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <>
      <div className="m-2">
        <div>
          <div className="flex items-center gap-3 py-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl sm:text-2xl text-blue-900 font-semibold">
              View Acquiring Bank Details
            </h2>
          </div>
          <p className="text-sm text-blue-900 -mt-3 ml-15">
            Review and manage the acquiring bank information linked to your account.
          </p>
        </div>

        {/* ── Fee Setup ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-8">
          <div className="">
            <h2 className="text-[18px] uppercase sm:text-[20px] text-gray-700 font-semibold mb-6 border-b border-gray-200 pb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
                <BadgePercent className="w-4 h-4 text-yellow-600" />
              </span>
              Fee Setup
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">

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
                  <label className={labelClass}>
                    {label}
                  </label>

                  <input
                    type="text"
                    value={value || ""}
                    readOnly
                    className={inputClass}
                  />
                </div>
              ))}

              {/* AMC Type */}
              <div>
                <label className={labelClass}>
                  AMC Type
                </label>

                <input
                  type="text"
                  value={apiData?.FS_AMCType || ""}
                  readOnly
                  className={inputClass}
                />
              </div>

            </div>
          </div>
        </div>

        {/* ── Settlement Setup ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-8">
          <h2 className="text-[18px] uppercase sm:text-[20px] text-gray-700 font-semibold mb-6 border-b border-gray-200 pb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-yellow-600" />
            </span>
            Settlement Setup
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">
            {/* Settlement Type */}
            <div>
              <label className={labelClass}>
                Settlement Type
              </label>

              <div className="border border-gray-200 rounded-full px-4 sm:px-5 h-10 sm:h-11 flex items-center gap-5">
                {["Manual", "Automatic"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="radio"
                      className="accent-orange-500"
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
              <label className={labelClass}>
                Settlement Cycle (If Automated)
              </label>

              <input
                type="text"
                value={apiData?.SS_SettlementCycle || ""}
                readOnly
                className={inputClass}
              />
            </div>

            {/* Payment By */}
            <div>
              <label className={labelClass}>
                Payment By
              </label>

              <input
                type="text"
                value={apiData?.SS_PaymentBy || ""}
                readOnly
                className={inputClass}
              />
            </div>

            {/* Payment Advice */}
            <div>
              <label className={labelClass}>
                Payment Advice
              </label>

              <input
                type="text"
                value={apiData?.SS_PaymentAdvice || ""}
                readOnly
                className={inputClass}
              />
            </div>

          </div>
        </div>

        {/* ── Beneficiary Account Details ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-8">
          <h2 className="text-[18px] uppercase sm:text-[20px] text-gray-700 font-semibold mb-6 border-b border-gray-200 pb-3 flex items-center gap-2">
            <span className="w-8 h-8  rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
              <WalletCards className="w-4 h-4 text-yellow-600" />
            </span>
            Beneficiary Account Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">

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
                <label className={labelClass}>
                  {label}
                </label>

                <input
                  type="text"
                  value={value || ""}
                  readOnly
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Miscellaneous ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600">
              <SlidersHorizontal size={16} />
            </span>
            <h2 className="text-2xl font-semibold text-gray-700">
              Miscellaneous
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-7">

            {/* Row 1 */}
            <div>
              <label className={labelClass}>Daily Transaction Limit</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_DailyTranLimit || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Daily Transaction Limit Status</label>
              <input
                type="text"
                value={apiData?.misTransactionLimitStatus || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Application Mode</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_AppMode || ""}
                readOnly
                className={inputClass}
              />
            </div>


            {/* Row 2 */}
            <div>
              <label className={labelClass}>Per Transaction Limit</label>
              <input
                type="text"
                value={apiData?.misPerTransactionLimit || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Per Transaction Limit Status</label>
              <input
                type="text"
                value={apiData?.misPerTransactionLimitStatus || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Transaction Mode</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_TranMode || ""}
                readOnly
                className={inputClass}
              />
            </div>


            {/* Row 3 */}
            <div>
              <label className={labelClass}>
                FIRC (Foreign Inward Remittance Certificate)
              </label>

              <div className="border border-gray-200 rounded-full px-4 sm:px-5 flex items-center gap-6 h-10 sm:h-11">
                {["Yes", "No"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="radio"
                      className="accent-orange-500"
                      checked={apiData?.VPA_Mis_FIRC === opt}
                      readOnly
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>FIRC Frequency</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_FIRCFrequency || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Fuel Association</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_FuelAssociation || ""}
                readOnly
                className={inputClass}
              />
            </div>


            {/* Row 4 */}
            <div>
              <label className={labelClass}>Fuel Remark</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_FuelRemark || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Call Charges</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_CallCharges || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Secret Key</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_SecretKey || ""}
                readOnly
                className={inputClass}
              />
            </div>


            {/* Row 5 */}
            <div>
              <label className={labelClass}>Document Required</label>

              <div className="border border-gray-200 rounded-full px-4 sm:px-5 flex items-center gap-6 h-10 sm:h-11">
                {["Yes", "No"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="radio"
                      className="accent-orange-500"
                      checked={apiData?.VPA_Mis_DocumentRequired === opt}
                      readOnly
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Document Pending</label>

              <div className="border border-gray-200 rounded-full px-4 sm:px-5 flex items-center gap-6 h-10 sm:h-11">
                {["Yes", "No"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="radio"
                      className="accent-orange-500"
                      checked={apiData?.VPA_Mis_DocumentPending === opt}
                      readOnly
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Merchant Reimbursement</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_MerchantReimbursement || ""}
                readOnly
                className={inputClass}
              />
            </div>


            {/* Row 6 */}
            <div>
              <label className={labelClass}>Customer Id</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_CustomerId || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>VPA</label>
              <input
                type="text"
                value={apiData?.VPA_Mis_VPA || ""}
                readOnly
                className={inputClass}
              />
            </div>
          </div>
        </div>


        {/*BACK &  NEXT BUTTON */}
        <div className="flex justify-between items-center gap-4 mt-2 mb-10 sm:mb-15">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-amber-400  text-gray-900 font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
