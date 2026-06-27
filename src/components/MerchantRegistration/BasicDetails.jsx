import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
// import { toast } from "react-toastify";
import { toast } from "react-toastify";


export default function BasicDetails({ data, setData, handleNext, errors,
  setErrors,
  handleBack }) {
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [mccList, setMccList] = useState([]);
  const [partnerLogo, setPartnerLogo] = useState(null);
  const [refId, setRefId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

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

  const documentOptions = [
    { label: "Aadhar No", name: "bddDocument", value: "AadharNo" },
    { label: "Form 60", name: "bddDocument", value: "Form60" },
  ];
  const sezOptions = [
    { label: "SEZ", value: "BDD_SEZDetail" },
    { label: "GST", value: "BDD_GSTDetail" },
  ];
  //  SAVE API METHOD
  const saveMerchantDetails = async () => {
    const payload = {
      ref_id: data?.refId || refId,
      createdBy: userData?.userName,
      createdDate: new Date().toLocaleDateString("en-CA"),

      partnerLogoCheck: data?.partnerLogoCheck,
      storeChannel: data?.channel,
      storeType: data?.storeType,
      storeTurnoverCategory: data?.turnoverCategory,
      storeDbaName: data?.storeDbaName,
      storeLegalName: data?.storeLegalName,
      bddDocument: data?.bddDocuments,
      bddGst: data?.bddGst,
      bddSez: data?.bddSez,
      bddPanNo: data?.bddPanNo,
      bddGstnNO: data?.bddGstnNO,
      bddAadharNo: data?.aadharNo,
      sezDetail: data?.sezDetail,
      riskCheck: data?.riskCheck,
      bddCategory: data?.category,
      bddAgpMcc: data?.mcc,
      bddPremisesType: data?.premisesType,
      bddVintageType: data?.vintageType,
      bddMerchantBusinessType: data?.merchantBusinessType,
      bddMerchantWebsiteURL: data?.merchantWebsiteUrl,
      bddRegistrationDate: data?.registrationDate,
      bddApplicationNo: data?.applicationNo,
      bddCorporateNo: data?.corporateNo,
      bddYearsInBusiness: data?.yearsInBusiness,
      bddClosestCompetitor: data?.closestCompetitor,
      bddShopsInCountry: data?.shopsCount,
      bddAverageTicketSize: data?.avgTicketSize,
      bddDefineBusiness: data?.businessDefine,
      bddCorporateNo: data?.bddCorporateNo,
      addStoreAddress1: data?.addStoreAddress1,
      addStoreAddress2: data?.addStoreAddress2,
      addStoreAddress3: data?.addStoreAddress3,
      addCity: data?.addCity,
      addState: data?.addState,
      addCountry: data?.addCountry,
      addZipcode: data?.addZipcode,
      cpdNameTitle: data?.cpdNamePrefix,
      cpdName: data?.cpdName,
      cpdDateOfBirth: data?.cpdDob,
      cpdPhoneNo: data?.cpdPhone,
      cpdMobile: data?.cpdMobile,
      cpdFax: data?.cpdFax,
      cpdPrimaryEmailId: data?.cpdPrimaryEmailId,
      cpdSecondaryEmailId: data?.cpdSecondaryEmailId,
      baAddress1: data?.billingAddress1,
      baAddress2: data?.billingAddress2,
      baAddress3: data?.billingAddress3,
      baCity: data?.billingCity,
      baState: data?.billingState,
      baCountry: data?.billingCountry,
      baZipcode: data?.billingZipcode,
    };
    const multipartData = new FormData();
    multipartData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      })
    );

    if (data?.partnerLogoFile) {
      multipartData.append("partnerLogo", data.partnerLogoFile);
    }
    try {
      const res = await axiosInstance.post("/saveMerchant",
        multipartData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API RESPONSE =======>", res)
      if (res?.respCode === 0) {
        toast.success(res?.respMsg);
        setData((prev) => ({
          ...prev,
          refId: res?.respData?.ref_id,
        }));

        handleNext();
      } else {
        toast.error(res?.respMsg);
        if (res?.respData && typeof res.respData === "object") {
          Object.values(res.respData).forEach((msg) => {
            toast.error(msg);
          });
        }

      }
    } catch (error) {
      console.error("cath printing =======>", error);
      toast.error(error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveMerchantDetails();
      }}
    >
      <h2 className="text-2xl uppercase pb-2 text-blue-900 font-extrabold">
        Basic Details Form
      </h2>
      <p className="pb-3 text-lg text-blue-900">Basic Details Form collects essential information such as personal and contact details to create a user profile.
      </p>
      <div className="border-t border-gray-300 pt-4">
        {/* Store Onboarding Status */}
        <h2 className="text-[20px] text-gray-700 mb-6">
          Store Onboarding Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <label className="text-gray-900 text-[15px] rounded-full border bg-yellow-300 px-4 py-2 font-medium">
              Created By : {userData?.userName}
            </label>
          </div>
          <div>
            <label className="text-gray-700 text-[15px] pe-3">
              Created Date : {new Date().toLocaleDateString()}
            </label>
            <span className="mx-2">|</span>{" "}

            <label className="text-gray-700 text-[15px]">
              {new Date().toLocaleTimeString()}
            </label>
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
                    name="storeType"
                    value={type}
                    checked={data?.storeType === type}
                    onChange={(e) =>
                      handleChange("storeType", e.target.value)
                    }
                  />
                  {type}
                </label>
              ))}
            </div>

            {errors?.storeType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.storeType}
              </p>
            )}
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
                    name="channel"
                    value={ch}
                    checked={data?.channel === ch}
                    onChange={(e) =>
                      handleChange("channel", e.target.value)
                    }
                  />
                  {ch}
                </label>
              ))}
            </div>

            {errors?.channel && (
              <p className="text-red-500 text-xs mt-1">
                {errors.channel}
              </p>
            )}
          </div>

          {/* Turnover Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Turnover Category
            </label>

            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.turnoverCategory || ""}
              onChange={(e) =>
                handleChange("turnoverCategory", e.target.value)
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

          {/* Partner Logo */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Partner Logo{" "}
              <span className="text-sm text-gray-500 font-normal">
                (jpg or png)
              </span>
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files[0];
                setPartnerLogo(file);
                handleChange("partnerLogoFile", file);
              }}
              className="
                      block
                      w-full
                      text-sm
                      text-gray-700
                      border
                      border-gray-300
                      rounded
                      bg-white
                      file:mr-3
                      file:px-3
                      file:py-1
                      file:border-0
                      file:border-r
                      file:border-gray-300
                      file:bg-gray-100
                      file:text-black
                      file:text-sm
                      hover:file:bg-gray-200
                    "
            />
          </div>

          {/* Store Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Store Name (Business Name)
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.storeDbaName || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                handleChange("storeDbaName", value);
              }}
            />

            {errors?.storeDbaName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.storeDbaName}
              </p>
            )}
          </div>

          {/* Legal Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Legal Name
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.storeLegalName || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                handleChange("storeLegalName", value);
              }}
            />

            {errors?.storeLegalName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.storeLegalName}
              </p>
            )}
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
                    value={doc.value}
                    checked={data?.bddDocuments === doc.value}
                    onChange={(e) =>
                      handleChange("bddDocuments", e.target.value)
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
              Aadhar No.<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="aadharNo"
              maxLength={12}
              required
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.aadharNo || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange("aadharNo", value);
              }}
            />
            {errors?.aadharNo && (
              <p className="text-red-500 text-xs mt-1">{errors.aadharNo}</p>
            )}
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
                    name="sezDetail"
                    value={item.value}
                    checked={data?.sezDetail === item.value}
                    onChange={(e) =>
                      handleChange("sezDetail", e.target.value)
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
              GSTN No.<span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              maxLength={15}
              required
              placeholder="Eg. 27AAPFU0939F1ZV"
              className="w-full border border-gray-300 rounded px-3 py-2 uppercase"
              value={data?.bddGstnNO || ""}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();

                // Allow only A-Z and 0-9
                if (/^[A-Z0-9]*$/.test(value)) {
                  handleChange("bddGstnNO", value);

                  // GST Validation
                  const gstRegex =
                    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

                  if (value.length === 15) {
                    if (!gstRegex.test(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        bddGstnNO: "Invalid GST format",
                      }));
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        bddGstnNO: "",
                      }));
                    }
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      bddGstnNO: "GST must be 15 characters",
                    }));
                  }
                }
              }}
            />

            {errors?.bddGstnNO && (
              <p className="text-red-500 text-xs mt-1">
                {errors.bddGstnNO}
              </p>
            )}
          </div>

          {/* Pan No */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Pan No<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 uppercase"
              value={data?.bddPanNo || ""}
              maxLength={10}
              placeholder="Eg. ABCDE1234F"
              required
              onChange={(e) => {
                const value = e.target.value.toUpperCase();

                // Allow only valid characters (A-Z, 0-9)
                if (/^[A-Z0-9]*$/.test(value)) {
                  handleChange("bddPanNo", value);

                  // Format validation (only when length is 10)
                  if (value.length === 10) {
                    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

                    if (!panRegex.test(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        bddPanNo: "Invalid PAN format (e.g. ABCDE1234F)",
                      }));
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        bddPanNo: "",
                      }));
                    }
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      bddPanNo: "PAN must be 10 characters",
                    }));
                  }
                }
              }}
            />

            {errors?.bddPanNo && (
              <p className="text-red-500 text-xs mt-1">{errors.bddPanNo}</p>
            )}
          </div>

          {/* Risk Check */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Risk Check<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.riskCheck || ""}
              onChange={(e) => handleChange("riskCheck", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors?.riskCheck && (
              <p className="text-red-500 text-xs mt-1">{errors.riskCheck}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
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
              MCC<span className="text-red-500">*</span>
            </label>

            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.mcc || ""}
              onChange={(e) => handleChange("mcc", e.target.value)}
            >
              <option value="">-- Select --</option>

              {mccList.map((item, index) => {
                const fullText = `${item.code} - ${String(item.name)}`;

                return (
                  <option key={index} value={fullText}>
                    {fullText}
                  </option>
                );
              })}
            </select>

            {errors?.mcc && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mcc}
              </p>
            )}
          </div>

          {/* Premises Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Premises Type</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.premisesType || ""}
              onChange={(e) => handleChange("premisesType", e.target.value)}
            >
              <option value="">-- Select --</option>
              {["Leased(Regd)", "Leased(Un-Regd)", "Owned", "Rent Letter"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Vintage Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Vintage Type</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.vintageType || ""}
              onChange={(e) => handleChange("vintageType", e.target.value)}
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
            <label className="block text-gray-700 font-medium mb-2">Merchant Business Type</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.merchantBusinessType || ""}
              onChange={(e) => handleChange("merchantBusinessType", e.target.value)}
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
              value={data?.merchantWebsiteUrl || ""}
              onChange={(e) =>
                handleChange("merchantWebsiteUrl", e.target.value)
              }
            />

            {errors?.merchantWebsiteUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.merchantWebsiteUrl}
              </p>
            )}
          </div>

          {/* Registration Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Registration Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.registrationDate || ""}
              onChange={(e) => handleChange("registrationDate", e.target.value)}
            />
          </div>

          {/* Application No */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Application No
            </label>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Eg. 123456"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.applicationNo || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange("applicationNo", value);
              }}
            />
          </div>

          {/* Corporate Identification Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Corporate Identification Number (CIN)
            </label>

            <input
              type="text"
              maxLength={21}
              placeholder="Eg. L01631KA2010PTC096843"
              className="w-full border border-gray-300 rounded px-3 py-2 uppercase"
              value={data?.bddCorporateNo || ""}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();

                // Allow only capital letters and numbers
                if (/^[A-Z0-9]*$/.test(value)) {
                  handleChange("bddCorporateNo", value);

                  // CIN validation regex
                  const cinRegex =
                    /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

                  if (value.length === 21) {
                    if (!cinRegex.test(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        bddCorporateNo: "Invalid CIN format",
                      }));
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        bddCorporateNo: "",
                      }));
                    }
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      bddCorporateNo: "CIN must be 21 characters",
                    }));
                  }
                }
              }}
            />

            {errors?.bddCorporateNo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.bddCorporateNo}
              </p>
            )}
          </div>

          {/* Years in Business */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Years in Business
            </label>

            <input
              type="text"
              maxLength={3}
              inputMode="numeric"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.yearsInBusiness || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange("yearsInBusiness", value);
              }}
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
              value={data?.closestCompetitor || ""}
              onChange={(e) => handleChange("closestCompetitor", e.target.value)}
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
              value={data?.shopsCount || ""}
              onChange={(e) => handleChange("shopsCount", e.target.value)}
            />
          </div>

          {/* Average Ticket Size */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Average Ticket Size</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.avgTicketSize || ""}
              onChange={(e) => handleChange("avgTicketSize", e.target.value)}
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
                <label key={b} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="businessType"
                    value={b}
                    checked={data?.businessDefine === b}
                    onChange={(e) => handleChange("businessDefine", e.target.value)}
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Store Address ─────────────────────────────────────────────── */}
      <div className="">
        <h2 className="text-[20px] text-gray-700 mb-6 border-b border-gray-300 pb-3 pt-5">Store Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {[
            { label: "Address 1", field: "addStoreAddress1", required: true },
            { label: "Address 2", field: "addStoreAddress2" },
            { label: "Address 3", field: "addStoreAddress3" },
          ].map(({ label, field, required }) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium mb-2">
                {label}{required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={data?.[field] || ""}
                onChange={(e) => handleChange(field, e.target.value)}
              />
              {errors?.[field] && (
                <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          {/* Country */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Country<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.addCountry || ""}
              onChange={(e) => handleChange("addCountry", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="India">India</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              State<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.addState || ""}
              onChange={(e) => handleChange("addState", e.target.value)}
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
              City<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={data?.addCity || ""}
              onChange={(e) => handleChange("addCity", e.target.value)}
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
              Zip Code<span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.addZipcode || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange("addZipcode", value);
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Contact Person Details ───────────────────────────────────── */}
      <div className="rounded-md mt-8">
        <h2 className="text-[20px] text-gray-700 mb-6 border-b border-gray-300 pb-3">Contact Person Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {/* Full Name with prefix */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Full Name<span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <select
                className="border border-gray-300 rounded-l px-3 py-2 bg-white w-24"
                value={data?.cpdNamePrefix || ""}
                onChange={(e) => handleChange("cpdNamePrefix", e.target.value)}
              >
                <option value="">Title</option>
                {["Mr", "Ms", "Mrs", "Miss", "Dr"].map((p) => (
                  <option key={p} value={p}>{p}.</option>
                ))}
              </select>
              <input
                type="text"
                className="w-full border border-l-0 border-gray-300 rounded-r px-3 py-2"
                value={data?.cpdName || ""}
                required
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  handleChange("cpdName", value);
                }}
              />
            </div>
            {errors?.cpdName && (
              <p className="text-red-500 text-xs mt-1">{errors.cpdName}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.cpdDob || ""}
              onChange={(e) => handleChange("cpdDob", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Phone No. with STD Code
            </label>

            <input
              type="text"
              maxLength={12}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Eg.919669696944 or 02228030560"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.cpdPhone || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange("cpdPhone", value);
              }}
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mobile<span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              maxLength={10}
              required
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.cpdMobile || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange("cpdMobile", value);
              }}
            />
          </div>

          {/* Fax */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Fax</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.cpdFax || ""}
              onChange={(e) => handleChange("cpdFax", e.target.value)}
            />
          </div>

          {/* Primary Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Primary Email Id<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Eg. example@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.cpdPrimaryEmailId || ""}
              required
              onChange={(e) => handleChange("cpdPrimaryEmailId", e.target.value)}
            />
            {errors?.cpdPrimaryEmailId && (
              <p className="text-red-500 text-xs mt-1">{errors.cpdPrimaryEmailId}</p>
            )}
          </div>

          {/* Secondary Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Secondary Email Id</label>
            <input
              type="email"
              placeholder="Eg. example@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={data?.cpdSecondaryEmailId || ""}
              onChange={(e) => handleChange("cpdSecondaryEmailId", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Billing Address ──────────────────────────────────────────── */}
      <div className="rounded-md mt-8">
        <h2 className="text-[20px] text-gray-700 mb-2 border-b border-gray-300 pb-3">
          Billing Address
        </h2>

        {/* Checkbox */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm text-gray-600 italic">
            <input
              type="checkbox"
              checked={data?.billingSameAsShipping || false}
              onChange={(e) => {
                const checked = e.target.checked;
                handleChange("billingSameAsShipping", checked);

                if (checked) {
                  setData({
                    ...data,

                    billingSameAsShipping: true,

                    billingAddress1: data?.addStoreAddress1 || "",
                    billingAddress2: data?.addStoreAddress2 || "",
                    billingAddress3: data?.addStoreAddress3 || "",

                    billingCountry: data?.addCountry || "",
                    billingState: data?.addState || "",
                    billingCity: data?.addCity || "",

                    billingZipcode: data?.addZipcode || "",
                  });
                }
              }}
            />

            Same as Shipping Address
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

          {/* Address Fields */}
          {[
            { label: "Address 1", field: "billingAddress1", required: true },
            { label: "Address 2", field: "billingAddress2" },
            { label: "Address 3", field: "billingAddress3" },
          ].map(({ label, field, required }) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium mb-2">
                {label}
                {required && <span className="text-red-500">*</span>}
              </label>

              <input
                type="text"
                disabled={data?.billingSameAsShipping}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={data?.[field] || ""}
                onChange={(e) =>
                  handleChange(field, e.target.value)
                }
              />
            </div>
          ))}

          {/* Country */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Country<span className="text-red-500">*</span>
            </label>

            <select
              disabled={data?.billingSameAsShipping}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={data?.billingCountry || ""}
              onChange={(e) =>
                handleChange("billingCountry", e.target.value)
              }
            >
              <option value="">-- Select --</option>
              <option value="India">India</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              State<span className="text-red-500">*</span>
            </label>

            <select
              disabled={data?.billingSameAsShipping}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={data?.billingState || ""}
              onChange={(e) =>
                handleChange("billingState", e.target.value)
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
              City<span className="text-red-500">*</span>
            </label>

            <select
              disabled={data?.billingSameAsShipping}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={data?.billingCity || ""}
              onChange={(e) =>
                handleChange("billingCity", e.target.value)
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
              Zip Code<span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={data?.billingSameAsShipping}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={data?.billingZipcode || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange("billingZipcode", value);
              }}
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end mt-10">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
          >
            Save & Next
          </button>
        </div>
      </div>
    </form>
  );
}