import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Settings2, Link2 } from "lucide-react";


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
          `viewMerchantIpg/${1003}`
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
      <div className="flex items-center gap-3 pb-2">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
          <Settings2 className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-700" />
        </div>
        <h2 className="text-xl sm:text-1xl text-blue-900 font-semibold py-1">
          View  IPG Configuration
        </h2>
      </div>
      <p className="text-sm text-blue-900 -mt-3 mb-2 ml-12 sm:ml-14">
        Review the merchant's IPG gateway settings, certificate details, and notification preferences.
      </p>

      {/* ================= TOP SECTION VIEW ONLY ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
      </div>

      {/* ================= REQUEST URLS ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-5">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
            <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          </div>
          <h2 className="text-xl sm:text-lg lg:text-2xl font-light text-gray-700 uppercase">
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
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}