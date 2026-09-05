import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Banknote } from "lucide-react";
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
        <div className="pb-3 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl text-blue-900 font-semibold">
              Review Acquiring Bank Setup Details
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Review and verify the acquiring bank configuration details before proceeding.
          </p>
        </div>

        {/* ── Fee Setup ─────────────────────────────────────────────────── */}
        <div className="pt-3">
          <div className="">
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
        <div className="border-t border-gray-300 mt-5">
          <h2 className="text-[18px] text-[#5c5c5c] my-3">
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
            {/* Row 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Transaction Limit
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
                Daily Transaction Limit Status
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
                Application Mode
              </label>
              <input
                type="text"
                value={apiData?.VPA_Mis_AppMode || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>


            {/* Row 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per Transaction Limit
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
                Per Transaction Limit Status
              </label>
              <input
                type="text"
                value={apiData?.misPerTransactionLimitStatus || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Mode
              </label>
              <input
                type="text"
                value={apiData?.VPA_Mis_TranMode || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>


            {/* Row 3 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FIRC (Foreign Inward Remittance Certificate)
              </label>

              <div className="flex items-center gap-6 h-11">
                {["Yes", "No"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="radio"
                      checked={apiData?.VPA_Mis_FIRC === opt}
                      readOnly
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FIRC Frequency
              </label>
              <input
                type="text"
                value={apiData?.VPA_Mis_FIRCFrequency || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Association
              </label>
              <input
                type="text"
                value={apiData?.VPA_Mis_FuelAssociation || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>


            {/* Row 4 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Remark
              </label>
              <input
                type="text"
                value={apiData?.VPA_Mis_FuelRemark || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Charges
              </label>
              <input
                type="text"
                value={apiData?.VPA_Mis_CallCharges || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key
              </label>
              <input
                type="text"
                value={apiData?.VPA_Mis_SecretKey || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>


            {/* Row 5 */}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Merchant Reimbursement
              </label>
              <input
                type="text"
                value={apiData?.VPA_Mis_MerchantReimbursement || ""}
                readOnly
                className="w-full h-11 px-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
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

        {/*BACK &  NEXT BUTTON */}
        <div className="flex gap-4 mt-10 d-flex justify-between align-items-center">
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