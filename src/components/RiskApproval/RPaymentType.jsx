import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { QrCode, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

export default function RPaymentType({
  refId,
  handleNext,
  handleBack,
}) {
  const [apiData, setApiData] = useState({});

  useEffect(() => {
    if (!refId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `rMerchantPaymentType/${refId}`
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

  // Date formatter
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <>
      <div>
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[20px]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500"></div>
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 text-yellow-600">
              <QrCode size={18} />
            </span>
            <h2 className="text-xl sm:text-xl text-slate-800 font-semibold -mt-2">
              Review Payment Type Form(UPI)
            </h2>
          </div>
          <p className="ml-12 text-sm text-slate-500 font-normal -mt-2">
            Payment Type Form collects transaction method details for setup.
          </p>
        </div>

        {/* UPI header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pb-4 mt-5">
          <div className="bg-[#fec931] text-black px-4 py-2 rounded-md my-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black">
              <QrCode size={16} />
            </span>
            <h2 className="text-lg font-semibold">UPI</h2>
          </div>

          {/* FORM SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Processor<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Acquirer */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Acquirer<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Merchant Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Merchant Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Effective Date */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Effective Date<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            {/* Status */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Status<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Sort Order<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Transaction Limit */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Per Transaction Limit<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value=""
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
          </div>
        </div>


        {/* TABLE SECTION */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Processor</th>
                <th className="border p-2">Acquirer</th>
                <th className="border p-2">Merchant Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Sort</th>
                <th className="border p-2">Limit</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-2">
                  {apiData?.upiProcessor || "-"}
                </td>

                <td className="border p-2">
                  {apiData?.upiType || "-"}
                </td>

                <td className="border p-2">
                  {apiData?.upiMerchant || "-"}
                </td>

                <td className="border p-2">
                  {apiData?.upiStatus || "-"}
                </td>

                <td className="border p-2">
                  {apiData?.upiSortOrder || "-"}
                </td>

                <td className="border p-2">
                  {apiData?.upiPerTxnLimit || "-"}
                </td>

                <td className="border p-2">
                  {formatDate(apiData?.upiEffectiveDate) || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* BACK & NEXT BUTTONS */}
      <div className="flex justify-between items-center gap-4 mt-10">
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
    </>
  );
}