import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { Calendar } from "lucide-react";
import { Percent, Layers, BadgeIndianRupee } from "lucide-react";

const tabs = [
  "UPI"
];

const initForm = {
  acquirerBank: "",
  processorMID: "",
  slabUpto: "",
  effectiveFrom: "",
  effectiveTo: "",
  internationalFixed: "",
  internationalPer: "",
  domesticOnusFixed: "",
  domesticOnusPer: "",
  domesticOffusFixed: "",
  domesticOffusPer: "",
  chargeType: "Both",
  enterGST: "",
  feeType: "MSF",
};

export default function NSFFee({
  data,
  setData,
  errors,
  handleNext,
  handleBack,
}) {

  const [activeTab, setActiveTab] = useState("UPI");
  const [form, setForm] = useState(initForm);
  const [tableData, setTableData] = useState([]);
  const [midList, setMidList] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showAddError, setShowAddError] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const fetchMIDList = async (AcqBankName) => {
    try {
      const response = await axiosInstance.post(
        `/getMSFUpiMID/${AcqBankName}`
      );
      const apiData =
        response?.data?.respData || response?.respData || {};
      // convert object → "key-value" string array
      const list = Object.entries(apiData || {}).map(
        ([key, value]) => `${key}-${value}`
      );
      setMidList(list);
    } catch (error) {
      setMidList([]);
    }
  };

  // Update field
  const u = (k, v) => {
    setForm((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  useEffect(() => {
    if (showAddError) {
      const timer = setTimeout(() => {
        setShowAddError(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAddError]);


  useEffect(() => {
    if (showSaveError) {
      const timer = setTimeout(() => {
        setShowSaveError(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaveError]);

  //  Add Row
  const handleAdd = () => {
    const requiredFields = [
      "acquirerBank",
      "processorMID",
      "slabUpto",
      "effectiveFrom",
      "effectiveTo",
      "internationalFixed",
      "internationalPer",
      "domesticOnusFixed",
      "domesticOnusPer",
      "domesticOffusFixed",
      "domesticOffusPer",
      "enterGST",
      "feeType",
    ];

    const isInvalid = requiredFields.some((key) => !form[key]);
    if (isInvalid) {
      setShowAddError(true);
      return;
    }
    setShowAddError(true);
    setShowSaveError(false);
    setTableData((prev) => [
      ...prev,
      { ...form, id: Date.now() },
    ]);
    setShowAddError(false);
    setForm(initForm);
  };

  // Remove Row
  const handleRemove = (index) => {
    const updatedRows =
      tableData.filter(
        (_, i) => i !== index
      );

    setTableData(updatedRows);
    toast.success("Removed Successfully");
  };

  //  SAVE API
  const saveMsfUPI = async () => {
    try {

      if (tableData.length === 0) {
        setShowSaveError(true);
        return;
      }
      setShowSaveError(false);
      //  MULTIPLE ROWS IN SINGLE PAYLOAD
      const payload = {
        ref_id: data?.refId,

        upiAcquirerBankName: tableData
          .map((row) => row.acquirerBank)
          .join(","),

        upiMID: tableData
          .map((row) => row.processorMID)
          .join(","),

        upiSlabUpto: tableData
          .map((row) => row.slabUpto)
          .join(","),

        upiEffectiveFrom: tableData
          .map((row) => row.effectiveFrom)
          .join(","),

        upiEffectiveTo: tableData
          .map((row) => row.effectiveTo)
          .join(","),

        upiInternationalFixed: tableData
          .map((row) => row.internationalFixed)
          .join(","),

        upiInternationalPer: tableData
          .map((row) => row.internationalPer)
          .join(","),

        upiDomesticOnusFixed: tableData
          .map((row) => row.domesticOnusFixed)
          .join(","),

        upiDomesticOnusper: tableData
          .map((row) => row.domesticOnusPer)
          .join(","),

        upiDomesticOffusFixed: tableData
          .map((row) => row.domesticOffusFixed)
          .join(","),

        upiDomesticOffusper: tableData
          .map((row) => row.domesticOffusPer)
          .join(","),

        upiChargeType: tableData
          .map((row) => row.chargeType)
          .join(","),

        upiFeeType: tableData
          .map((row) => row.feeType)
          .join(","),

        upiGstper: tableData
          .map((row) => row.enterGST)
          .join(","),
      };

      const response =
        await axiosInstance.post(
          "/saveMsfUPI",
          payload,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const resData = response;
      if (resData?.respCode === 0) {
        toast.success(resData?.respMsg)
        setData((prev) => ({
          ...prev,
          refId:
            resData?.respData?.ref_id ||
            prev.refId,
        }));

        handleNext();
      } else {
        if (
          typeof resData?.respData === "object"
        ) {
          Object.values(
            resData.respData
          ).forEach((msg) => {
            toast.error(msg);
          });

        } else {
          toast.error(resData?.respMsg);
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 bg-white";

  const labelClass =
    "block text-sm text-gray-700 mb-1";

  const req =
    <span className="text-red-500">*</span>;

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600">
          <BadgeIndianRupee size={18} />
        </span>
        <h2 className="text-xl sm:text-xl uppercase text-blue-900 font-bold">
          MSF / Convenience Fee
        </h2>
      </div>
      <p className="pl-12 text-sm text-blue-900 mb-4 pb-3">
        MSFFee form is used to configure UPI/MSF fee structure including domestic and international charges,
        slab-wise configuration, GST, and effective date ranges. You can add multiple fee slabs and save them in a single configuration.
      </p>
      {/* Tabs */}
      <div className="ml-2 flex overflow-x-auto whitespace-nowrap scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() =>
              setActiveTab(tab)
            }
            className={`px-4 sm:px-5 py-3 text-sm font-medium transition-colors shrink-0 ${activeTab === tab
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* FORM */}
      <div className="py-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-100 text-cyan-600 shrink-0">
              <Layers size={14} />
            </span>
            <h2 className="text-lg sm:text-xl text-gray-700 font-normal">
              {activeTab}
            </h2>
          </div>

          {/* ROW 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-4">
            <div>
              <label className={labelClass}>
                Acquirer Bank {req}
              </label>
              <select
                className={inputClass}
                value={form.acquirerBank}
                onChange={(e) => {
                  const value = e.target.value;

                  u("acquirerBank", value);
                  fetchMIDList(value);
                  u("processorMID", "");
                }}
              >
                <option value="">-- Select --</option>
                {data?.selectedAcquirer && (
                  <option value={data.selectedAcquirer}>
                    {data.selectedAcquirer}
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Processor MID {req}
              </label>
              <select
                className={inputClass}
                value={form.processorMID}
                onChange={(e) =>
                  u("processorMID", e.target.value)
                }
              >
                <option value="">-- Select --</option>
                {midList.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Slab Upto {req}
              </label>
              <input
                type="text"
                className={inputClass}
                value={form.slabUpto}
                maxLength={8}
                onChange={(e) => {
                  const value = e.target.value;
                  // allow only numbers
                  if (/^\d*$/.test(value)) {
                    u("slabUpto", value);
                  }
                }}
              />
            </div>

            <div>
              <label className={labelClass}>
                Effective From {req}
              </label>
              <input
                type="date"
                className={inputClass}
                value={form.effectiveFrom}
                onChange={(e) =>
                  u(
                    "effectiveFrom",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-4">
            <div>
              <label className={labelClass}>
                Effective To {req}
              </label>
              <input
                type="date"
                className={inputClass}
                value={form.effectiveTo}
                onChange={(e) =>
                  u(
                    "effectiveTo",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className={labelClass}>
                International Fixed {req}
              </label>
              <input
                type="text"
                className={inputClass}
                maxLength={3}
                value={form.internationalFixed}
                onChange={(e) => {
                  const value = e.target.value;
                  // allow only numbers (no decimals, no symbols)
                  if (/^\d*$/.test(value)) {
                    u("internationalFixed", value);
                  }
                }}
              />
            </div>
            <div>
              <label className={labelClass}>
                International Per(%){req}
              </label>
              <input
                type="text"
                className={inputClass}
                value={form.internationalPer}
                maxLength={6}
                onChange={(e) => {
                  let value = e.target.value;

                  // Allow only numbers and one dot
                  if (!/^\d*\.?\d*$/.test(value)) return;

                  // Allow empty
                  if (value === "") {
                    u("internationalPer", value);
                    return;
                  }

                  const num = parseFloat(value);

                  // Allow only 0 to 100
                  if (!isNaN(num) && num <= 100) {
                    u("internationalPer", value);
                  }
                }}
              />
            </div>

            <div>
              <label className={labelClass}>
                Domestic Onus Fixed {req}
              </label>
              <input
                type="text"
                className={inputClass}
                maxLength={3}
                value={form.domesticOnusFixed}
                onChange={(e) => {
                  const value = e.target.value;

                  // allow only digits 0–9
                  if (/^\d*$/.test(value)) {
                    u("domesticOnusFixed", value);
                  }
                }}
              />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-4">
            <div>
              <label className={labelClass}>
                Domestic Onus Per (%){req}
              </label>
              <input
                type="text"
                className={inputClass}
                value={form.domesticOnusPer}
                maxLength={6}
                onChange={(e) => {
                  let value = e.target.value;

                  // Allow only numbers and one dot
                  if (!/^\d*\.?\d*$/.test(value)) return;

                  // Allow empty
                  if (value === "") {
                    u("domesticOnusPer", value);
                    return;
                  }

                  const num = parseFloat(value);

                  // Allow only 0 to 100
                  if (!isNaN(num) && num <= 100) {
                    u("domesticOnusPer", value);
                  }
                }}
              />
            </div>

            <div>
              <label className={labelClass}>
                Domestic Offus Fixed {req}
              </label>
              <input
                type="text"
                className={inputClass}
                maxLength={3}
                value={form.domesticOffusFixed}
                onChange={(e) => {
                  const value = e.target.value;
                  // allow only digits 0–9
                  if (/^\d*$/.test(value)) {
                    u("domesticOffusFixed", value);
                  }
                }}
              />
            </div>

            <div>
              <label className={labelClass}>
                Domestic Offus Per (%) {req}
              </label>
              <input
                type="text"
                className={inputClass}
                value={form.domesticOffusPer}
                maxLength={6}
                onChange={(e) => {
                  let value = e.target.value;

                  // Allow only numbers and one dot
                  if (!/^\d*\.?\d*$/.test(value)) return;

                  // Allow empty
                  if (value === "") {
                    u("domesticOffusPer", value);
                    return;
                  }

                  const num = parseFloat(value);

                  // Allow only 0 to 100
                  if (!isNaN(num) && num <= 100) {
                    u("domesticOffusPer", value);
                  }
                }}
              />
            </div>
            <div>
              <label className={labelClass}>
                Charge Type
              </label>
              <select
                className={inputClass}
                value={form.chargeType}
                onChange={(e) =>
                  u(
                    "chargeType",
                    e.target.value
                  )
                }
              >
                <option>
                  Both
                </option>
                <option value="Whichever Higher">Whichever Higher</option>
                <option value="Whichever Lower">Whichever Lower</option>
              </select>
            </div>
          </div>
          {/* ROW 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
            <div>
              <label className={labelClass}>
                Enter GST in Percentage(%) {req}
              </label>
              <input
                type="text"
                className={inputClass}
                value={form.enterGST}
                maxLength={3}
                onChange={(e) => {
                  let value = e.target.value;
                  // allow only digits
                  if (!/^\d*$/.test(value)) return;
                  // allow empty
                  if (value === "") {
                    u("enterGST", value);
                    return;
                  }
                  const num = Number(value);
                  // allow only 0–100
                  if (num <= 100) {
                    u("enterGST", value);
                  }
                }}
              />
            </div>
            <div>
              <label className={labelClass}>
                Fee Type {req}
              </label>
              <select
                className={inputClass}
                value={form.feeType}
                onChange={(e) =>
                  u(
                    "feeType",
                    e.target.value
                  )
                }
              >
                <option>
                  MSF
                </option>
                <option>
                  MSF
                </option>
                <option>
                  Convenience
                </option>
              </select>
            </div>
          </div>
          {showAddError && (
            <div className="flex justify-center mb-4 mt-5 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded text-sm">
              <div className="text-center w-fit">
                Please fill the missing details in the above fields
                <br />
                --- OR ---
                <br />
                Fill in the correct details
              </div>
            </div>
          )}

          {/* ADD BUTTON */}
          <div className="mb-6">
            <div className="mb-6 flex justify-center">
              <button
                type="button"
                onClick={handleAdd}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-2 rounded w-full sm:w-auto"
              >
                ADD
              </button>
            </div>
          </div>
          {/* TABLE ERROR */}
          {showSaveError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4 text-sm flex items-center justify-center">
              Please add a row | Fill the mandatory fields
            </div>
          )}
          {/* TABLE */}
          {tableData.length > 0 && (
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[1100px] border border-gray-300 text-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="border p-2">Acquirer Bank</th>
                    <th className="border p-2">Processor MID</th>
                    <th className="border p-2">Slab Upto</th>
                    <th className="border p-2">Effective From</th>
                    <th className="border p-2">Effective To</th>
                    <th className="border p-2">International Fixed</th>
                    <th className="border p-2">International %</th>
                    <th className="border p-2">Domestic Onus Fixed</th>
                    <th className="border p-2">Domestic Onus %</th>
                    <th className="border p-2">Domestic Offus Fixed</th>
                    <th className="border p-2">Domestic Offus %</th>
                    <th className="border p-2">Charge Type</th>
                    <th className="border p-2">GST %</th>
                    <th className="border p-2">Fee Type</th>
                    <th className="border p-2">Remove</th>
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
                        <td className="border p-2">
                          <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="15" className="text-center py-4 text-gray-400">
                        No Records Added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full w-full sm:w-auto"
            >
              Back
            </button>
            <button
              type="button"
              onClick={saveMsfUPI}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
            >
              Save & Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}