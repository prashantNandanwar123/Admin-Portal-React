import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";

export default function EIPGConfig({
  refId,
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
  const [apiData, setApiData] = useState({});

  // ================= HANDLE CHANGE =================
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================= Fetch API (saveMerchantIPG) =================

  useEffect(() => {
    if (!refId) return;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `rMerchantIpg/${refId}`
        );
        if (response?.respCode === 0) {
          const res = response?.respData || {};
          // OLD DATA STORE
          setApiData(res);

          // FORM AUTO FILL
          setForm({
            IPG_ECIValueVisa:
              res.IPG_ECIValueVisa || "",

            IPG_ECIValueMaster:
              res.IPG_ECIValueMaster || "",

            IPG_ECIValueMaestro:
              res.IPG_ECIValueMaestro || "",

            IPG_IntegrationApproach:
              res.IPG_IntegrationApproach || "",

            IPG_PCIDSSCertificateNumber:
              res.IPG_PCIDSSCertificateNumber || "",

            IPG_PCIDSSExpiryDate:
              res.IPG_PCIDSSExpiryDate || "",

            IPG_MerchantEmail:
              res.IPG_MerchantEmail || "",

            IPG_CustomerEmail:
              res.IPG_CustomerEmail || "",

            IPG_MerchantSMS:
              res.IPG_MerchantSMS || "",

            IPG_CustomerSMS:
              res.IPG_CustomerSMS || "",

            IPG_ServertoServerCall:
              res.IPG_ServertoServerCall || false,

            requestURL1: res.requestURL1 || "",
            requestURL2: res.requestURL2 || "",
            requestURL3: res.requestURL3 || "",
            requestURL4: res.requestURL4 || "",
            requestURL5: res.requestURL5 || "",
            requestURL6: res.requestURL6 || "",
            requestURL7: res.requestURL7 || "",
            requestURL8: res.requestURL8 || "",
            requestURL9: res.requestURL9 || "",
            requestURL10: res.requestURL10 || "",

            posTidCount:
              res.posTidCount || "",
          });
        }
      } catch (err) {
        toast.error(error);
      }
    };
    fetchData();
  }, [refId]);


  // ================= SAVE API (saveMerchantIPG) =================
  const handleSaveIPG = async () => {
    try {
      const payload = {
        ref_id: refId,
        // OLD DATA
        oldData: apiData,

        // UPDATED DATA
        updatedData: form,

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

      const response = await axiosInstance.post("/saveEditMerchantIPG", payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = response;
      if (resData?.respCode === 0) {
        console.log("response print--->>>>>", resData);
        toast.success(resData?.respMsg);

        setData((prev) => ({
          ...prev,
          refId: resData?.respData?.ref_id || prev.refId,
        }));

        // redirect page
        setTimeout(() => {
          navigate("/app/merchants");
        }, 1000);

      } else {
        toast.error(resData?.respMsg);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const inputClass =
    "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[14px] text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
  const labelClass =
    "mb-1 block text-[15px] font-medium text-gray-700";
  const req = <span className="text-red-500">*</span>;

  return (
    <div className="p-6">
      <h2 className="text-2xl uppercase text-blue-900 font-extrabold py-3">
        Edited IPG Configuration
      </h2>
      <p className="text-blue-900 mb-6 border-b border-gray-300 pb-4">
        IPG (Internet Payment Gateway) Configuration enables secure online payment processing by connecting merchants with banks and payment systems. It supports digital payments like cards, UPI, and net banking while ensuring safe, fast, and reliable transactions with proper security compliance.
      </p>


      {/* ================= TOP SECTION (NO DESIGN CHANGE) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
                checked={form.IPG_MerchantEmail === "Yes"}
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
                checked={form.IPG_MerchantEmail === "No"}
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
                checked={form.IPG_CustomerEmail === "Yes"}
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
                checked={form.IPG_CustomerEmail === "No"}
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
                checked={form.IPG_MerchantSMS === "Yes"}
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
                checked={form.IPG_MerchantSMS === "No"}
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
                checked={form.IPG_CustomerSMS === "Yes"}
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
                checked={form.IPG_CustomerSMS === "No"}
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
              checked={form.IPG_ServertoServerCall}
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
              value={form[`requestURL${index + 1}`]}
              placeholder="www.example.com"
              onChange={(e) =>
                handleChange(
                  `requestURL${index + 1}`,
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="flex justify-between items-center mt-10">

        {/* Left Side Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-500 text-white px-6 py-2 rounded"
        >
          Back
        </button>
        {/* Center Update Button */}
        <div className="flex-1 flex justify-center">
          <button
            type="submit"
            onClick={handleSaveIPG}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
          >
            Update
          </button>
        </div>
        {/* Empty div for balance */}
        <div className="w-[88px]"></div>
      </div>
    </div>
  );
}