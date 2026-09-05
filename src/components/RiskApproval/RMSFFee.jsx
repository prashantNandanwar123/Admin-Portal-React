import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { BadgeIndianRupee } from "lucide-react";
import { toast } from "react-toastify";

export default function RMSFFee({
  refId,
  handleNext,
  handleBack
}) {

  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    if (!refId) return;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `rMerchantMsfConvenience/${refId}`
        );

        if (response?.respCode === 0) {
          toast.success(response?.respMsg);

          const formattedData = (response?.respData || []).map((item) => ({
            acquirerBank: item.upiAcquirerBankName,
            processorMID: item.upiMID,
            slabUpto: item.upiSlabUpto,
            effectiveFrom: item.upiEffectiveFrom,
            effectiveTo: item.upiEffectiveTo,
            internationalFixed: item.upiInternationalFixed,
            internationalPer: item.upiInternationalPer,
            domesticOnusFixed: item.upiDomesticOnusFixed,
            domesticOnusPer: item.upiDomesticOnusper,
            domesticOffusFixed: item.upiDomesticOffusFixed,
            domesticOffusPer: item.upiDomesticOffusper,
            chargeType: item.upiChargeType,
            enterGST: item.upiGstper,
            feeType: item.upiFeeType,
            resellerCommission: item.resellerCommission,
          }));

          setTableData(formattedData);
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
        <div className="mb-5">
          {/* Main Heading */}
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 shrink-0">
              <BadgeIndianRupee size={18} />
            </span>
            <h2 className="text-2xl text-blue-900 font-semibold">
              Review MSF / Convenience Fee
            </h2>
          </div>

          {/* Subheading */}
          <p className="ml-12 pb-4 text-sm text-blue-900 font-normal">
            Review and verify the merchant MSF and convenience fee configuration.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {/* Processor */}
          <div>
            <label className="block text-sm text-gray-700 my-1">
              Acquirer Bank
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Acquirer */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Processor MID
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Merchant Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Slab Upto
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Effective From
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Effective To
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              International Fixed
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              International Per
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Domestic Onus Fixed
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Domestic Onus Per
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Domestic Offus Fixed
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Domestic Offus Per
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Charge Type
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Enter GST in Percentage
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Fee Type
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Status
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Sort Order
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Per Transaction Limit
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Reseller Commission
            </label>

            <input
              type="text"
              value={""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-8 overflow-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Acquirer Bank</th>
                <th className="border p-2">Processor MID</th>
                <th className="border p-2">Slab Upto</th>
                <th className="border p-2">Effective From</th>
                <th className="border p-2">Effective To</th>
                <th className="border p-2">International Fixed</th>
                <th className="border p-2">International Per</th>
                <th className="border p-2">Domestic Onus Fixed</th>
                <th className="border p-2">Domestic Onus Per</th>
                <th className="border p-2">Domestic Offus Fixed</th>
                <th className="border p-2">Domestic Offus Per</th>
                <th className="border p-2">Charge Type</th>
                <th className="border p-2">GST %</th>
                <th className="border p-2">Fee Type</th>
                <th className="border p-2">Reseller Commission</th>

              </tr>
            </thead>

            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="border p-2">{row.acquirerBank}</td>
                    <td className="border p-2">{row.processorMID}</td>
                    <td className="border p-2">{row.slabUpto}</td>
                    <td className="border p-2">{row.effectiveFrom}</td>
                    <td className="border p-2">{row.effectiveTo}</td>
                    <td className="border p-2">{row.internationalFixed}</td>
                    <td className="border p-2">{row.internationalPer}</td>
                    <td className="border p-2">{row.domesticOnusFixed}</td>
                    <td className="border p-2">{row.domesticOnusPer}</td>
                    <td className="border p-2">{row.domesticOffusFixed}</td>
                    <td className="border p-2">{row.domesticOffusPer}</td>
                    <td className="border p-2">{row.chargeType}</td>
                    <td className="border p-2">{row.enterGST}</td>
                    <td className="border p-2">{row.feeType}</td>
                    <td className="border p-2">{row.feeType}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="14"
                    className="text-center py-4 text-gray-400"
                  >
                    No Records Added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BACK & NEXT BUTTON */}
        <div className="flex gap-4 mt-10 justify-between items-center">
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