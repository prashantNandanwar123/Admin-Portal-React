import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { ShieldCheck, ArrowLeft, Link } from "lucide-react";

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
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[20px]">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500"></div>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-yellow-100 text-yellow-600 shrink-0">
            <ShieldCheck size={16} />
          </span>
          <h2 className="text-xl sm:text-xl text-slate-800 font-semibold -mt-2">
            Review IPG Configuration
          </h2>
        </div>
        <p className="ml-12 text-sm text-slate-500 font-normal -mt-2">
          Review and verify the Internet Payment Gateway configuration and setup details.
        </p>
      </div>

      {/* ================= TOP SECTION VIEW ONLY ================= */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pb-4 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pb-4 mt-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 my-4">
            <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-yellow-100 text-yellow-600 shrink-0">
              <Link size={20} />
            </span>
            <h2 className="text-base font-semibold text-gray-900 uppercase">
              Request URL's
            </h2>
          </div>
        </div>
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
      </div>

      {/* ================= ACTION SECTION ================= */}
      <form
        className="pt-6"
        onSubmit={(e) => {
          e.preventDefault();
          submitRiskAprRject(actionType);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          {/* Remark */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remark <span className="text-red-500 ml-1">*</span>
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
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-full"
          >
            <ArrowLeft size={16} />
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
                className="inline-flex items-center gap-2 bg-[#fec931] font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
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