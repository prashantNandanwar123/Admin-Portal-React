import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

import {
  User, CalendarDays, Clock, Store, UserRound, FileText, MapPin, Building2,
  Receipt
} from "lucide-react";

export default function VBasicDetails({
  refId,
  data,
  setData,
  errors,
  handleNext }) {

  const [apiData, setApiData] = useState({});

  useEffect(() => {
    if (!refId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `/viewMerchantBasicDetails/${refId}`
        );
        if (response.respCode === 0) {
          const res = response.respData;
          setApiData(res || {});
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [refId]);

  const documentOptions = [
    { label: "Aadhar No", name: "bddDocument", value: "AadharNo" },
    { label: "Form 60", name: "bddDocument", value: "Form60" },
  ];
  const sezOptions = [
    { label: "SEZ", name: "bddSez", value: "BDD_SEZDetail" },
    { label: "GST", name: "bddGst", value: "BDD_GSTDetail" },
  ];


  return (
    <div>
      <div className="flex items-center gap-3 py-3">
        <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-yellow-600" />
        </div>
        <h2 className="text-xl sm:text-2xl uppercase text-blue-900 font-bold">
          View Merchant Onboarding Details
        </h2>
      </div>
      <p className="text-sm text-blue-900 -mt-2 ml-12">
        Review and manage the merchant onboarding information and business details.
      </p>

      <div className="pt-3">
        {/* Store Onboarding Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
          {/* <h2 className="text-[18px] sm:text-[18px] uppercase text-gray-700 font-semibold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Store className="w-4 h-4 text-yellow-600" />
            </span>
            Store Onboarding Status
          </h2> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
            {/* Highlighted meta strip */}
            <div className="lg:col-span-2 bg-amber-50 rounded-xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-600 rounded-full p-2 flex items-center justify-center shrink-0">
                  <User size={16} />
                </span>
                <label className="text-gray-700 text-[13px] sm:text-[15px] leading-tight">
                  <span className="block text-gray-500 text-xs">Created By</span>
                  {apiData?.createdBy}
                </label>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-600 rounded-full p-2 flex items-center justify-center shrink-0">
                  <CalendarDays size={16} />
                </span>
                <label className="text-gray-700 text-[13px] sm:text-[15px] leading-tight">
                  <span className="block text-gray-500 text-xs">Created Date</span>
                  {apiData?.createdDate}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── Contact Person Details ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-6">
          <h2 className="text-[18px] uppercase sm:text-[18px] text-gray-700 font-semibold mb-6 border-gray-200 pb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <UserRound className="w-4 h-4 text-yellow-600" />
            </span>
            Contact Person Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-7">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Full Name
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="w-20 border border-gray-200 rounded-l-lg px-2 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                  value={apiData?.cpdNameTitle || ""}
                  readOnly
                />
                <input
                  type="text"
                  className="w-full border border-l-0 border-gray-200 rounded-r-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                  value={apiData?.cpdName || ""}
                  readOnly
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Date of Birth
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.cpdDateOfBirth || ""}
                readOnly
              />
            </div>


            {/* Mobile */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Mobile No
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.cpdMobile || ""}
                readOnly
              />
            </div>

            {/* Primary Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Primary Email Id
              </label>

              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.cpdPrimaryEmailId || ""}
                readOnly
              />
            </div>

            {/* Secondary Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Secondary Email Id
              </label>

              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.cpdSecondaryEmailId || ""}
                readOnly
              />
            </div>

            {/* Sourcing Channel */}
            <div className="flex flex-col justify-center gap-2">
              <label className="text-gray-700 font-medium text-sm">
                Sourcing Channel<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.basicSrcChannel || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* ── Basic Document Details ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-8">
          <h2 className="text-lg uppercase sm:text-[20px] text-gray-700 font-semibold mb-6 border-gray-200 pb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-yellow-600" />
            </span>
            Basic Document Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-7">
            {/* Documents radio */}
            <div>
              <label className="block text-gray-700 font-medium mb-3 text-sm">
                Documents
              </label>
              <div className="border border-gray-200 rounded-full px-4 sm:px-5 py-3 flex flex-wrap items-center gap-4 sm:gap-6 bg-white">
                {documentOptions.map((doc) => (
                  <label key={doc.value} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      className="accent-orange-500"
                      checked={apiData?.bddDocument === doc.value}
                      readOnly
                    />
                    {doc.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Aadhar No */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Aadhar No.
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.bddAadharNo || ""}
                readOnly
              />
            </div>

            {/* SEZ Detail */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                SEZ Detail
              </label>

              <div className="border border-gray-200 rounded-full px-4 sm:px-5 py-3 flex flex-wrap items-center gap-4 sm:gap-6 bg-white">
                {sezOptions.map((item) => (
                  <label key={item.value} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      className="accent-orange-500"
                      checked={apiData?.bddSez === item.value}
                      readOnly
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            {/* GSTN No */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                GSTN No.
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.bddGstnNO || ""}
                readOnly
              />
            </div>

            {/* Pan No */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Pan No
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.bddPanNo || ""}
                readOnly
              />
            </div>

            {/* Risk Check */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Risk Check
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.riskCheck || ""}
                readOnly
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Category
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.bddCategory || ""}
                readOnly
              />
            </div>

            {/* MCC */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                MCC
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.bddAgpMcc || ""}
                readOnly
              />
            </div>

            {/* Vintage Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Vintage Type
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.bddVintageType || ""}
                readOnly
              />
            </div>

            {/* Merchant Business Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Merchant Business Type
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.bddMerchantBusinessType || ""}
                readOnly
              />
            </div>

            {/* Merchant Website URL */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Merchant Website URL
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.bddMerchantWebsiteURL || ""}
                readOnly
              />
            </div>

            {/* Partner Logo Check */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Partner Logo Check
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.partnerLogoCheck || ""}
                readOnly
              />
            </div>
            {/* Partner Logo */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Partner Logo
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.partnerLogoPath || ""}
                readOnly
              />
            </div>
            {/* Store Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Company Name (Business Name)
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.storeDbaName || ""}
                readOnly
              />
            </div>
            {/* Legal Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
               Company Legal Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.storeLegalName || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* ── Store Address ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-8">
          <h2 className="text-[18px] sm:text-[20px] text-gray-700 font-semibold pb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-yellow-600" />
            </span>
            Store Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-7">
            {/* Address 1 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Address 1
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.addStoreAddress1 || ""}
                readOnly
              />
            </div>

            {/* Address 2 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Address 2
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.addStoreAddress2 || ""}
                readOnly
              />
            </div>

            {/* Address 3 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Address 3
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.addStoreAddress3 || ""}
                readOnly
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Country
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.addCountry || ""}
                readOnly
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                State
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.addState || ""}
                readOnly
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                City
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.addCity || ""}
                readOnly
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Zip Code
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.addZipcode || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* ── Billing Address ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-8 mb-8">
          <h2 className="text-[18px] sm:text-[20px] text-gray-700 font-semibold mb-6  border-gray-200 pb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-yellow-600" />
            </span>
            Billing Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-7">
            {/* Address 1 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Address 1
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.baAddress1 || ""}
                readOnly
              />
            </div>

            {/* Address 2 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Address 2
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.baAddress2 || ""}
                readOnly
              />
            </div>

            {/* Address 3 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Address 3
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.baAddress3 || ""}
                readOnly
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Country
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.baCountry || ""}
                readOnly
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                State
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.baState || ""}
                readOnly
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                City
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.baCity || ""}
                readOnly
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Zip Code
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm focus:outline-none"
                value={apiData?.baZipcode || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end gap-3 mb-10 sm:mb-15">
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-5 py-2 rounded-lg shadow-sm transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

