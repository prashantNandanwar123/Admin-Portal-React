import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { BadgeIndianRupee, QrCode, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

export default function VMSFFee({
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
          `/viewMerchantMsfConvenience/${refId}`
        );

        if (response?.respCode === 0) {
          toast.success(response.respMsg);

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
            resellerCommission: item.recommission,
          }));

          setTableData(formattedData);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [refId]);

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <>
      <div>
        <div>
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[20px]">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500"></div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 text-yellow-600">
                <BadgeIndianRupee size={18} />
              </span>
              <h2 className="text-xl sm:text-xl text-slate-800 font-semibold -mt-3">
                View MSF / Convenience Fee
              </h2>
            </div>
            <p className="ml-13 text-sm text-slate-700 -mt-3">
              MSF / Convenience Fee Form collects merchant service and convenience charge details for setup.
            </p>
          </div>

          {/* ── Fee Details card ─────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-6">
            <div>
              <div className="bg-[#fec931] text-black px-4 py-3 rounded-md mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black">
                  <QrCode size={16} />
                </span>
                <h2 className="text-lg font-semibold">UPI</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">
                {/* Processor */}
                <div>
                  <label className={labelClass}>
                    Acquirer Bank<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                {/* Acquirer */}
                <div>
                  <label className={labelClass}>
                    Processor MID<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                {/* Merchant Name */}
                <div>
                  <label className={labelClass}>
                    Slab Upto<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Effective From<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Effective To<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    International Fixed<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    International Per<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Domestic Onus Fixed<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Domestic Onus Per<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Domestic Offus Fixed<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Domestic Offus Per<span className="text-red-500 ml-1">*</span>
                  </label>

                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Charge Type
                  </label>

                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Enter GST in Percentage<span className="text-red-500 ml-1">*</span>
                  </label>

                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Fee Type<span className="text-red-500 ml-1">*</span>
                  </label>

                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Reseller Commission in Per(%)<span className="text-red-500 ml-1">*</span>
                  </label>

                  <input
                    type="text"
                    value={""}
                    readOnly
                    className={inputClass}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-8 overflow-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 whitespace-nowrap">Acquirer Bank</th>
                <th className="border p-2 whitespace-nowrap">Processor MID</th>
                <th className="border p-2 whitespace-nowrap">Slab Upto</th>
                <th className="border p-2 whitespace-nowrap">Effective From</th>
                <th className="border p-2 whitespace-nowrap">Effective To</th>
                <th className="border p-2 whitespace-nowrap">International Fixed</th>
                <th className="border p-2 whitespace-nowrap">International Per</th>
                <th className="border p-2 whitespace-nowrap">Domestic Onus Fixed</th>
                <th className="border p-2 whitespace-nowrap">Domestic Onus Per</th>
                <th className="border p-2 whitespace-nowrap">Domestic Offus Fixed</th>
                <th className="border p-2 whitespace-nowrap">Domestic Offus Per</th>
                <th className="border p-2 whitespace-nowrap">Charge Type</th>
                <th className="border p-2 whitespace-nowrap">GST %</th>
                <th className="border p-2 whitespace-nowrap">Fee Type</th>
                <th className="border p-2 whitespace-nowrap">Reseller Commission %</th>
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
                    <td className="border p-2 text-center">{row.internationalFixed}</td>
                    <td className="border p-2 text-center">{row.internationalPer}</td>
                    <td className="border p-2 text-center">{row.domesticOnusFixed}</td>
                    <td className="border p-2 text-center">{row.domesticOnusPer}</td>
                    <td className="border p-2 text-center">{row.domesticOffusFixed}</td>
                    <td className="border p-2 text-center">{row.domesticOffusPer}</td>
                    <td className="border p-2">{row.chargeType}</td>
                    <td className="border p-2">{row.enterGST}</td>
                    <td className="border p-2">{row.feeType}</td>
                    <td className="border p-2 text-center">{row.resellerCommission}</td>

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
        <div className="flex gap-4 my-5 justify-between items-center">
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