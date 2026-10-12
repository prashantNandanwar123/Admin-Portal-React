import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useLocation } from "react-router-dom";
import { CircleDollarSign, Landmark, WalletCards, Settings2, ArrowRight, ArrowLeft } from "lucide-react";
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
      <div>
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[20px]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl sm:text-xl text-slate-800 font-semibold -mt-3">View Acquiring Bank Details
            </h2>
          </div>
          <p className="ml-15 text-sm text-slate-700 -mt-3"> view and manage the acquiring bank information linked to your account.
          </p>
        </div>

        {/* ── Fee Setup ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-4">
          <div className="">
            <h2 className="text-base font-semibold text-gray-900 uppercase pb-3 flex items-center gap-2 -mt-3">
              <span className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                <CircleDollarSign className="w-5 h-5 text-yellow-600" />
              </span>
              Fee Setup
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-7">
              {[
                { label: "One Time Fixed Fee", value: apiData?.FS_OneTimeFixedFee, },
                { label: "Statement Fee", value: apiData?.FS_StatementFee, },
                { label: "Terminal Fee", value: apiData?.FS_TerminalFee, },
                { label: "Minimum Usage (in Days)", value: apiData?.FS_MiniUsageDays, },
                { label: "Minimum Transaction Amount", value: apiData?.FS_MiniTranAmount, },
                { label: "Minimum Usage Fee", value: apiData?.FS_MiniUsageFee, },
                { label: "AMC Amount", value: apiData?.FS_AMCAmount, },
                { label: "Non Usage (in Days)", value: apiData?.FS_NonUsageDays, },
                { label: "Non Usage Fee", value: apiData?.FS_NonUsageFee, },
              ].map(({ label, value, required }, index) => (
                <div key={index}>
                  <label className={labelClass}>
                    {label}<span className="text-red-500 ml-1">*</span>
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
                  AMC Type<span className="text-red-500 ml-1">*</span>
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-5">
          <h2 className="text-base font-semibold text-gray-900 uppercase pb-3 flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-yellow-600" />
            </span>
            Settlement Setup
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">
            {/* Settlement Type */}
            <div>
              <label className={labelClass}>
                Settlement Type<span className="text-red-500 ml-1">*</span>
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
                Settlement Cycle (If Automated)<span className="text-red-500 ml-1">*</span>
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
                Payment By<span className="text-red-500 ml-1">*</span>
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
                Payment Advice<span className="text-red-500 ml-1">*</span>
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-5">
          <h2 className="text-base font-semibold text-gray-900 uppercase pb-3 flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
              <WalletCards className="w-4 h-4 text-yellow-600" />
            </span>
            Beneficiary Account Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-7">
            {[
              { label: "Beneficiary Account Name", value: apiData?.BAD_BeneficiaryAccountName, required: true, },
              { label: "Beneficiary Account No", value: apiData?.BAD_BeneficiaryAccountNo, required: true, },
              { label: "Beneficiary Bank Code", value: apiData?.BAD_BeneficiaryBankCode, required: true },
              { label: "Beneficiary Bank Name", value: apiData?.BAD_BeneficiaryBankName, required: true, },
              { label: "Beneficiary Branch Name", value: apiData?.BAD_BeneficiaryBranchName, },
              { label: "Beneficiary Branch Code", value: apiData?.BAD_BeneficiaryBranchCode, },
              { label: "IFSC Code", value: apiData?.BAD_IFSCCode, required: true, },
            ].map(({ label, value, required }, index) => (
              <div key={index}>
                <label className={labelClass}>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-yellow-600" />
            </span>
            <h2 className="text-base font-semibold text-gray-900 uppercase flex items-center gap-2">
              Miscellaneous
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-7">
            {/* Row 1 */}
            <div>
              <label className={labelClass}>Daily Transaction Limit<span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                value={apiData?.misTransactionLimit || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Daily Transaction Limit Status<span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                value={apiData?.misTransactionLimitStatus || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Transaction Currency Type<span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                value={apiData?.msCurrency || ""}
                readOnly
                className={inputClass}
              />
            </div>


            {/* Row 2 */}
            <div>
              <label className={labelClass}>Per Transaction Limit<span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                value={apiData?.misPerTransactionLimit || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Per Transaction Limit Status<span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                value={apiData?.misPerTransactionLimitStatus || ""}
                readOnly
                className={inputClass}
              />
            </div>

            {/* Row 4 */}
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
        <div className="flex justify-between items-center gap-4 mt-2 mb-10 sm:mb-15 mt-5">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-full"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-[#fec931] text-black font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
