import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import statecity from "../../utils/statecity.json";
import Select from "react-select";
import { useRef } from "react";
import { User, Calendar, Clock, ArrowRight, UserRound, FileText, UserPlus } from "lucide-react";


export default function BasicDetails({
  data,
  setData,
  handleNext,
  errors,
  setErrors
}) {

  const [mccList, setMccList] = useState([]);
  const [legalVehicalNameList, setlegalVehicalNameList] = useState([]);
  const [partnerLogo, setPartnerLogo] = useState(null);
  const [refId, setRefId] = useState(null);
  const [userData, setUserData] = useState(null);
  const fileRef = useRef(null);

  const countryList = statecity.map((item) => item.country);

  const disabledSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled ? "#f3f4f6" : "#fff",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      opacity: 1,
    }),

    valueContainer: (base) => ({
      ...base,
      cursor: "inherit",
    }),

    singleValue: (base) => ({
      ...base,
      color: "#111827",
      opacity: 1,
    }),

    indicatorsContainer: (base, state) => ({
      ...base,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),

    dropdownIndicator: (base, state) => ({
      ...base,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
  };

  // Selected Country
  const selectedCountry = statecity.find(
    (item) => item.country === data?.addCountry
  );

  const stateList = selectedCountry?.states || [];
  // Selected State
  const selectedState = stateList.find(
    (item) => item.state === data?.addState
  );
  // Cities of selected state
  const cityList = selectedState?.cities || [];

  // Billing Country
  const selectedBillingCountry = statecity.find(
    (item) => item.country === data?.billingCountry
  );

  // Billing States
  const billingStateList = selectedBillingCountry?.states || [];

  // Billing State
  const selectedBillingState = billingStateList.find(
    (item) => item.state === data?.billingState
  );

  // Billing Cities
  const billingCityList = selectedBillingState?.cities || [];


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
      const apiData = response?.respData || {};
      setlegalVehicalNameList(apiData?.legalVehicalNameList || []);

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
    {
      label: "SEZ",
      value: "BDD_SEZDetail",
    },
    {
      label: "GST",
      value: "BDD_GSTDetail",
    },
  ];

  //  SAVE API METHOD
  const saveMerchantDetails = async () => {
    const payload = {
      ref_id: data?.refId || refId,
      createdBy: userData?.userName,
      createdDate: new Date().toLocaleDateString("en-CA"),
      basicSrcChannel: data?.basicSrcChannel,
      partnerLogoCheck: data?.partnerLogoCheck,
      storeDbaName: data?.storeDbaName,
      storeLegalName: data?.storeLegalName,
      bddDocument: data?.bddDocuments,
      bddGst: data?.bddGst,
      bddSez: data?.bddSez,
      bddPanNo: data?.bddPanNo,
      bddGstnNO: data?.bddGstnNO,
      bddAadharNo: data?.aadharNo,
      riskCheck: data?.riskCheck,
      bddCategory: data?.category,
      bddAgpMcc: data?.mcc,
      bddVintageType: data?.vintageType,
      bddMerchantBusinessType: data?.merchantBusinessType,
      bddMerchantWebsiteURL: data?.merchantWebsiteUrl,
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
      cpdMobile: data?.cpdMobile,
      cpdPrimaryEmailId: data?.cpdPrimaryEmailId,
      cpdSecondaryEmailId: data?.cpdSecondaryEmailId,

      baAddress1: data?.billingAddress1,
      baAddress2: data?.billingAddress2,
      baAddress3: data?.billingAddress3,

      baCountry: data?.billingCountry,
      baState: data?.billingState,
      baCity: data?.billingCity,
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
      toast.error(error);
    }
  };

  return (

    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveMerchantDetails();
      }}
      className="space-y-4"
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 text-yellow-600">
            <UserPlus size={18} />
          </span>
          <h2 className="text-xl sm:text-2xl uppercase text-blue-900 font-semibold">
            Merchant Onboarding
          </h2>
        </div>
        <p className="ml-12 text-lg text-blue-900">Basic Merchant Information</p>
      </div>

      {/* ── Store Onboarding Status ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Created By / Date / Time strip */}
          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-amber-50 rounded-xl px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <User size={16} className="text-gray-600" />
              </span>
              <div className="leading-tight">
                <p className="text-[11px] text-gray-500">Created By</p>
                <p className="text-sm font-semibold text-gray-900">
                  {userData?.userName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Calendar size={16} className="text-gray-600" />
              </span>
              <div className="leading-tight">
                <p className="text-[11px] text-gray-500">Created Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Clock size={16} className="text-gray-600" />
              </span>
              <div className="leading-tight">
                <p className="text-[11px] text-gray-500">Created Time</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact Person Details ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
            <UserRound className="w-4 h-4 text-yellow-500" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 uppercase">
            Contact Person Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Full Name with prefix */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Full Name<span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <select
                className="border border-gray-200 rounded-l-lg px-3 h-[44px] bg-white w-24 text-sm outline-none focus:border-amber-400"
                value={data?.cpdNamePrefix || ""}
                onChange={(e) => handleChange("cpdNamePrefix", e.target.value)}
              >
                <option value="">Title</option>
                {["Mr", "Ms", "Mrs", "Miss", "Dr"].map((p) => (
                  <option key={p} value={p}>
                    {p}.
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="w-full border border-l-0 border-gray-200 rounded-r-lg px-3 h-[44px] text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
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
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.cpdDob || ""}
              onChange={(e) => handleChange("cpdDob", e.target.value)}
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Mobile No<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              required
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.cpdMobile || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange("cpdMobile", value);
              }}
            />
          </div>

          {/* Primary Email */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Primary Email Id<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Eg. example@example.com"
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm outline-none placeholder:text-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.cpdPrimaryEmailId || ""}
              required
              onChange={(e) => handleChange("cpdPrimaryEmailId", e.target.value)}
            />
            {errors?.cpdPrimaryEmailId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cpdPrimaryEmailId}
              </p>
            )}
          </div>

          {/* Secondary Email */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Secondary Email Id
            </label>
            <input
              type="email"
              placeholder="Eg. example@example.com"
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm outline-none placeholder:text-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.cpdSecondaryEmailId || ""}
              onChange={(e) => handleChange("cpdSecondaryEmailId", e.target.value)}
            />
          </div>

          {/* Reseller Partner */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Reseller Partner<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm bg-white shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.basicSrcChannel || ""}
              onChange={(e) => handleChange("basicSrcChannel", e.target.value)}
            >
              <option value="">Select reseller partner</option>
              {legalVehicalNameList?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Basic Document Details ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
            <FileText className="w-4 h-4 text-yellow-500" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 uppercase">
            Basic Document Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Documents radio */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-3">
              Documents
            </label>
            <div className="flex items-center gap-5">
              {documentOptions.map((doc) => (
                <label
                  key={doc.value}
                  className="flex items-center gap-2 text-sm text-gray-700
                  "
                >
                  <input
                    type="radio"
                    className="accent-amber-500 w-4 h-4"
                    value={doc.value}
                    checked={data?.bddDocuments === doc.value}
                    onChange={(e) => handleChange("bddDocuments", e.target.value)}
                  />
                  {doc.label}
                </label>
              ))}
            </div>
          </div>

          {/* Aadhar No */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Aadhar No.<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="aadharNo"
              maxLength={12}
              required
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
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
            <label className="block text-sm text-gray-700 font-medium mb-2">
              SEZ Detail
            </label>

            <div className="border border-gray-200 rounded-full px-5 h-[44px] flex items-center gap-6 bg-white">
              {sezOptions.map((item) => (
                <label
                  key={item.value}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="radio"
                    name="sezDetail"
                    className="accent-amber-500 w-4 h-4"
                    value={item.value}
                    checked={
                      (item.value === "BDD_SEZDetail" &&
                        data?.bddSez === "BDD_SEZDetail") ||
                      (item.value === "BDD_GSTDetail" &&
                        data?.bddGst === "BDD_GSTDetail")
                    }
                    onChange={() => {
                      if (item.value === "BDD_SEZDetail") {
                        setData((prev) => ({
                          ...prev,
                          bddSez: "BDD_SEZDetail",
                          bddGst: "",
                        }));
                      } else if (item.value === "BDD_GSTDetail") {
                        setData((prev) => ({
                          ...prev,
                          bddGst: "BDD_GSTDetail",
                          bddSez: "",
                        }));
                      }
                    }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* GSTN No */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              GSTN No.<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={15}
              required
              placeholder="Eg. 27AAPFU0939F1ZV"
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm uppercase outline-none placeholder:text-gray-400 placeholder:normal-case focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.bddGstnNO || ""}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (/^[A-Z0-9]*$/.test(value)) {
                  handleChange("bddGstnNO", value);
                  const gstRegex =
                    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                  if (value.length === 15) {
                    if (!gstRegex.test(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        bddGstnNO: "Invalid GST format",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, bddGstnNO: "" }));
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
              <p className="text-red-500 text-xs mt-1">{errors.bddGstnNO}</p>
            )}
          </div>

          {/* Pan No */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Pan No<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm uppercase outline-none placeholder:text-gray-400 placeholder:normal-case focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.bddPanNo || ""}
              maxLength={10}
              placeholder="Eg. ABCDE1234F"
              required
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (/^[A-Z0-9]*$/.test(value)) {
                  handleChange("bddPanNo", value);
                  if (value.length === 10) {
                    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                    if (!panRegex.test(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        bddPanNo: "Invalid PAN format (e.g. ABCDE1234F)",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, bddPanNo: "" }));
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
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Risk Check<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm bg-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
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
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm bg-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">-- Select --</option>
              {[
                "Education",
                "Education Goverment",
                "Education Private",
                "Goverment",
                "Insurance",
                "Mutual Funds",
                "Travel",
                "Utility",
                "Retail",
                "ISP",
                "Cable",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* MCC */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              MCC<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm bg-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
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
            {errors?.mcc && <p className="text-red-500 text-xs mt-1">{errors.mcc}</p>}
          </div>

          {/* Vintage Type */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Vintage Type
            </label>
            <select
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm bg-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
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
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Merchant Business Type
            </label>
            <select
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm bg-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.merchantBusinessType || ""}
              onChange={(e) =>
                handleChange("merchantBusinessType", e.target.value)
              }
            >
              <option value="">-- Select --</option>
              {[
                "Companies Registered Act",
                "Govt, Govt Undertakings",
                "Individuals/Proprietor",
                "Individuals/Professionals",
                "LLPS",
                "Pertnership",
                "Proprietor",
                "Regd Trusts",
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Merchant Website URL */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Merchant Website URL
            </label>
            <input
              type="text"
              placeholder="https://www.example.com"
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm outline-none placeholder:text-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.merchantWebsiteUrl || ""}
              onChange={(e) => handleChange("merchantWebsiteUrl", e.target.value)}
            />
            {errors?.merchantWebsiteUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.merchantWebsiteUrl}
              </p>
            )}
          </div>

          {/* Partner Logo Check */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Partner Logo Check<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              className="w-full h-[44px] bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 cursor-pointer"
              value={data?.partnerLogoCheck || ""}
              onChange={(e) => {
                const value = e.target.value;
                handleChange("partnerLogoCheck", value);
                if (fileRef.current) {
                  fileRef.current.value = "";
                }
              }}
            >
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Partner Logo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Partner Logo
              <span className="text-xs text-gray-500 font-normal ml-1">
                (jpg or png)
              </span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              disabled={data?.partnerLogoCheck !== "Yes"}
              onChange={(e) => {
                const file = e.target.files[0];
                setPartnerLogo(file);
                handleChange("partnerLogoFile", file);
              }}
              className="block w-full h-[44px] text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer file:h-full file:mr-3 file:px-4 file:border-0 file:border-r file:border-gray-200 file:bg-gray-50 file:text-gray-700 file:text-sm file:font-medium hover:file:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Store Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name (Business Name)<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              className="w-full h-[44px] bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-700 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.storeDbaName || ""}
              placeholder="Enter store name"
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                handleChange("storeDbaName", value);
              }}
            />
            {errors?.storeDbaName && (
              <p className="text-red-500 text-xs mt-1">{errors.storeDbaName}</p>
            )}
          </div>

          {/* Legal Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Legal Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              className="w-full h-[44px] bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-700 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.storeLegalName || ""}
              placeholder="Enter legal name"
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                handleChange("storeLegalName", value);
              }}
            />
            {errors?.storeLegalName && (
              <p className="text-red-500 text-xs mt-1">{errors.storeLegalName}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Store Address ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-6 uppercase">
          Company Address
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Address 1", field: "addStoreAddress1", required: true },
            { label: "Address 2", field: "addStoreAddress2" },
            { label: "Address 3", field: "addStoreAddress3" },
          ].map(({ label, field, required }) => (
            <div key={field}>
              <label className="block text-sm text-gray-700 font-medium mb-2">
                {label}
                {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
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
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Country<span className="text-red-500">*</span>
            </label>
            <Select
              options={countryList.map((country) => ({
                value: country,
                label: country,
              }))}
              value={
                data?.addCountry
                  ? { value: data.addCountry, label: data.addCountry }
                  : null
              }
              onChange={(selected) =>
                setData((prev) => ({
                  ...prev,
                  addCountry: selected?.value || "",
                  addState: "",
                  addCity: "",
                }))
              }
              placeholder="Select Country"
              isSearchable
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              State<span className="text-red-500">*</span>
            </label>
            <Select
              options={stateList.map((item) => ({
                value: item.state,
                label: item.state,
              }))}
              value={
                data?.addState
                  ? { value: data.addState, label: data.addState }
                  : null
              }
              onChange={(selected) =>
                setData((prev) => ({
                  ...prev,
                  addState: selected?.value || "",
                  addCity: "",
                }))
              }
              placeholder="Select State"
              isSearchable
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              City<span className="text-red-500">*</span>
            </label>
            <Select
              options={cityList.map((city) => ({ value: city, label: city }))}
              value={
                data?.addCity ? { value: data.addCity, label: data.addCity } : null
              }
              onChange={(selected) =>
                setData((prev) => ({ ...prev, addCity: selected?.value || "" }))
              }
              isSearchable
            />
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Zip Code<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              value={data?.addZipcode || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange("addZipcode", value);
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Billing Address ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-2">
          Billing Address
        </h2>

        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm text-gray-600 italic">
            <input
              type="checkbox"
              className="accent-amber-500 w-4 h-4"
              checked={data?.billingSameAsShipping || false}
              onChange={(e) => {
                const checked = e.target.checked;
                handleChange("billingSameAsShipping", checked);
                if (checked) {
                  setData((prev) => ({
                    ...prev,
                    billingSameAsShipping: true,
                    billingAddress1: prev.addStoreAddress1 || "",
                    billingAddress2: prev.addStoreAddress2 || "",
                    billingAddress3: prev.addStoreAddress3 || "",
                    billingCountry: prev.addCountry || "",
                    billingState: prev.addState || "",
                    billingCity: prev.addCity || "",
                    billingZipcode: prev.addZipcode || "",
                  }));
                }
              }}
            />
            Same as Shipping Address
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Address 1", field: "billingAddress1", required: true },
            { label: "Address 2", field: "billingAddress2" },
            { label: "Address 3", field: "billingAddress3" },
          ].map(({ label, field, required }) => (
            <div key={field}>
              <label className="block text-sm text-gray-700 font-medium mb-2">
                {label}
                {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                disabled={data?.billingSameAsShipping}
                className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm bg-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={data?.[field] || ""}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            </div>
          ))}

          {/* Country */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Country<span className="text-red-500">*</span>
            </label>
            <Select
              styles={disabledSelectStyles}
              isDisabled={data?.billingSameAsShipping}
              options={countryList.map((country) => ({
                value: country,
                label: country,
              }))}
              value={
                data?.billingCountry
                  ? { value: data.billingCountry, label: data.billingCountry }
                  : null
              }
              onChange={(selected) =>
                setData((prev) => ({
                  ...prev,
                  billingCountry: selected?.value || "",
                  billingState: "",
                  billingCity: "",
                }))
              }
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              State<span className="text-red-500">*</span>
            </label>
            <Select
              styles={disabledSelectStyles}
              isDisabled={data?.billingSameAsShipping}
              options={billingStateList.map((item) => ({
                value: item.state,
                label: item.state,
              }))}
              value={
                data?.billingState
                  ? { value: data.billingState, label: data.billingState }
                  : null
              }
              onChange={(selected) =>
                setData((prev) => ({
                  ...prev,
                  billingState: selected?.value || "",
                  billingCity: "",
                }))
              }
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              City<span className="text-red-500">*</span>
            </label>
            <Select
              styles={disabledSelectStyles}
              isDisabled={data?.billingSameAsShipping}
              options={billingCityList.map((city) => ({
                value: city,
                label: city,
              }))}
              value={
                data?.billingCity
                  ? { value: data.billingCity, label: data.billingCity }
                  : null
              }
              onChange={(selected) =>
                setData((prev) => ({
                  ...prev,
                  billingCity: selected?.value || "",
                }))
              }
            />
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">
              Zip Code<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={data?.billingSameAsShipping}
              className="w-full h-[44px] border border-gray-200 rounded-lg px-3 text-sm bg-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            className="inline-flex items-center gap-2 bg-amber-400 text-gray-900 font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
          >
            Save & Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </form>
  );
}