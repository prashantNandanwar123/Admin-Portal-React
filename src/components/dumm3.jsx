import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";

export default function EBasicDetails({
  refId,
  data,
  setData,
  errors,
  handleNext,
}) {


  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [mccList, setMccList] = useState([]);
  // const [partnerLogo, setPartnerLogo] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!refId) return;
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `/viewMerchantBasicDetails/${refId}`
        );
        console.log("API RESPONSE:", response);
        if (response?.respCode === 0) {
          const res = response?.respData || {};
          setData((prev) => ({
            ...prev,
            ...res,

            refId:
              res?.ref_id ||
              res?.refId ||
              refId,
          }));

          console.log(
            "FINAL REF ID =====>",
            res?.ref_id || res?.refId || refId
          );

        }
      } catch (err) {
        console.error("API ERROR:", err);
      }
    };

    fetchData();
  }, [refId]);


  const documentOptions = [
    { label: "Aadhar No", value: "AadharNo" },
    { label: "Form 60", value: "Form60" },
  ];

  const sezOptions = [
    { label: "SEZ", value: "BDD_SEZDetail" },
    { label: "GST", value: "BDD_GSTDetail" },
  ];

  // COMMON HANDLE CHANGE
  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  //---- stateList-cityList-mccList API Call
  useEffect(() => {
    fetchDetailsCollection();
  }, []);

  const fetchDetailsCollection = async () => {
    try {
      const response = await axiosInstance.post("/getDetailsCollection");

      const apiData =
        response?.respData || response?.respData || {};

      setStateList(apiData?.stateList || []);
      setCityList(apiData?.cityList || []);

      const formattedMcc = Object.entries(apiData?.mccList || {}).map(
        ([code, name]) => ({
          code,
          name,
        })
      );

      setMccList(formattedMcc);
      setRefId(apiData?.ref_id);

      // store refId in parent state
      if (apiData?.ref_id) {
        handleChange("refId", apiData?.ref_id);
      }

    } catch (error) {
      console.error(
        "[BasicDetails] fetchDetailsCollection → API Error:",
        error
      );
    }
  };
  // Save Edit BasicDetails  API Call
  const handleSaveAndNext = async () => {
    try {

      const payload = {
        ref_id: data?.refId || refId,

        partnerLogoCheck: data?.partnerLogoCheck,
        basicSrcChannel: data?.storeChannel,
        storeType: data?.storeType,
        storeTurnoverCategory: data?.storeTurnoverCategory,
        storeDbaName: data?.storeDbaName,
        storeLegalName: data?.storeLegalName,

        bddDocument: data?.bddDocument,
        bddGst: data?.bddGst,
        bddSez: data?.bddSez,
        bddPanNo: data?.bddPanNo,
        bddGstnNO: data?.bddGstnNO,
        bddAadharNo: data?.bddAadharNo,

        riskCheck: data?.riskCheck,
        bddCategory: data?.bddCategory,
        bddAgpMcc: data?.bddAgpMcc,
        bddPremisesType: data?.bddPremisesType,
        bddVintageType: data?.bddVintageType,
        bddMerchantBusinessType:
          data?.bddMerchantBusinessType,

        bddMerchantWebsiteURL:
          data?.bddMerchantWebsiteURL,

        bddRegistrationDate:
          data?.bddRegistrationDate,

        bddApplicationNo: data?.bddApplicationNo,
        bddCorporateNo: data?.bddCorporateNo,
        bddYearsInBusiness: data?.bddYearsInBusiness,

        bddClosestCompetitor:
          data?.bddClosestCompetitor,

        bddShopsInCountry:
          data?.bddShopsInCountry,

        bddAverageTicketSize:
          data?.bddAverageTicketSize,

        bddDefineBusiness:
          data?.bddDefineBusiness,

        // ADDRESS
        addStoreAddress1: data?.addStoreAddress1,
        addStoreAddress2: data?.addStoreAddress2,
        addStoreAddress3: data?.addStoreAddress3,

        addCity: data?.addCity,
        addState: data?.addState,
        addCountry: data?.addCountry,
        addZipcode: data?.addZipcode,

        // CONTACT
        cpdNameTitle: data?.cpdNameTitle,
        cpdName: data?.cpdName,
        cpdDateOfBirth: data?.cpdDateOfBirth,
        cpdPhoneNo: data?.cpdPhoneNo,
        cpdMobile: data?.cpdMobile,
        cpdFax: data?.cpdFax,

        cpdPrimaryEmailId:
          data?.cpdPrimaryEmailId,

        cpdSecondaryEmailId:
          data?.cpdSecondaryEmailId,

        // BILLING
        baAddress1: data?.baAddress1,
        baAddress2: data?.baAddress2,
        baAddress3: data?.baAddress3,

        baCity: data?.baCity,
        baState: data?.baState,
        baCountry: data?.baCountry,
        baZipcode: data?.baZipcode,
      };

      console.log("REF ID PROP =====>", refId);
      console.log("DATA REF ID =====>", data?.refId);
      console.log("FINAL PAYLOAD =====>", payload);

      const multipartData = new FormData();

      multipartData.append(
        "data",
        new Blob([JSON.stringify(payload)], {
          type: "application/json",
        })
      );

      if (data?.partnerLogoFile) {
        multipartData.append(
          "partnerLogo",
          data.partnerLogoFile
        );
      }

      const response = await axiosInstance.post(
        "/saveEditMeBasicDetails",
        multipartData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("SAVE RESPONSE =====>", response);

      if (response?.respCode === 0) {

        toast.success(response?.respMsg);
        setData((prev) => ({
          ...prev,
          refId: response?.respData?.ref_id,
        }));


      } else {
        toast.error(
          response?.respMsg
        );
      }
    } catch (error) {
      console.error("SAVE ERROR =====>", error);
      toast.error(error);
    }
  };


  return (
    <>
      <div>
        <h2 className="text-2xl uppercase text-blue-900 font-extrabold py-2">
          Edited Basic Details
        </h2>
        <p className="pb-3 text-lg text-blue-900">Basic Details Form collects essential information such as personal and contact details to create a user profile.</p>

        <div className="pt-4 border-t border-gray-300">
          {/* STORE STATUS */}
          <h2 className="text-[20px] text-gray-700 mb-6">
            Store Onboarding Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <label className="text-gray-900 text-[15px] rounded-full border bg-yellow-300 px-4 py-2 font-medium">
                Created By : {data?.createdBy}
              </label>
            </div>

            <div>
              <label className="text-gray-700 text-[15px]">
                Created Date :
                <span className="ml-3">
                  {data?.createdDate?.split(" ")[0]}{" "}
                  <span className="mx-2">|</span>{" "}
                  {data?.createdDate?.split(" ")[1]}
                </span>
              </label>
            </div>
          </div>
          {/* STORE INFO */}
          <h2 className="text-[20px] text-gray-700 mt-10 mb-6 border-b border-gray-300 pb-5">
            Store Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* STORE TYPE */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Store Type
              </label>
              <div className="flex items-center gap-5">
                {["Physical", "Web Store"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      checked={data?.storeType === type}
                      onChange={() =>
                        handleChange("storeType", type)
                      }
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* CHANNEL */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Channel
              </label>

              <div className="flex items-center gap-5">
                {["IPG", "POS"].map((ch) => (
                  <label
                    key={ch}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      checked={data?.storeChannel === ch}
                      onChange={() =>
                        handleChange(
                          "storeChannel",
                          ch
                        )
                      }
                    />

                    {ch}
                  </label>
                ))}
              </div>
            </div>

            {/* Turnover Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Turnover Category
              </label>
              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.storeTurnoverCategory || ""}
                onChange={(e) =>
                  handleChange(
                    "storeTurnoverCategory",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                <option value="Small Merchant(<=20Lacs)">
                  Small Merchant(&lt;=20Lacs)
                </option>
                <option value="Other Merchant(>20Lacs)">
                  Other Merchant(&gt;20Lacs)
                </option>
              </select>
            </div>

            {/* Partner Logo Check */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Partner Logo Check
                <span className="text-red-500">*</span>
              </label>

              <select
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                value={data?.partnerLogoCheck || ""}
                onChange={(e) =>
                  handleChange("partnerLogoCheck", e.target.value)
                }
              >
                <option value="">-- Select --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              {errors?.partnerLogoCheck && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.partnerLogoCheck}
                </p>
              )}
            </div>

           
            {/* Store Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Store Name (Business Name)
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.storeDbaName || ""}
                onChange={(e) =>
                  handleChange(
                    "storeDbaName",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Legal Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Legal Name
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.storeLegalName || ""}
                onChange={(e) =>
                  handleChange(
                    "storeLegalName",
                    e.target.value
                  )
                }
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
                  <label
                    key={doc.value}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      checked={
                        data?.bddDocument === doc.value
                      }
                      onChange={() =>
                        handleChange(
                          "bddDocument",
                          doc.value
                        )
                      }
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
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddAadharNo || ""}
                onChange={(e) =>
                  handleChange(
                    "bddAadharNo",
                    e.target.value
                  )
                }
              />
            </div>

            {/* SEZ Detail */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SEZ Detail
              </label>

              <div className="border border-gray-300 rounded-full px-5 py-4 flex items-center gap-6 bg-white">
                {sezOptions.map((item) => (
                  <label
                    key={item.value}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      checked={
                        data?.bddSez === item.value
                      }
                      onChange={() =>
                        handleChange(
                          "bddSez",
                          item.value
                        )
                      }
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
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddGstnNO || ""}
                onChange={(e) =>
                  handleChange(
                    "bddGstnNO",
                    e.target.value
                  )
                }
              />
            </div>

            {/* PAN NO */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Pan No
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddPanNo || ""}
                onChange={(e) =>
                  handleChange(
                    "bddPanNo",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Risk Check */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Risk Check
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.riskCheck || ""}
                onChange={(e) =>
                  handleChange(
                    "riskCheck",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddCategory || ""}
                onChange={(e) =>
                  handleChange(
                    "bddCategory",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                {["Education", "Education Goverment", "Education Private", "Goverment", "Insurance", "Mutual Funds", "Travel", "Utility", "Retail", "ISP", "Cable"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* MCC */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                MCC
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddAgpMcc || ""}
                onChange={(e) =>
                  handleChange(
                    "bddAgpMcc",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                {Array.isArray(mccList) &&
                  mccList.map((item, index) => {
                    const fullText = `${item.code} - ${String(item.name)}`;
                    return (
                      <option key={index} value={fullText}>
                        {fullText}
                      </option>
                    );
                  })}
              </select>

            </div>

            {/* Premises Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Premises Type
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddPremisesType || ""}
                onChange={(e) =>
                  handleChange(
                    "bddPremisesType",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                {["Leased(Regd)", "Leased(Un-Regd)", "Owned", "Rent Letter"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}

              </select>
            </div>

            {/* Vintage Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Vintage Type
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddVintageType || ""}
                onChange={(e) =>
                  handleChange(
                    "bddVintageType",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                <option value="<1Y - New">&lt;1Y - New</option>
                <option value=">1<3Y">&gt;1&lt;3Y</option>
                <option value=">3<5Y">&gt;3&lt;5Y</option>
                <option value=">5Y">&gt;5Y</option>
              </select>
            </div>

            {/* Merchant Business Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Merchant Business Type
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={
                  data?.bddMerchantBusinessType || ""
                }
                onChange={(e) =>
                  handleChange(
                    "bddMerchantBusinessType",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                {["Companies Registered Act", "Govt, Govt Undertakings", "Individuals/Proprietor", "Individuals/Professionals", "LLPS", "Pertnership", "Proprietor", "Regd Trusts"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}

              </select>
            </div>

            {/* Merchant Website URL */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Merchant Website URL
              </label>

              <input
                type="text"
                placeholder="https://www.example.com"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddMerchantWebsiteURL || ""}
                onChange={(e) =>
                  handleChange(
                    "bddMerchantWebsiteURL",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Registration Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Registration Date
              </label>

              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddRegistrationDate || ""}
                onChange={(e) =>
                  handleChange(
                    "bddRegistrationDate",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Application No */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Application No
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddApplicationNo || ""}
                onChange={(e) =>
                  handleChange(
                    "bddApplicationNo",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Corporate Identification Number(CIN) */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Corporate Identification Number(CIN)
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddCorporateNo || ""}
                onChange={(e) =>
                  handleChange(
                    "bddCorporateNo",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Years in Business */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Years in Business
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddYearsInBusiness || ""}
                onChange={(e) =>
                  handleChange(
                    "bddYearsInBusiness",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Closest Competitor */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Who is your closest competitor?
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddClosestCompetitor || ""}
                onChange={(e) =>
                  handleChange(
                    "bddClosestCompetitor",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Shops Count */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                How many shops do you have in the country?
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddShopsInCountry || ""}
                onChange={(e) =>
                  handleChange(
                    "bddShopsInCountry",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Average Ticket Size */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Average Ticket Size
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.bddAverageTicketSize || ""}
                onChange={(e) =>
                  handleChange(
                    "bddAverageTicketSize",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                <option value="<2000">&lt;2000</option>
                <option value="<5000>2000">&lt;5000&gt;2000</option>
                <option value="<5001>10000">&lt;5001&gt;10000</option>
                <option value=">10001">&gt;10001</option>
              </select>
            </div>

            {/* Business Define */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                How do you define your Business
              </label>

              <div className="flex items-center gap-5">
                {["Fast Growing", "Mature"].map((b) => (
                  <label
                    key={b}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      checked={
                        data?.bddDefineBusiness === b
                      }
                      onChange={() =>
                        handleChange(
                          "bddDefineBusiness",
                          b
                        )
                      }
                    />

                    {b}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STORE ADDRESS */}
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
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.addStoreAddress1 || ""}
                onChange={(e) =>
                  handleChange(
                    "addStoreAddress1",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Address 2 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address 2
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.addStoreAddress2 || ""}
                onChange={(e) =>
                  handleChange(
                    "addStoreAddress2",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Address 3 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address 3
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.addStoreAddress3 || ""}
                onChange={(e) =>
                  handleChange(
                    "addStoreAddress3",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Country
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.addCountry || ""}
                onChange={(e) =>
                  handleChange(
                    "addCountry",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                <option value="India">India</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                State
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.addState || ""}
                onChange={(e) =>
                  handleChange(
                    "addState",
                    e.target.value
                  )
                }
              >

                <option value="">-- Select --</option>
                {stateList.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                City
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.addCity || ""}
                onChange={(e) =>
                  handleChange(
                    "addCity",
                    e.target.value
                  )
                }
              >

                <option value="">-- Select --</option>
                {cityList.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Zip Code
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.addZipcode || ""}
                onChange={(e) =>
                  handleChange(
                    "addZipcode",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>
        {/* ── Contact Person Details ───────────────────────────────────── */}
        <div className="rounded-md mt-8">
          <h2 className="text-[20px] text-gray-700 mb-6 border-b border-gray-300 pb-3">
            Contact Person Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>

              <div className="flex w-full">
                <select
                  className="border border-gray-300 rounded-l px-3 py-2 bg-white w-24"
                  value={data?.cpdNameTitle || ""}
                  onChange={(e) =>
                    handleChange("cpdNameTitle", e.target.value)
                  }
                >
                  <option value="">Title</option>

                  {["Mr", "Ms", "Mrs", "Miss", "Dr"].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Full Name"
                  className="flex-1 border border-l-0 border-gray-300 rounded-r px-3 py-2"
                  value={data?.cpdName || ""}
                  onChange={(e) =>
                    handleChange("cpdName", e.target.value)
                  }
                />
              </div>
            </div>
            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.cpdDateOfBirth || ""}
                onChange={(e) =>
                  handleChange(
                    "cpdDateOfBirth",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone No. with STD Code
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.cpdPhoneNo || ""}
                onChange={(e) =>
                  handleChange(
                    "cpdPhoneNo",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mobile
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.cpdMobile || ""}
                onChange={(e) =>
                  handleChange(
                    "cpdMobile",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Fax */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Fax
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.cpdFax || ""}
                onChange={(e) =>
                  handleChange(
                    "cpdFax",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Primary Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Primary Email Id
              </label>

              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.cpdPrimaryEmailId || ""}
                onChange={(e) =>
                  handleChange(
                    "cpdPrimaryEmailId",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Secondary Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Secondary Email Id
              </label>

              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.cpdSecondaryEmailId || ""}
                onChange={(e) =>
                  handleChange(
                    "cpdSecondaryEmailId",
                    e.target.value
                  )
                }
              />
            </div>

          </div>
        </div>

        {/* ── Billing Address ──────────────────────────────────────────── */}
        <div className="rounded-md mt-3 pb-4">
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
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.baAddress1 || ""}
                onChange={(e) =>
                  handleChange(
                    "baAddress1",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Address 2 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address 2
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.baAddress2 || ""}
                onChange={(e) =>
                  handleChange(
                    "baAddress2",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Address 3 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address 3
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.baAddress3 || ""}
                onChange={(e) =>
                  handleChange(
                    "baAddress3",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Country
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.baCountry || ""}
                onChange={(e) =>
                  handleChange(
                    "baCountry",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                <option value="India">India</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                State
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.baState || ""}
                onChange={(e) =>
                  handleChange(
                    "baState",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>
                {stateList.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                City
              </label>

              <select
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.baCity || ""}
                onChange={(e) =>
                  handleChange(
                    "baCity",
                    e.target.value
                  )
                }
              >
                <option value="">-- Select --</option>

                {cityList.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}

              </select>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Zip Code
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.baZipcode || ""}
                onChange={(e) =>
                  handleChange(
                    "baZipcode",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>
      </div >
      {/* SAVE BUTTON */}
      < div className="grid grid-cols-3 items-center mt-10" >
        {/* Empty Left Side */}
        < div ></div >
        {/* Center Button */}
        < div className="flex justify-center" >
          <button
            type="button"
            onClick={handleSaveAndNext}
            className="bg-green-500 hover:bg-green-500 text-white px-6 py-2 rounded"
          >
            Update
          </button>
        </div >

        {/* Right Button */}
        < div className="flex justify-end" >
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded"
          >
            Next
          </button>
        </div >
      </div >

    </>
  );
}