import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { BadgeIndianRupee } from "lucide-react";

export default function VMSFFee({
  refId,
  data,
  setData,
  errors,
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

        console.log("API RESPONSE:", response);

        if (response?.respCode === 0) {

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
          }));
          setTableData(formattedData);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    fetchData();
  }, [refId]);

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <>

      <div className="m-3 h-full">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <BadgeIndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            </div>
            <h2 className="text-xl sm:text-2xl uppercase text-blue-900 font-extrabold">
              View MSF / Convenience Fee
            </h2>
          </div>
          <p className="text-sm text-blue-900 ml-13">
            MSF / Convenience Fee Form collects merchant service and convenience charge details for setup.
          </p>

          {/* ── Fee Details card ─────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">
              {/* Processor */}
              <div>
                <label className={labelClass}>
                  Acquirer Bank
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
                  Processor MID
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
                  Slab Upto
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
                  Effective From
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
                  Effective To
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
                  International Fixed
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
                  International Per
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
                  Domestic Onus Fixed
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
                  Domestic Onus Per
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
                  Domestic Offus Fixed
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
                  Domestic Offus Per
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
                  Enter GST in Percentage
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
                  Fee Type
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
                  Status
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
                  Sort Order
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
                  Per Transaction Limit
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
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-5 py-2 rounded-lg shadow-sm transition"
          >
            Next
          </button>
        </div>
      </div>

    </>
  );
}