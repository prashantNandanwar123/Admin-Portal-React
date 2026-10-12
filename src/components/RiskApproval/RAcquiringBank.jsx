import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Landmark, ArrowRight, ArrowLeft, ReceiptIndianRupee, WalletCards, Settings2 } from "lucide-react";
import { toast } from "react-toastify";

export default function RRAcquiringBank({
  refId,
  handleNext,
  handleBack
}) {

  const [apiData, setApiData] = useState({});

  useEffect(() => {
    if (!refId) return;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `/rMerchantAcquiringBank/${refId}`
        );
        if (response?.respCode === 0) {
          toast.success(response?.respMsg);
          setApiData(response?.respData || {});
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [refId]);

  return (
    <>
      <div>
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[20px]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl sm:text-xl text-slate-800 font-medium -mt-2">
              Review Acquiring Bank Setup Details
            </h2>
          </div>
          <p className="ml-14 text-sm text-slate-500 font-normal -mt-3">
            Review and verify the acquiring bank configuration details before proceeding.
          </p>
        </div>

        {/* ── Fee Setup ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pb-4 mt-5">
          <div className="pt-3">
            <div className="">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
                  <ReceiptIndianRupee size={15} />
                </span>
                <h2 className="text-md font-semibold text-gray-900 uppercase"> Fee Setup
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-5">
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
                ].map(({ label, value, }, index) => (
                  <div key={index}>
                    <label className="block text-[14px] font-semibold text-gray-700 mb-2">
                      {label}<span className="text-red-500 ml-1">*</span>
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
                    AMC Type<span className="text-red-500 ml-1">*</span>
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
        </div>

        {/* ── Settlement Setup ──────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pb-4 mt-5">
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
                <Landmark size={15} />
              </span>
              <h2 className="text-md font-semibold text-gray-900 uppercase">Settlement Setup</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-7 gap-y-5">
              {/* Settlement Type */}
              <div>
                <label className="block text-[14px] font-semibold text-gray-700 mb-2">
                  Settlement Type<span className="text-red-500 ml-1">*</span>
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
                <label className="block text-[14px] font-semibold text-gray-700 mb-2">
                  Settlement Cycle (If Automated)<span className="text-red-500 ml-1">*</span>
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
                <label className="block text-[14px] font-semibold text-gray-700 mb-2">
                  Payment By<span className="text-red-500 ml-1">*</span>
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
                <label className="block text-[14px] font-semibold text-gray-700 mb-2">
                  Payment Advice<span className="text-red-500 ml-1">*</span>
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
        </div>

        {/* ── Beneficiary Account Details ───────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pb-4 mt-5">
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
                <WalletCards size={15} />
              </span>
              <h2 className="text-md font-semibold text-gray-900 uppercase"> Beneficiary Account Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Beneficiary Account Name", value: apiData?.BAD_BeneficiaryAccountName, },
                { label: "Beneficiary Account No", value: apiData?.BAD_BeneficiaryAccountNo, },
                { label: "Beneficiary Bank Code", value: apiData?.BAD_BeneficiaryBankCode, },
                { label: "Beneficiary Bank Name", value: apiData?.BAD_BeneficiaryBankName, },
                { label: "Beneficiary Branch Name", value: apiData?.BAD_BeneficiaryBranchName, },
                { label: "Beneficiary Branch Code", value: apiData?.BAD_BeneficiaryBranchCode, },
                { label: "IFSC Code", value: apiData?.BAD_IFSCCode, },
              ].map(({ label, value, }, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}<span className="text-red-500 ml-1">*</span>
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
        </div>

        {/* ── Miscellaneous ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pb-4 mt-5">
          <div className="pt-4 mt-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
                <Settings2 size={15} />
              </span>
              <h2 className="text-md font-semibold text-gray-900 uppercase"> Miscellaneous </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Transaction Limit<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={apiData?.misTransactionLimit || ""}
                  readOnly
                  className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Transaction Limit Status<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={apiData?.misTransactionLimitStatus || ""}
                  readOnly
                  className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Currency Type<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={apiData?.msCurrency || ""}
                  readOnly
                  className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>


              {/* Row 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Per Transaction Limit<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={apiData?.misPerTransactionLimit || ""}
                  readOnly
                  className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Per Transaction Limit Status<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={apiData?.misPerTransactionLimitStatus || ""}
                  readOnly
                  className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>

              {/* Row 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Required
                </label>

                <div className="flex items-center gap-6 h-11">
                  {["Yes", "No"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="radio"
                        checked={apiData?.VPA_Mis_DocumentRequired === opt}
                        readOnly
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Pending
                </label>

                <div className="flex items-center gap-6 h-11">
                  {["Yes", "No"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="radio"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Id
                </label>
                <input
                  type="text"
                  value={apiData?.VPA_Mis_CustomerId || ""}
                  readOnly
                  className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VPA
                </label>
                <input
                  type="text"
                  value={apiData?.VPA_Mis_VPA || ""}
                  readOnly
                  className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
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
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-full"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-[#fec931] font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}