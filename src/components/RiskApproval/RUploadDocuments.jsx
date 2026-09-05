import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

export default function RUploadDocuments({
  refId, 
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
      file: "validLicense1FileName",
    },
    {
      label: "Pan Card",
      status: "panCardStatus",
      remarks: "panCardResult",
      date: "panCardDate",
      file: "panCardpathFileName",
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
        "addressProofTelephoneElectricityBillpathFileName",
    },
    {
      label:
        "Income Tax / Vat Tax / Sale Tax Returns",
      status: "incomeTaxStatus",
      remarks: "incomeTaxResult",
      date: "incomeTaxDate",
      file: "incomeTaxPathFileName",
    },
    {
      label:
        "Statement of account for the last three months",
      status: "statementAccountStatus",
      remarks: "statementAccountResult",
      date: "statementAccountDate",
      file: "statementAccountPathFileName",
    },
    {
      label:
        "Existing POS terminal payment advice",
      status: "existingPOSStatus",
      remarks: "existingPOSResult",
      date: "existingPOSDate",
      file: "existingPOSPathFileName",
    },
    {
      label:
        "Merchant establishment for installation of POS",
      status: "mEstablishmentPOSStatus",
      remarks: "mEstablishmentPOSResult",
      date: "mEstablishmentPOSDate",
      file: "mEstablishmentPOSPathFileName",
    },
    {
      label:
        "Copy of license issued under shops and Establishment Act",
      status: "copyOfLicenseStatus",
      remarks: "copyOfLicenseResult",
      date: "copyOfLicenseDate",
      file: "copyOfLicensePathFileName",
    },
    {
      label:
        "Identity proof - PAN Card, Passport, Driving License etc.",
      status: "identityProofStatus",
      remarks: "identityProofResult",
      date: "identityProofDate",
      file: "identityProofPathFileName",
    },
  ];


  useEffect(() => {
    if (!refId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `rMerchantUploadDocument/${refId}`
        );

        if (response?.respCode === 0) {
          const res = response?.respData;
          setApiData(res || {});
        }
      } catch (error) {
        toast.error(error);
      }
    };

    fetchData();
  }, [refId]);

  // Document File Api
  const viewFile = async (fileName) => {
    try {
      const formData = new FormData();
      formData.append("refId", refId);
      formData.append("fileName", fileName);

      const response = await axiosInstance.post(
        "/meDownloadDocs",
        formData,
        {
          responseType: "blob",
        }
      );
      console.log("blob file", response);
      const blobUrl = URL.createObjectURL(response);
      window.open(blobUrl, "_blank");

      // Optional: free memory after some time
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 5000);

    } catch (error) {
      toast.error(error);
    }
  };


  return (
    <div>
      <h2 className="text-2xl uppercase pb-3 text-blue-900 font-extrabold border-b border-gray-300 py-3">
        Review Uploaded Document
      </h2>
      <p className="text-gray-600 my-6">
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
                    <button
                      onClick={() => viewFile(apiData[item.file])}

                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View File
                    </button>
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