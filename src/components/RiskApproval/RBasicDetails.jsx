import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import {
  User, CalendarDays, Clock, Store, UserRound, FileText, MapPin, Building2,
  Receipt
} from "lucide-react";

export default function BasicDetails({ refId, data, setData, errors, handleNext }) {
  const [apiData, setApiData] = useState({});
 

  useEffect(() => {
    if (!refId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `/rMerchantBasicDetails/${refId}`
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



  const documentOptions = [
    { label: "Aadhar No", name: "bddDocument", value: "AadharNo" },
    { label: "Form 60", name: "bddDocument", value: "Form60" },
  ];
  const sezOptions = [
    { label: "SEZ", name: "bddSez", value: "BDD_SEZDetail" },
    { label: "GST", name: "bddGst", value: "BDD_GSTDetail" },
  ];


  return (
    <>
      <div>
        <h1 className="text-2xl uppercase pb-3 text-blue-900 font-extrabold">
          Review Basic Details Form
        </h1>
        <div className="border-t border-gray-300 pt-4">
          {/* Store Onboarding Status */}
          <h2 className="text-[20px] text-gray-700 mb-6">
            Store Onboarding Status
          </h2>
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
                  {apiData?.createdAt}
                </label>
              </div>
            </div>
          </div>
        </div>
          {/* ── Contact Person Details ───────────────────────────────────── */}
          <div className="p-5 rounded-md mt-8">
            <h2 className="text-[20px] text-gray-700 mb-6 border-b border-gray-300 pb-3">
              Contact Person Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>

                <div className="flex">
                  <input
                    type="text"
                    className="w-24 border border-gray-300 rounded-l px-3 py-2 bg-gray-100"
                    value={apiData?.cpdNameTitle || ""}
                    readOnly
                  />

                  <input
                    type="text"
                    className="w-full border border-l-0 border-gray-300 rounded-r px-3 py-2 bg-gray-100"
                    value={apiData?.cpdName || ""}
                    readOnly
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Date of Birth
                </label>

                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.cpdDateOfBirth || ""}
                  readOnly
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Mobile No
                </label>

                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.cpdMobile || ""}
                  readOnly
                />
              </div>

              {/* Primary Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Primary Email Id
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.cpdPrimaryEmailId || ""}
                  readOnly
                />
              </div>

              {/* Secondary Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Secondary Email Id
                </label>

                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.cpdSecondaryEmailId || ""}
                  readOnly
                />
              </div>

               {/* Sourcing Channel */}
            <div className="flex flex-col justify-center gap-2">
              <label className="text-gray-700 font-medium text-sm">
               Reseller Partner<span className="text-red-500">*</span>
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
          <h2 className="text-[20px] text-gray-700 mt-10 mb-6 border-b border-gray-300 pb-5">
            Basic Document Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Documents radio */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Documents
              </label>
              <div className="flex items-center gap-5">
                {documentOptions.map((doc) => (
                  <label key={doc.value} className="flex items-center gap-2">
                    <input
                      type="radio"
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
              <label className="block text-gray-700 font-medium mb-2">
                Aadhar No.
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddAadharNo || ""}
                readOnly
              />
            </div>

            {/* SEZ Detail */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SEZ Detail
              </label>
              <div className="border border-gray-300 rounded-full px-5 py-4 flex items-center gap-6 bg-white">
                {sezOptions.map((item) => (
                  <label key={item.value} className="flex items-center gap-2">
                    <input
                      type="radio"
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
              <label className="block text-gray-700 font-medium mb-2">
                GSTN No.
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddGstnNO || ""}
                readOnly
              />
            </div>

            {/* Pan No */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Pan No
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddPanNo || ""}
                readOnly
              />
            </div>

            {/* Risk Check */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Risk Check
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.riskCheck || ""}
                readOnly
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddCategory || ""}
                readOnly
              />
            </div>

            {/* MCC */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                MCC
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddAgpMcc || ""}
                readOnly
              />
            </div>

            {/* Vintage Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Vintage Type
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddVintageType || ""}
                readOnly
              />
            </div>

            {/* Merchant Business Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Merchant Business Type
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddMerchantBusinessType || ""}
                readOnly
              />
            </div>

            {/* Merchant Website URL */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Merchant Website URL
              </label>              
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddMerchantWebsiteURL || ""}
                readOnly
              />
              {errors?.bddMerchantWebsiteURL && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.bddMerchantWebsiteURL}
                </p>
              )}
            </div>

            {/* Partner Logo Check */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Partner Logo Check
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.partnerLogoCheck || ""}
                readOnly
              />
            </div>

            {/* Partner Logo */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Partner Logo
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.partnerLogoPath || ""}
                readOnly
              />
            </div>

            {/* Store Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                  Company Name (Business Name)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.storeDbaName || ""}
                readOnly
              />
            </div>

            {/* Legal Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company Legal Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.storeLegalName || ""}
                readOnly
              />
            </div>
          </div>

          {/*  Store Address */}
          <div>
            <h2 className="text-[20px] text-gray-700 mb-6 border-b border-gray-300 pb-3 pt-5">
              Company Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {/* Address 1 */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Address 1
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.addStoreAddress1 || ""}
                  readOnly
                />
              </div>

              {/* Address 2 */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Address 2
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.addStoreAddress2 || ""}
                  readOnly
                />
              </div>

              {/* Address 3 */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Address 3
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.addStoreAddress3 || ""}
                  readOnly
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.addCountry || ""}
                  readOnly
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  State
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.addState || ""}
                  readOnly
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.addCity || ""}
                  readOnly
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.addZipcode || ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* ── Billing Address ──────────────────────────────────────────── */}
          <div className="p-5 rounded-md mt-2 pb-4">
            <h2 className="text-[20px] text-gray-700 mb-2 border-b border-gray-300 pb-3">
              Billing Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {/* Address 1 */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Address 1
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.baAddress1 || ""}
                  readOnly
                />
              </div>
              {/* Address 2 */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Address 2
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.baAddress2 || ""}
                  readOnly
                />
              </div>

              {/* Address 3 */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Address 3
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.baAddress3 || ""}
                  readOnly
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Country
                </label>

                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.baCountry || ""}
                  readOnly
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  State
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.baState || ""}
                  readOnly
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.baCity || ""}
                  readOnly
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.baZipcode || ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end mt-10">
            <button
              type="button"
              onClick={handleNext}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}