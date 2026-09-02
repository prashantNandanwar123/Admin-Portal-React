import React, { useState, useRef } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { X, UploadCloud } from "lucide-react";

export default function UploadDocument({
  data,
  setData,
  handleNext,
  handleBack,
}) {

  const checklistItems = [
    "Valid licenses from local bodies / municipal corporation under shop act / VAT / Sales Tax Returns Challan",
    "Pan Card",
    "Address Proof, Telephone Bill / Electricity Bill",
    "Income Tax / Vat Tax / Sale Tax Returns",
    "Statement of account for the last three months",
    "Existing POS terminal payment advice",
    "Merchant establishment for installation of POS",
    "Copy of license issued under shops and Establishment Act",
    "Identity proof - PAN Card, Passport, Driving License etc.",
  ];

  const fileRefs = useRef([]);
  const [documents, setDocuments] = useState(

    checklistItems.map((item) => ({
      item,
      status: "",
      remarks: "",
      date: "",
      file: null,
    }))

  );

  // ---- HANDLE CHANGE -----
  const handleChange = (
    index,
    field,
    value
  ) => {

    const updated = [...documents];
    updated[index][field] = value;
    setDocuments(updated);
  };

  // ---- REMOVE FILE ----------
  const removeFile = (index) => {
    const updated = [...documents];
    updated[index] = {
      ...updated[index],
      file: null,
    };
    setDocuments(updated);
    if (fileRefs.current[index]) {
      fileRefs.current[index].value = "";
    }
  };

  // ================= SAVE API ================
  const uploadMeDocuments = async () => {
    try {
      if (!validateDocuments()) return;
      const formData = new FormData();
      formData.append(
        "ref_id",
        data?.refId || ""
      );

      // ================= VALID LICENSE 1 =================
      formData.append(
        "validLicense1Status",
        documents[0].status
      );

      formData.append(
        "validLicense1Result",
        documents[0].remarks
      );

      formData.append(
        "validLicense1Date",
        documents[0].date
      );

      if (documents[0].file) {

        formData.append(
          "validLicense1upload",
          documents[0].file
        );
      }

      // PAN CARD =================
      formData.append(
        "panCardStatus",
        documents[1].status
      );

      formData.append(
        "panCardResult",
        documents[1].remarks
      );

      formData.append(
        "panCardDate",
        documents[1].date
      );

      if (documents[1].file) {

        formData.append(
          "panCardupload",
          documents[1].file
        );
      }
      // ================= ADDRESS PROOF =================

      formData.append(
        "addressProofTelephoneElectricityBillStatus",
        documents[2].status
      );

      formData.append(
        "addressProofTelephoneElectricityBillResult",
        documents[2].remarks
      );

      formData.append(
        "addressProofTelephoneElectricityBillDate",
        documents[2].date
      );

      if (documents[2].file) {

        formData.append(
          "addressProofTelephoneElectricityBillupload",
          documents[2].file
        );
      }

      // ================= INCOME TAX =================

      formData.append(
        "incomeTaxStatus",
        documents[3].status
      );

      formData.append(
        "incomeTaxResult",
        documents[3].remarks
      );

      formData.append(
        "incomeTaxDate",
        documents[3].date
      );

      if (documents[3].file) {

        formData.append(
          "incomeTaxupload",
          documents[3].file
        );
      }

      // ================= STATEMENT ACCOUNT =================

      formData.append(
        "statementAccountStatus",
        documents[4].status
      );

      formData.append(
        "statementAccountResult",
        documents[4].remarks
      );

      formData.append(
        "statementAccountDate",
        documents[4].date
      );

      if (documents[4].file) {

        formData.append(
          "statementAccountUpload",
          documents[4].file
        );
      }

      // ================= EXISTING POS =================

      formData.append(
        "existingPOSStatus",
        documents[5].status
      );

      formData.append(
        "existingPOSResult",
        documents[5].remarks
      );

      formData.append(
        "existingPOSDate",
        documents[5].date
      );

      if (documents[5].file) {

        formData.append(
          "existingPOSUpload",
          documents[5].file
        );
      }

      // ================= MERCHANT ESTABLISHMENT POS =================

      formData.append(
        "mEstablishmentPOSStatus",
        documents[6].status
      );

      formData.append(
        "mEstablishmentPOSResult",
        documents[6].remarks
      );

      formData.append(
        "mEstablishmentPOSDate",
        documents[6].date
      );

      if (documents[6].file) {

        formData.append(
          "mEstablishmentPOSUpload",
          documents[6].file
        );
      }

      // ================= COPY OF LICENSE =================

      formData.append(
        "copyOfLicenseStatus",
        documents[7].status
      );

      formData.append(
        "copyOfLicenseResult",
        documents[7].remarks
      );

      formData.append(
        "copyOfLicenseDate",
        documents[7].date
      );

      if (documents[7].file) {

        formData.append(
          "copyOfLicenseUpload",
          documents[7].file
        );
      }

      // ================= IDENTITY PROOF =================

      formData.append(
        "identityProofStatus",
        documents[8].status
      );

      formData.append(
        "identityProofResult",
        documents[8].remarks
      );

      formData.append(
        "identityProofDate",
        documents[8].date
      );

      if (documents[8].file) {
        formData.append(
          "identityProofUpload",
          documents[8].file
        );
      }
      const response =
        await axiosInstance.post(
          "/uploadMeDocuments",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      const resData = response;
      if (resData?.respCode === 0) {
        toast.success(resData?.respMsg);
        setData((prev) => ({
          ...prev,
          refId:
            resData?.respData?.ref_id ||
            prev.refId,
        }));

        handleNext();
      } else {
        toast.error(resData?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const validateDocuments = () => {
    for (let doc of documents) {

      if (!doc.status) {
        toast.error(`Please select status for: ${doc.item}`);
        return false;
      }

      if (!doc.remarks) {
        toast.error(`Please enter remarks for: ${doc.item}`);
        return false;
      }

      if (!doc.date) {
        toast.error(`Please select date for: ${doc.item}`);
        return false;
      }
      //  FILE ONLY REQUIRED WHEN YES
      if (doc.status === "Yes" && !doc.file) {
        toast.error(`Please upload file for: ${doc.item}`);
        return false;
      }
    }
    return true;
  };

  // Date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  return (

    <form onSubmit={(e) => {
      e.preventDefault();
      uploadMeDocuments();
    }}>
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-blue-600 shrink-0">
          <UploadCloud size={16} />
        </span>
        <h2 className="text-xl sm:text-2xl uppercase text-blue-900 font-bold">
          Upload Document
        </h2>
      </div>

      <p className="ml-12 text-gray-600 mb-6">
        This step will ensure faster verification
        of your company and promoters leading to
        a faster approval.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="min-w-[900px] w-full text-sm border-separate border-spacing-0">
            <thead className="bg-gray-50/70">
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap text-gray-600 font-semibold border border-gray-100">
                  Item
                </th>
                <th className="px-4 py-3 text-center whitespace-nowrap text-gray-600 font-semibold border border-gray-100">
                  Status
                </th>
                <th className="px-4 py-3 whitespace-nowrap text-gray-600 font-semibold border border-gray-100">
                  Remarks
                </th>
                <th className="px-4 py-3 whitespace-nowrap text-gray-600 font-semibold border border-gray-100">
                  Date
                </th>
                <th className="px-4 py-3 whitespace-nowrap text-gray-600 font-semibold border border-gray-100">
                  Upload
                </th>
                <th className="px-4 py-3 whitespace-nowrap text-gray-600 font-semibold border border-gray-100">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap border border-gray-100">
                    {doc.item} <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-4 border border-gray-100">
                    <div className="flex items-center justify-center gap-4">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`status-${index}`}
                          required
                          checked={doc.status === "Yes"}
                          onChange={() =>
                            handleChange(index, "status", "Yes")
                          }
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`status-${index}`}
                          checked={doc.status === "No"}
                          required
                          onChange={() => {
                            handleChange(index, "status", "No");
                            handleChange(index, "file", null);
                          }}
                        />
                        No
                      </label>
                    </div>
                  </td>

                  <td className="px-4 py-4 border border-gray-100">
                    <input
                      type="text"
                      value={doc.remarks}
                      placeholder="Enter remarks"
                      required
                      onChange={(e) =>
                        handleChange(index, "remarks", e.target.value)
                      }
                      className="w-full bg-gray-100 rounded px-3 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-4 border border-gray-100">
                    <input
                      type="date"
                      value={doc.date}
                      required
                      onChange={(e) =>
                        handleChange(index, "date", e.target.value)
                      }
                      className="w-full bg-gray-100 rounded px-3 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-4 border border-gray-100">
                    <input
                      ref={(el) => (fileRefs.current[index] = el)}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      required
                      disabled={doc.status !== "Yes"}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        handleChange(index, "file", file);
                      }}
                      className={`
                          block w-full text-sm text-gray-700 border border-gray-300 rounded bg-white
                          file:mr-3 file:px-3 file:py-1 file:border-0 file:border-r file:border-gray-300
                          file:bg-gray-100 file:text-black file:text-sm hover:file:bg-gray-200
                          ${doc.status !== "Yes" ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                    />
                  </td>

                  <td className="px-4 py-4 text-center border border-gray-100">
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 flex justify-center w-full"
                    >
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-1 rounded-full w-full sm:w-auto"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
        >
          Save & Next
        </button>
      </div>
    </form>
  );
};

