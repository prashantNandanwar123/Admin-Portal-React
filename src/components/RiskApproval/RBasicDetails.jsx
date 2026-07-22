import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";

export default function BasicDetails({ refId, data, setData, errors, handleNext }) {
  const [apiData, setApiData] = useState({});
  const [cityList, setCityList] = useState([]);
  const [mccList, setMccList] = useState([]);
  const [partnerLogo, setPartnerLogo] = useState(null);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <label className="text-gray-700 text-[15px]">
                Created By : {apiData?.createdBy}
              </label>
            </div>
            <div>
              <label className="text-gray-700 text-[15px] pe-5">
                Created Date : {apiData?.createdDate}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-49 text-gray-700 font-medium">
                Sourcing Channel<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.basicSrcChannel || ""}
                readOnly
              />
            </div>
          </div>

          {/* Store Information */}
          <h2 className="text-[20px] text-gray-700 mt-10 mb-6 border-b border-gray-300 pb-5">
            Store Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Store Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Store Type
              </label>
              <div className="flex items-center gap-5">
                {["Physical", "Web Store"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={apiData?.storeType === type}
                      readOnly
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Channel */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Channel
              </label>
              <div className="flex items-center gap-5">
                {["IPG", "POS"].map((ch) => (
                  <label key={ch} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={apiData?.storeChannel === ch}
                      readOnly
                    />
                    {ch}
                  </label>
                ))}
              </div>
            </div>

            {/* Turnover Category */}
            <div>
              <label className="text-gray-700 font-medium">
                Sourcing Channel
              </label>
              <p className="mt-2 text-gray-800">
                {apiData?.basicSrcChannel || "-"}
              </p>
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
                Store Name (Business Name)
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
                Legal Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.storeLegalName || ""}
                readOnly
              />
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

            {/* Premises Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Premises Type
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddPremisesType || ""}
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
            </div>

            {/* Registration Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Registration Date
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddRegistrationDate || ""}
                readOnly
              />
            </div>

            {/* Application No */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Application No
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddApplicationNo || ""}
                readOnly
              />
            </div>

            {/* Corporate Identification Number(CIN) */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Corporate Identification Number(CIN)
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddCorporateNo || ""}
                readOnly
              />
            </div>
            {/* Years in Business */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Years in Business
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddYearsInBusiness || ""}
                readOnly
              />
            </div>

            {/* Closest Competitor */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Who is your closest competitor?
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddClosestCompetitor || ""}
                readOnly
              />
            </div>

            {/* Shops Count */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                How many shops do you have in the country?
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddShopsInCountry || ""}
                readOnly
              />
            </div>
            {/* Average Ticket Size */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Average Ticket Size
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.bddAverageTicketSize || ""}
                readOnly
              />
            </div>

            {/* Business Define */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                How do you define your Business
              </label>

              <div className="flex items-center gap-5">
                {["Fast Growing", "Mature"].map((b) => (
                  <label key={b} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={apiData?.bddDefineBusiness === b}
                      readOnly
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[20px] text-gray-700 mb-6 border-b border-gray-300 pb-3 pt-5">
              Store Address
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

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone No. with STD Code
                </label>

                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.cpdPhoneNo || ""}
                  readOnly
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Mobile
                </label>

                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.cpdMobile || ""}
                  readOnly
                />
              </div>

              {/* Fax */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Fax
                </label>

                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  value={apiData?.cpdFax || ""}
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
      </div >
    </>
  );
}