import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function VIPGConfig({
  refId,
  data,
  setData,
  errors,
  handleNext,
  handleBack
}) {

  const [apiData, setApiData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [modalData, setModalData] = useState({
    respMsg: "",
    user_id: "",
    mid_created: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!refId) return;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `viewMerchantIpg/${refId}`
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

  const [form, setForm] = useState({
    UserName: "",
    rremark: "",
    rstatus: "",
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const submitRiskAprRject = async (status) => {
    try {

      const payload = {
        ref_id: refId,
        UserName: "",
        rremark: form.rremark,
        rstatus: status,
      };

      console.log("PAYLOAD----->..", payload);
      const response = await axiosInstance.post(
        "submitRiskAprRject",
        payload
      );

      console.log("RAW RESPONSE:", response);
      // APPROVE SUCCESS
      if (response?.respCode === 0) {

        const resData = response?.respData || {};

      }

    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      const errorData = err?.response?.data || err;
      // REJECT SUCCESS CASE
      if (errorData?.respCode === 0) {
        toast.error(
          errorData?.respMsg || "Rejected Successfully"
        );

      } else {
        toast.error(
          errorData?.respMsg || "Something went wrong"
        );

      }
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);

    // Sidebar Risk Approval route open
    navigate("/app/risk-approval");
  };

  return (
    <div className="relative">
      <h2 className="text-2xl uppercase text-blue-900 font-extrabold py-1 border-b border-gray-300 pb-2">
      View  IPG Configuration
      </h2>
      {/* ================= TOP SECTION VIEW ONLY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ECI Value (Visa)
          </label>

          <input
            type="text"
            value={apiData?.ipg_ECIValueVisa || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ECI Value (Master)
          </label>

          <input
            type="text"
            value={apiData?.ipg_ECIValueMaster || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ECI Value Maestro
          </label>

          <input
            type="text"
            value={apiData?.ipg_ECIValueMaestro || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Integration Approach
          </label>

          <input
            type="text"
            value={apiData?.ipg_IntegrationApproach || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            PCI DSS Certificate Number
          </label>

          <input
            type="text"
            value={apiData?.ipg_PCIDSSCertificateNumber || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            PCI DSS Expiry Date
          </label>

          <input
            type="text"
            value={apiData?.ipg_PCIDSSExpiryDate || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Merchant Email Confirmation For Transaction
          </label>

          <input
            type="text"
            value={apiData?.ipg_MerchantEmail || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Customer Email Confirmation For Transaction
          </label>

          <input
            type="text"
            value={apiData?.ipg_CustomerEmail || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Merchant SMS Confirmation For Transaction
          </label>

          <input
            type="text"
            value={apiData?.ipg_MerchantSMS || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Customer SMS Confirmation For Transaction
          </label>

          <input
            type="text"
            value={apiData?.ipg_CustomerSMS || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Server to Server Call
          </label>

          <input
            type="text"
            value={
              apiData?.ipg_ServertoServerCall === true
                ? "Yes"
                : apiData?.ipg_ServertoServerCall === false
                  ? "No"
                  : ""
            }
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>
      </div>

      {/* ================= REQUEST URLS ================= */}
      <div className="border-t border-gray-300 my-10"></div>
      <h2 className="text-3xl font-light text-gray-700 mb-8">
        Request URL's
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Request URL {index + 1}
            </label>
            <input
              type="text"
              value={apiData?.[`requestURL${index + 1}`] || ""}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            POS TID Count
          </label>
          <input
            type="text"
            value={apiData?.posTidCount || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>
      </div>

      {/* ================= ACTION SECTION ================= */}
      <form
        className="mt-10 border-t border-gray-200 pt-6"
        onSubmit={(e) => {
          e.preventDefault();
          submitRiskAprRject(actionType);
        }}
      >

        {/* Back Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}