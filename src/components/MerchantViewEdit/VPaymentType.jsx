import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { QrCode, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";


export default function VPaymentType({
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
          `viewMerchantPaymentType/${refId}`
        );
        if (response?.respCode === 0) {
          toast.success(response.respMsg);
          setApiData(response?.respData || {});
        } else {
          toast.error(response?.respMsg);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [refId]);

  // Date formatter
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";


  return (
    <div className="m-1">
      <div>
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[20px]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500"></div>
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 text-yellow-600">
              <QrCode size={18} />
            </span>
            <h2 className="text-xl sm:text-xl text-slate-800 font-semibold -mt-3">
              View Payment Type Form(UPI)
            </h2>
          </div>
          <p className="ml-13 text-sm text-slate-700 -mt-3">
            Payment Type Form collects transaction method details for setup.
          </p>
        </div>

        {/* ── Payment Type card ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-5">
          {/* UPI header */}
          <div className="bg-[#fec931] text-black px-4 py-3 rounded-md mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black">
              <QrCode size={16} />
            </span>
            <h2 className="text-lg font-semibold">UPI</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-7">
            {/* Processor */}
            <div>
              <label className={labelClass}>
                Processor<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            {/* Acquirer */}
            <div>
              <label className={labelClass}>
                Acquirer<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            {/* Merchant Name */}
            <div>
              <label className={labelClass}>
                Merchant Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Effective Date<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Status<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Sort Order<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Per Transaction Limit<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className={inputClass}
              />
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Processor</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Acquirer</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Merchant Name</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Status</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Sort</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Limit</th>
                  <th className="p-3 text-left font-medium text-gray-600 border-b border-gray-200">Date</th>
                </tr>
              </thead>

              <tbody>
                <tr className="bg-white">
                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiProcessor || "-"}
                  </td>
                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiType || "-"}
                  </td>
                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiMerchant || "-"}
                  </td>
                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiStatus || "-"}
                  </td>

                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiSortOrder || "-"}
                  </td>

                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {apiData?.upiPerTxnLimit || "-"}
                  </td>

                  <td className="p-3 text-gray-700 border-b border-gray-100">
                    {formatDate(apiData?.upiEffectiveDate) || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*BACK &  NEXT BUTTON */}
      <div className="flex justify-between items-center gap-4 mt-8 mb-10 sm:mb-15">
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
  );
}
