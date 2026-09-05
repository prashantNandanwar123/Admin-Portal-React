import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { Settings } from "lucide-react";

export default function RIPGConfig({
  refId,
  handleBack
}) {

  const [apiData, setApiData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [userData, setUserData] = useState(null);

  const [modalData, setModalData] = useState({
    respMsg: "",
    user_id: "",
    mid_created: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);



  useEffect(() => {
    if (!refId) return;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `rMerchantIpg/${refId}`
        );
        if (response?.respCode === 0) {
          toast.success(response?.respMsg);
          const res = response?.respData;
          setApiData(res || {});
        }
      } catch (err) {
        toast.error(err);
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
        refId: refId,
        approvedBy: userData?.userName,
        rremark: form.rremark,
        rstatus: status,
      };
      const response = await axiosInstance.post(
        "submitRiskAprRject",
        payload
      );

      if (response?.respCode === 0) {
        // Success toast
        if (status === "Approved") {
          toast.success(response?.respMsg);
          const resData = response?.respData || {};
          // Modal data
          setModalData({
            respMsg: response?.respMsg || "",
            user_id: resData?.user_id || "",
            mid_created: resData?.mid_created || "",
          });
          setShowModal(true);
        } else if (status == "Rejected") {
          toast.error(response?.respMsg);
          setTimeout(() => {
            window.location.reload("/app/risk-approval");
          }, 1000);
        }
      } else {
        toast.error(response?.respMsg);
        setTimeout(() => {
          window.location.reload("/app/risk-approval");
        }, 300);
      }

    } catch (error) {
      toast.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      window.location.reload("/app/risk-approval");
    }, 300);
  };

  return (
    <div className="relative">
      <div className="mb-5">
        {/* Main Heading */}
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 shrink-0">
            <Settings size={18} />
          </span>
          <h2 className="text-2xl text-blue-900 font-semibold">
            Review IPG Configuration
          </h2>
        </div>
        {/* Subheading */}
        <p className="ml-12 text-sm text-blue-900 font-normal pb-5">
          Review and verify the Internet Payment Gateway configuration and setup details.
        </p>
      </div>
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

      {/* ================= ACTION SECTION ================= */}
      <form
        className="mt-10 border-t border-gray-200 pt-6"
        onSubmit={(e) => {
          e.preventDefault();
          submitRiskAprRject(actionType);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          {/* Remark */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remark <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={form.rremark}
              onChange={(e) => handleChange("rremark", e.target.value)}
              required
              placeholder="Enter remark"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Approve Reject Buttons */}
          <div className="flex gap-4 md:justify-end">
            {/* Approve */}
            <button
              type="submit"
              onClick={() => setActionType("Approved")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Approve
            </button>

            {/* Reject */}
            <button
              type="submit"
              onClick={() => setActionType("Rejected")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full"
          >
            Back
          </button>
        </div>
      </form>

      {/* ================= SUCCESS MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 box-content size-105">
            {/* Success Icon */}
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-3xl text-green-600">✓</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Onboarding Completed
            </h2>
            {/* Content */}
            <div className="space-y-2">
              <div className="p-3">
                <p className="text-xl font-medium text-gray-800 mb-1">
                  User ID : {modalData.user_id}
                </p>
              </div>
              <div className="p-3">
                <p className="text-xl font-medium text-gray-800 mb-1">
                  Merchant ID : {modalData.mid_created}
                </p>
              </div>

              <div className="p-3">
                <p className="font-medium text-xl text-green-800 break-words">
                  {modalData.respMsg}
                </p>
              </div>
            </div>

            {/* Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}