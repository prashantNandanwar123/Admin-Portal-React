import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

export default function PUploadDocuments({
  refId,
  data,
  setData,
  errors,
  handleNext,
  handleBack,
}) {

  const [apiData, setApiData] = useState({});

  const checklistItems = [
    {
      label:
        "Valid licenses from local bodies / municipal corporation under shop act / VAT / Sales Tax Returns Challan",
      status: "validLicense1Status",
      remarks: "validLicense1Result",
      date: "validLicense1Date",
      file: "validLicense1upload",
    },
    {
      label: "Pan Card",
      status: "panCardStatus",
      remarks: "panCardResult",
      date: "panCardDate",
      file: "panCardupload",
    },
    {
      label:
        "Valid licenses from local bodies / municipal corporation under shop act / VAT / Sales Tax Returns Challan",
      status: "validLicense2Status",
      remarks: "validLicense2Result",
      date: "validLicense2Date",
      file: "validLicense2Upload",
    },
    {
      label:
        "Address Proof, Telephone Bill / Electricity Bill",
      status:
        "addressProofTelephoneElectricityBillStatus",
      remarks:
        "addressProofTelephoneElectricityBillResult",
      date:
        "addressProofTelephoneElectricityBillDate",
      file:
        "addressProofTelephoneElectricityBillupload",
    },
    {
      label:
        "Income Tax / Vat Tax / Sale Tax Returns",
      status: "incomeTaxStatus",
      remarks: "incomeTaxResult",
      date: "incomeTaxDate",
      file: "incomeTaxupload",
    },
    {
      label:
        "Statement of account for the last three months",
      status: "statementAccountStatus",
      remarks: "statementAccountResult",
      date: "statementAccountDate",
      file: "statementAccountUpload",
    },
    {
      label:
        "Existing POS terminal payment advice",
      status: "existingPOSStatus",
      remarks: "existingPOSResult",
      date: "existingPOSDate",
      file: "existingPOSUpload",
    },
    {
      label:
        "Merchant establishment for installation of POS",
      status: "mEstablishmentPOSStatus",
      remarks: "mEstablishmentPOSResult",
      date: "mEstablishmentPOSDate",
      file: "mEstablishmentPOSUpload",
    },
    {
      label:
        "Copy of license issued under shops and Establishment Act",
      status: "copyOfLicenseStatus",
      remarks: "copyOfLicenseResult",
      date: "copyOfLicenseDate",
      file: "copyOfLicenseUpload",
    },
    {
      label:
        "Identity proof - PAN Card, Passport, Driving License etc.",
      status: "identityProofStatus",
      remarks: "identityProofResult",
      date: "identityProofDate",
      file: "identityProofUpload",
    },
  ];

  useEffect(() => {
    if (!refId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `rMerchantUploadDocument/${refId}`
        );

        console.log("API RESPONSE:", response);

        if (response?.respCode === 0) {
          const res = response?.respData;
          setApiData(res || {});
        }
      } catch (err) {
        console.error("API ERROR:", err);
      }
    };

    fetchData();
  }, [refId]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 border-b border-gray-300  px-4 py-3">
        Uploaded Document
      </h2>    
      <p className="text-gray-600 mb-6">
        User can only view document data.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-3 text-left">
                Item
              </th>

              <th className="border px-4 py-3 text-center">
                Status
              </th>

              <th className="border px-4 py-3 text-left">
                Result / Remarks
              </th>

              <th className="border px-4 py-3 text-left">
                Date
              </th>

              <th className="border px-4 py-3 text-left">
                File Name
              </th>
            </tr>
          </thead>

          <tbody>
            {checklistItems.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50"
              >
                <td className="border px-4 py-3">
                  {item.label}
                </td>

                <td className="border px-4 py-3 text-center">
                  {apiData?.[item.status] || "-"}
                </td>

                <td className="border px-4 py-3">
                  {apiData?.[item.remarks] || "-"}
                </td>

                <td className="border px-4 py-3">
                  {apiData?.[item.date] || "-"}
                </td>

                <td className="border px-4 py-3">
                  {apiData?.[item.file] ? (
                    <a
                      href={apiData?.[item.file]}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View File
                    </a>
                  ) : (
                    "No File"
                  )}
                </td>
              </tr>
            ))}
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
          className="bg-orange-500 text-white px-6 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}