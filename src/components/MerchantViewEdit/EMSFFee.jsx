import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { Percent } from "lucide-react";

export default function EMSFFee({
  refId,
  data,
  setData,
  errors,
  handleNext,
  handleBack,
}) {

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

  const [tableData, setTableData] = useState([]);
  const [midList, setMidList] = useState([]);
  const [showAddError, setShowAddError] = useState(false);

  const [showSaveError, setShowSaveError] = useState(false);
  const [activeTab, setActiveTab] = useState("UPI");
  const [form, setForm] = useState(initForm);



  useEffect(() => {
    if (showAddError) {
      const timer = setTimeout(() => {
        setShowAddError(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAddError]);

  useEffect(() => {
    if (!refId) return;

    // This Api are fetching Data
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `rMerchantMsfConvenience/${refId}`
        );

        console.log("Api response:::----", response);
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
      } catch (err) {
        console.error("API ERROR:", err);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [refId]);

  // fetch Mid List
  const fetchMIDList = async (AcqBankName) => {
    try {
      const response =
        await axiosInstance.post(
          `/getMSFUpiMID/${AcqBankName}`
        );

      const apiData =
        response?.data?.respData ||
        response?.respData ||
        {};

      // convert object → "key-value" string array
      const list = Object.entries(
        apiData || {}
      ).map(
        ([key, value]) =>
          `${key}-${value}`
      );
      setMidList(list);
    } catch (error) {
      setMidList([]);
    }
  };

  // COMMON HANDLE CHANGE
  const handleChange = (
    field,
    value
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // FORM HANDLE CHANGE
  const u = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ADD ROW
  const handleAddRow = () => {

    // VALIDATION
    if (
      !form.acquirerBank ||
      !form.processorMID ||
      !form.slabUpto ||
      !form.effectiveFrom ||
      !form.effectiveTo ||
      !form.internationalFixed ||
      !form.internationalPer ||
      !form.domesticOnusFixed ||
      !form.domesticOnusPer ||
      !form.domesticOffusFixed ||
      !form.domesticOffusPer ||
      !form.chargeType ||
      !form.enterGST ||
      !form.feeType
    ) {
      setShowAddError(true);
      return;
    }

    // ADD DATA INTO TABLE
    setTableData((prev) => [
      ...prev,
      {
        ...form,
      },
    ]);

    // RESET FORM
    setForm(initForm);
    setShowAddError(false);
  };

  // DELETE ROW
  const handleDeleteRow = (
    index
  ) => {
    const updatedRows = [
      ...tableData,
    ];

    updatedRows.splice(index, 1);
    setTableData(updatedRows);
  };

  // HANDLE ROW CHANGE
  const handleRowChange = (
    index,
    field,
    value
  ) => {
    const updatedRows = [
      ...tableData,
    ];
    updatedRows[index][field] = value;
    setTableData(updatedRows);
  };

  // This Api Are Save Edited Data
  const handleSaveAndNext =
    async () => {
      try {

        if (
          tableData.length === 0
        ) {
          setShowSaveError(true);
          return;
        }
        setShowSaveError(false);

        const payload = {
          ref_id: refId,
          upiAcquirerBankName:
            tableData
              .map(
                (row) =>
                  row.acquirerBank
              )
              .join(","),

          upiMID: tableData
            .map(
              (row) =>
                row.processorMID
            )
            .join(","),

          upiSlabUpto:
            tableData
              .map(
                (row) =>
                  row.slabUpto
              )
              .join(","),

          upiEffectiveFrom:
            tableData
              .map(
                (row) =>
                  row.effectiveFrom
              )
              .join(","),

          upiEffectiveTo:
            tableData
              .map(
                (row) =>
                  row.effectiveTo
              )
              .join(","),

          upiInternationalFixed:
            tableData
              .map(
                (row) =>
                  row.internationalFixed
              )
              .join(","),

          upiInternationalPer:
            tableData
              .map(
                (row) =>
                  row.internationalPer
              )
              .join(","),

          upiDomesticOnusFixed:
            tableData
              .map(
                (row) =>
                  row.domesticOnusFixed
              )
              .join(","),

          upiDomesticOnusper:
            tableData
              .map(
                (row) =>
                  row.domesticOnusPer
              )
              .join(","),

          upiDomesticOffusFixed:
            tableData
              .map(
                (row) =>
                  row.domesticOffusFixed
              )
              .join(","),

          upiDomesticOffusper:
            tableData
              .map(
                (row) =>
                  row.domesticOffusPer
              )
              .join(","),

          upiChargeType:
            tableData
              .map(
                (row) =>
                  row.chargeType
              )
              .join(","),

          upiFeeType:
            tableData
              .map(
                (row) =>
                  row.feeType
              )
              .join(","),

          upiGstper:
            tableData
              .map(
                (row) =>
                  row.enterGST
              )
              .join(","),
        };

        const response =
          await axiosInstance.post(
            "/saveEditMsfConUpi",
            payload,
            {
              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          );

        const resData = response;
        if (
          resData?.respCode === 0
        ) {
          toast.success(resData?.respMsg);
          setData((prev) => ({
            ...prev,
            refId: resData?.respData?.ref_id || prev.refId,
          }));

        } else {
          if (
            typeof resData?.respData ===
            "object"
          ) {
            Object.values(
              resData.respData
            ).forEach((msg) => {
              toast.error(msg);
            });
          } else {
            toast.error(
              resData?.respMsg
            );
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
    <>
      <div>
        <div className="flex items-center gap-3 pt-3">
          <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5 text-yellow-600" />
          </div>
       <h2 className="text-xl text-blue-900 font-semibold">
            Edit MSF / Convenience Fee
          </h2>
        </div>
               <p className="ml-12 pb-1 text-sm text-blue-900">
          Configure and update the applicable MSF and convenience fee settings.
        </p>

        {/* ALL FIELDS */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-3">
            {/* Acquirer Bank */}
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
            {/* Processor MID */}
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
            {/* Slab Upto */}
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

                  if (/^\d*$/.test(value)) {
                    u("slabUpto", value);
                  }
                }}
              />
            </div>
            {/* Effective From */}
            <div>
              <label className={labelClass}>
                Effective From {req}
              </label>

              <input
                type="date"
                className={inputClass}
                value={form.effectiveFrom}
                onChange={(e) =>
                  u("effectiveFrom", e.target.value)
                }
              />
            </div>
            {/* Effective To */}
            <div>
              <label className={labelClass}>
                Effective To {req}
              </label>

              <input
                type="date"
                className={inputClass}
                value={form.effectiveTo}
                onChange={(e) =>
                  u("effectiveTo", e.target.value)
                }
              />
            </div>
            {/* International Fixed */}
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

                  if (/^\d*$/.test(value)) {
                    u("internationalFixed", value);
                  }
                }}
              />
            </div>
            {/* International Per */}
            <div>
              <label className={labelClass}>
                International Per(%) {req}
              </label>

              <input
                type="text"
                className={inputClass}
                value={form.internationalPer}
                maxLength={6}
                onChange={(e) => {
                  let value = e.target.value;

                  if (!/^\d*\.?\d*$/.test(value)) return;

                  if (value === "") {
                    u("internationalPer", value);
                    return;
                  }

                  const num = parseFloat(value);

                  if (!isNaN(num) && num <= 100) {
                    u("internationalPer", value);
                  }
                }}
              />
            </div>

            {/* Domestic Onus Fixed */}
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

                  if (/^\d*$/.test(value)) {
                    u("domesticOnusFixed", value);
                  }
                }}
              />
            </div>

            {/* Domestic Onus Per */}
            <div>
              <label className={labelClass}>
                Domestic Onus Per (%) {req}
              </label>

              <input
                type="text"
                className={inputClass}
                value={form.domesticOnusPer}
                maxLength={6}
                onChange={(e) => {
                  let value = e.target.value;

                  if (!/^\d*\.?\d*$/.test(value)) return;

                  if (value === "") {
                    u("domesticOnusPer", value);
                    return;
                  }

                  const num = parseFloat(value);

                  if (!isNaN(num) && num <= 100) {
                    u("domesticOnusPer", value);
                  }
                }}
              />
            </div>
            {/* Domestic Offus Fixed */}
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

                  if (/^\d*$/.test(value)) {
                    u("domesticOffusFixed", value);
                  }
                }}
              />
            </div>

            {/* Domestic Offus Per */}
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

                  if (!/^\d*\.?\d*$/.test(value)) return;

                  if (value === "") {
                    u("domesticOffusPer", value);
                    return;
                  }

                  const num = parseFloat(value);

                  if (!isNaN(num) && num <= 100) {
                    u("domesticOffusPer", value);
                  }
                }}
              />
            </div>

            {/* Charge Type */}
            <div>
              <label className={labelClass}>
                Charge Type
              </label>

              <select
                className={inputClass}
                value={form.chargeType}
                onChange={(e) =>
                  u("chargeType", e.target.value)
                }
              >
                <option value="Both">Both</option>
                <option value="Whichever Higher">
                  Whichever Higher
                </option>
                <option value="Whichever Lower">
                  Whichever Lower
                </option>
              </select>
            </div>

            {/* GST */}
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

                  if (!/^\d*$/.test(value)) return;

                  if (value === "") {
                    u("enterGST", value);
                    return;
                  }

                  const num = Number(value);

                  if (num <= 100) {
                    u("enterGST", value);
                  }
                }}
              />
            </div>

            {/* Fee Type */}
            <div>
              <label className={labelClass}>
                Fee Type {req}
              </label>

              <select
                className={inputClass}
                value={form.feeType}
                onChange={(e) =>
                  u("feeType", e.target.value)
                }
              >
                <option value="MSF">MSF</option>
                <option value="Convenience">
                  Convenience
                </option>
              </select>
            </div>

          </div>
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


      {/* ADD ROW BUTTON */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-5">
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={handleAddRow}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Row
          </button>
        </div>

        {/* TABLE */}
        <div className="mt-4 overflow-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">
                  Acquirer Bank
                </th>
                <th className="border p-2">
                  Processor MID
                </th>
                <th className="border p-2">
                  Slab Upto
                </th>
                <th className="border p-2">
                  Effective From
                </th>
                <th className="border p-2">
                  Effective To
                </th>
                <th className="border p-2">
                  International Fixed
                </th>
                <th className="border p-2">
                  International Per
                </th>
                <th className="border p-2">
                  Domestic Onus Fixed
                </th>
                <th className="border p-2">
                  Domestic Onus Per
                </th>
                <th className="border p-2">
                  Domestic Offus Fixed
                </th>
                <th className="border p-2">
                  Domestic Offus Per
                </th>
                <th className="border p-2">
                  Charge Type
                </th>
                <th className="border p-2">
                  GST %
                </th>
                <th className="border p-2">
                  Fee Type
                </th>
                <th className="border p-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.length >
                0 ? (
                tableData.map(
                  (row, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.acquirerBank
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "acquirerBank",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.processorMID
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "processorMID",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.slabUpto
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "slabUpto",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.effectiveFrom
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "effectiveFrom",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.effectiveTo
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "effectiveTo",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.internationalFixed
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "internationalFixed",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.internationalPer
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "internationalPer",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.domesticOnusFixed
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "domesticOnusFixed",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.domesticOnusPer
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "domesticOnusPer",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.domesticOffusFixed
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "domesticOffusFixed",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.domesticOffusPer
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "domesticOffusPer",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.chargeType
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "chargeType",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.enterGST
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "enterGST",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="text"
                          value={
                            row.feeType
                          }
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "feeType",
                              e.target.value
                            )
                          }
                          className="w-full outline-none"
                        />
                      </td>

                      <td className="border p-2 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteRow(
                              index
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="15"
                    className="text-center py-4 text-gray-400"
                  >
                    No Records Added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSaveAndNext}
            className="bg-green-500 hover:bg-green-500 text-white px-6 py-2 rounded"
          >
            Update
          </button>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNext}
  className="inline-flex items-center gap-2 bg-amber-400  text-gray-900 font-semibold px-6 py-2.5 rounded-full shadow-sm transition"          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}