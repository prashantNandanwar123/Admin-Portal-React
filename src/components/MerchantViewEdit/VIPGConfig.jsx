import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Link2, ArrowLeft } from "lucide-react";


export default function VIPGConfig({
  refId,
  handleBack
}) {

  const [apiData, setApiData] = useState({});
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

        if (response?.respCode === 0) {
          toast.success(response.respMsg);
          setApiData(response?.respData || {});

        } else {
          toast.error(response.respMsg);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    fetchData();
  }, [refId]);

  const [form, setForm] = useState({
    UserName: "",
    rremark: "",
    rstatus: "",
  });

  //  submitRiskAprRject Api
  const submitRiskAprRject = async (status) => {
    try {
      const payload = {
        ref_id: refId,
        UserName: "",
        rremark: form.rremark,
        rstatus: status,
      };

      const response = await axiosInstance.post(
        "submitRiskAprRject",
        payload
      );

      // APPROVE SUCCESS
      if (response?.respCode === 0) {
        const resData = response?.respData || {};
      }

    } catch (err) {
      const errorData = err?.response?.data || err;

      // REJECT SUCCESS CASE
      if (errorData?.respCode === 0) {
        toast.error(errorData?.respMsg);
      } else {
        toast.error(errorData?.respMsg);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Sidebar Risk Approval route open
    navigate("/app/risk-approval");
  };

  return (
    <div className="relative m-3">
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[20px]">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500"></div>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-yellow-100 text-yellow-600 shrink-0">
            <ShieldCheck size={16} />
          </span>
          <h2 className="text-xl sm:text-xl text-slate-800 font-semibold -mt-3">
            View  IPG Configuration
          </h2>
        </div>
        <p className="ml-13 text-sm text-slate-700 -mt-3">
          view the merchant's IPG gateway settings, certificate details, and notification preferences.
        </p>
      </div>

      {/* ================= TOP SECTION VIEW ONLY ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ECI Value (Visa)<span className="text-red-500 ml-1">*</span>
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
              ECI Value (Master)<span className="text-red-500 ml-1">*</span>
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
              ECI Value Maestro<span className="text-red-500 ml-1">*</span>
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
              Integration Approach<span className="text-red-500 ml-1">*</span>
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
              Merchant Email Confirmation For Transaction<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-4 text-sm">
              <label>
                <input
                  type="radio"
                  checked={apiData?.ipg_MerchantEmail === "Yes"}
                  readOnly
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={apiData?.ipg_MerchantEmail === "No"}
                  readOnly
                />{" "}
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Email Confirmation For Transaction<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-4 text-sm">
              <label>
                <input
                  type="radio"
                  checked={apiData?.ipg_CustomerEmail === "Yes"}
                  readOnly
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={apiData?.ipg_CustomerEmail === "No"}
                  readOnly
                />{" "}
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Merchant SMS Confirmation For Transaction<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-4 text-sm">
              <label>
                <input
                  type="radio"
                  checked={apiData?.ipg_MerchantSMS === "Yes"}
                  readOnly
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={apiData?.ipg_MerchantSMS === "No"}
                  readOnly
                />{" "}
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer SMS Confirmation For Transaction<span className="text-red-500 ml-1">*</span>
            </label>

            <div className="flex gap-4 text-sm">
              <label>
                <input
                  type="radio"
                  checked={apiData?.ipg_CustomerSMS === "Yes"}
                  readOnly
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={apiData?.ipg_CustomerSMS === "No"}
                  readOnly
                />{" "}
                No
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={apiData?.ipg_ServertoServerCall}
                readOnly
              />
              Server to Server Call
            </label>
          </div>
        </div>
      </div>

      {/* ================= REQUEST URLS ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-5">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
            <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 uppercase flex items-center gap-2">
            Request URL's
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
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
      </div>

      <div className="bg-white rounded-2xl border flex items-center gap-7 border-gray-100 shadow-sm p-4 sm:p-6 mt-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Risk Status
          </label>
          <input
            type="text"
            value={apiData?.riskStatus || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Risk Remark
          </label>
          <input
            type="text"
            value={apiData?.riskRemark || ""}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
          />
        </div>
      </div>

      {/* ================= ACTION SECTION ================= */}
      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          submitRiskAprRject(actionType);
        }}
      >

        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-full"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </form>
    </div>
  );
}