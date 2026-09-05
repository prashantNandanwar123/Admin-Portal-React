import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { CreditCard } from "lucide-react";
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
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 shrink-0">
            <CreditCard size={18} />
          </span>

          <h2 className="text-2xl text-blue-900 font-semibold">
            Review Payment Type (UPI)
          </h2>
        </div>

        <p className="pb-4  text-sm text-blue-900 font-normal ml-13">
          Payment Type Form collects transaction method details for setup.
        </p>
        {/* UPI header */}
        <div className="bg-blue-500 text-white px-4 py-3 rounded-md mb-6 mt-5">
          <h2 className="text-lg font-semibold">UPI</h2>
        </div>
        {/* FORM SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Processor */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Processor
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
              Acquirer
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
              Merchant Name
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
              Effective Date
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
              Status
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
              Sort Order
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
              Per Transaction Limit
            </label>

            <input
              type="text"
              value=""
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
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
    </>
  );
}