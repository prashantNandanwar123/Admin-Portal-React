import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { ShieldCheck, Link2 } from "lucide-react";


export default function IPGConfigurationForm({
  data,
  setData,
  handleBack,
}) {

  const navigate = useNavigate();

  // ================= STATE =================
  const [form, setForm] = useState({
    IPG_ECIValueVisa: "",
    IPG_ECIValueMaster: "",
    IPG_ECIValueMaestro: "",
    IPG_IntegrationApproach: "",
    IPG_PCIDSSCertificateNumber: "",
    IPG_PCIDSSExpiryDate: "",
    IPG_MerchantEmail: "",
    IPG_CustomerEmail: "",
    IPG_MerchantSMS: "",
    IPG_CustomerSMS: "",
    IPG_ServertoServerCall: false,
    requestURL1: "",
    requestURL2: "",
    requestURL3: "",
    requestURL4: "",
    requestURL5: "",
    requestURL6: "",
    requestURL7: "",
    requestURL8: "",
    requestURL9: "",
    requestURL10: "",
    posTidCount: "",
  });
  const [isRiskEnabled, setIsRiskEnabled] = useState(false);

  // ================= HANDLE CHANGE =================
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================= SAVE API (saveMerchantIPG) =================
  const handleSaveIPG = async () => {
    try {
      const payload = {
        ref_id: data?.refId,

        IPG_ECIValueVisa: form.IPG_ECIValueVisa,
        IPG_ECIValueMaster: form.IPG_ECIValueMaster,
        IPG_ECIValueMaestro: form.IPG_ECIValueMaestro,
        IPG_IntegrationApproach: form.IPG_IntegrationApproach,
        IPG_PCIDSSCertificateNumber: form.IPG_PCIDSSCertificateNumber,
        IPG_PCIDSSExpiryDate: form.IPG_PCIDSSExpiryDate,
        IPG_MerchantEmail: form.IPG_MerchantEmail,
        IPG_CustomerEmail: form.IPG_CustomerEmail,
        IPG_MerchantSMS: form.IPG_MerchantSMS,
        IPG_CustomerSMS: form.IPG_CustomerSMS,
        IPG_ServertoServerCall: form.IPG_ServertoServerCall,
        requestURL1: form.requestURL1,
        requestURL2: form.requestURL2,
        requestURL3: form.requestURL3,
        requestURL4: form.requestURL4,
        requestURL5: form.requestURL5,
        requestURL6: form.requestURL6,
        requestURL7: form.requestURL7,
        requestURL8: form.requestURL8,
        requestURL9: form.requestURL9,
        requestURL10: form.requestURL10,
        posTidCount: form.posTidCount,
      };

      const response = await axiosInstance.post("/saveMerchantIPG", payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = response;
      if (resData?.respCode === 0) {
        toast.success(resData?.respMsg);
        setData((prev) => ({
          ...prev,
          refId: resData?.respData?.ref_id || prev.refId,
        }));
        // send Risk Team button Enable when resoponse code getting 0
        setIsRiskEnabled(true);
      } else {
        toast.error(resData?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // ================= FINAL SUBMIT =================
  const handleFinalSubmit = async () => {
    try {
      const response = await axiosInstance.post(`/sendRiskApr/${data?.refId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.respCode === 0) {
        toast.success(response?.respMsg);

        // navigate after success
        setTimeout(() => {
          navigate("/app/register-merchant");
        }, 1000);

      } else {
        toast.error(response?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-200 focus:ring-0";
  const labelClass =
    "mb-1 block text-[15px] font-medium text-gray-700";
  const req = <span className="text-red-500">*</span>;

  return (

    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-3 pb-2">
        <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-blue-600 shrink-0">
          <ShieldCheck size={16} />
        </span>
        <h2 className="text-xl sm:text-2xl uppercase text-blue-900 font-extrabold">
          IPG Configuration
        </h2>
      </div>
      <p className="text-blue-900 mb-6 pb-5 ml-12">
        IPG (Internet Payment Gateway) Configuration enables secure online payment processing by connecting merchants with banks and payment systems. It supports digital payments like cards, UPI, and net banking while ensuring safe, fast, and reliable transactions with proper security compliance.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveIPG();
        }}
      >
        {/* ================= TOP SECTION (NO DESIGN CHANGE) ================= */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ECI Value (Visa) {req}
              </label>
              <input
                type="text"
                value={form.IPG_ECIValueVisa}
                required
                maxLength={3}
                placeholder="000"
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^\d*$/.test(value)) return;
                  handleChange("IPG_ECIValueVisa", value);
                }}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ECI Value (Master) {req}
              </label>
              <input
                type="text"
                value={form.IPG_ECIValueMaster}
                required
                maxLength={3}
                placeholder="000"
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^\d*$/.test(value)) return;
                  handleChange("IPG_ECIValueMaster", value);
                }}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ECIValueMaestro {req}
              </label>

              <input
                type="text"
                value={form.IPG_ECIValueMaestro}
                required
                maxLength={3}
                placeholder="000"
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^\d*$/.test(value)) return;
                  handleChange("IPG_ECIValueMaestro", value);
                }}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Integration Approach {req}
              </label>
              <select
                value={form.IPG_IntegrationApproach}
                required
                onChange={(e) =>
                  handleChange("IPG_IntegrationApproach", e.target.value)
                }
                className={inputClass}
              >
                <option value="">-- Select --</option>
                <option value="SSL">SSL</option>
                <option value="MOTO">MOTO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PCI DSS Certificate Number
              </label>
              <input
                type="text"
                value={form.IPG_PCIDSSCertificateNumber}
                onChange={(e) =>
                  handleChange(
                    "IPG_PCIDSSCertificateNumber",
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PCI DSS Expiry Date
              </label>
              <input
                type="date"
                value={form.IPG_PCIDSSExpiryDate}
                onChange={(e) =>
                  handleChange("IPG_PCIDSSExpiryDate", e.target.value)
                }
                className={inputClass}
              />
            </div>

            {/* EMAIL / SMS */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Merchant Email Confirmation For Transaction {req}
              </label>
              <div className="flex gap-4 text-sm">
                <label>
                  <input
                    type="radio"
                    name="merchantEmail"
                    onChange={() =>
                      handleChange("IPG_MerchantEmail", "Yes")
                    }
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="merchantEmail"
                    onChange={() =>
                      handleChange("IPG_MerchantEmail", "No")
                    }
                  />{" "}
                  No
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Email Confirmation For Transaction {req}
              </label>
              <div className="flex gap-4 text-sm">
                <label>
                  <input
                    type="radio"
                    name="customerEmail"
                    onChange={() =>
                      handleChange("IPG_CustomerEmail", "Yes")
                    }
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="customerEmail"
                    onChange={() =>
                      handleChange("IPG_CustomerEmail", "No")
                    }
                  />{" "}
                  No
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Merchant SMS Confirmation For Transaction {req}
              </label>
              <div className="flex gap-4 text-sm">
                <label>
                  <input
                    type="radio"
                    name="merchantSMS"
                    onChange={() =>
                      handleChange("IPG_MerchantSMS", "Yes")
                    }
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="merchantSMS"
                    onChange={() =>
                      handleChange("IPG_MerchantSMS", "No")
                    }
                  />{" "}
                  No
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer SMS Confirmation For Transaction {req}
              </label>
              <div className="flex gap-4 text-sm">
                <label>
                  <input
                    type="radio"
                    name="customerSMS"
                    onChange={() =>
                      handleChange("IPG_CustomerSMS", "Yes")
                    }
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="customerSMS"
                    onChange={() =>
                      handleChange("IPG_CustomerSMS", "No")
                    }
                  />{" "}
                  No
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleChange(
                      "IPG_ServertoServerCall",
                      e.target.checked
                    )
                  }
                />
                Server to Server Call
              </label>
            </div>
          </div>
        </div>

        {/* ================= REQUEST URLS ================= */}
        <div className="my-10"></div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 text-purple-600 shrink-0">
              <Link2 size={14} />
            </span>
            <h2 className="text-xl sm:text-xl uppercase font-light text-gray-700">
              Request URL's
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Request URL {index + 1}
                </label>
                <input
                  type="text"
                  value={form[`requestURL${index + 1}`]}
                  placeholder="www.example.com"
                  onChange={(e) =>
                    handleChange(
                      `requestURL${index + 1}`,
                      e.target.value
                    )
                  }
                  className={inputClass} />
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                POS TID Count
              </label>
              <input
                type="text"
                value={form.posTidCount}
                onChange={(e) =>
                  handleChange("posTidCount", e.target.value)
                }
                className={inputClass} />
            </div>
          </div>
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 text-white px-6 py-1 rounded-full w-full sm:w-auto" >
            Back
          </button>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-2 rounded-full shadow-sm transition">
              Save
            </button>
            <button
              type="button"
              disabled={!isRiskEnabled}
              onClick={handleFinalSubmit}
              className={`px-6 py-2 rounded text-white w-full sm:w-auto ${isRiskEnabled ? "bg-green-600" : "bg-green-300 cursor-not-allowed"
                }`}
            >
              Send Risk Team
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}