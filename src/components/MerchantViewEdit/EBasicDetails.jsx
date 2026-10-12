import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import statecity from "../../utils/statecity.json";
import Select from "react-select";
import {
  UserRound,
  CalendarDays,
  ChevronDown,
  MapPin,
  ReceiptText,
  UserPlus,
  FileText,
  Eye,
  Building2,
  Handshake,
  BriefcaseBusiness,
  Upload,
  ArrowRight,
  User
} from "lucide-react";

export default function EBasicDetails({
  refId,
  data,
  setData,
  handleNext,
}) {
  const [mccList, setMccList] = useState([]);
  const [legalVehicalNameList, setlegalVehicalNameList] = useState([]);
  const fileRef = useRef(null);
  const partnerLogoRef = useRef(null);
  const countryList = statecity.map((item) => item.country);

  // Selected Country
  const selectedCountry = statecity.find(
    (item) => item.country === data?.addCountry
  );

  // States of selected country
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

  //---- USeEffect API Call
  useEffect(() => {
    fetchDetailsCollection();
    fetchData(refId)
  }, []);

  const fetchData = async (refId) => {
    if (!refId) return;
    try {
      const response = await axiosInstance.post(
        `/viewMerchantBasicDetails/${refId}`
      );
      if (response?.respCode === 0) {
        const res = response?.respData || {};

        setData((prev) => ({
          ...prev,
          ...res,

          billingAddress1: res?.baAddress1 || "",
          billingAddress2: res?.baAddress2 || "",
          billingAddress3: res?.baAddress3 || "",

          billingCountry: res?.baCountry || "",
          billingState: res?.baState || "",
          billingCity: res?.baCity || "",
          billingZipcode: res?.baZipcode || "",

          refId: res?.ref_id || res?.refId || refId,
        }));
      }
    } catch (error) {
      toast.error(error);
    }
  };


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


  const fetchDetailsCollection = async () => {
    try {
      const response = await axiosInstance.post("/getDetailsCollection");
      const apiData = response?.respData || response?.respData || {};
      setlegalVehicalNameList(apiData?.legalVehicalNameList || []);
      const formattedMcc = Object.entries(apiData?.mccList || {}).map(
        ([code, name]) => ({
          code,
          name,
        })
      );
      setMccList(formattedMcc);
    } catch (error) {
      toast.error(error);
    }
  };
  const handleViewFile = async (fileName) => {
    if (!refId || !fileName) {
      toast.error("RefId or file name is missing");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/merchant/kyc/viewKycDocs",
        {},
        {
          params: {
            refId: refId,
            fileName: fileName,
          },
          responseType: "blob",
        }
      );
      const fileUrl = URL.createObjectURL(response);
      window.open(fileUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 10000);

    } catch (error) {
      toast.error(error);
    }
  };
  // Save Edit BasicDetails  API Call
  const handleSaveAndNext = async () => {
    try {
      const payload = {

        ref_id: data?.refId || refId,
        partnerLogoCheck: data?.partnerLogoCheck,
        basicSrcChannel: data?.basicSrcChannel,
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
        bddVintageType: data?.bddVintageType,
        bddMerchantBusinessType: data?.bddMerchantBusinessType,
        bddMerchantWebsiteURL: data?.bddMerchantWebsiteURL,
        companyType: data?.companyType,

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
        cpdPrimaryEmailId: data?.cpdPrimaryEmailId,
        cpdSecondaryEmailId: data?.cpdSecondaryEmailId,

        // BILLING
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

      const response = await axiosInstance.post(
        "/saveEditMeBasicDetails",
        multipartData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.respCode === 0) {
        toast.success(response?.respMsg);
        setData((prev) => ({
          ...prev,
          refId: response?.respData?.ref_id,
          // old file remove and new file name show
          partnerLogoPath: data?.partnerLogoFile?.name || "",

          // clear selected file after upload
          partnerLogoFile: null,
        }));

        // clear browser file input
        if (partnerLogoRef.current) {
          partnerLogoRef.current.value = "";
        }
      } else {
        toast.error(
          response?.respMsg
        );
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSaveAndNext();
      }}
      className="space-y-4">

      <div>
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[20px]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-xl sm:text-xl text-slate-800 font-semibold -mt-3">
              Edit Basic Details
            </h2>
          </div>
          <p className="ml-13 text-sm text-slate-700 -mt-3">
            Edit Basic Details Form collects essential information such as personal
            and contact details to create a user profile.
          </p>
        </div>

        {/* STORE STATUS */}
        <div className="w-full rounded-xl bg-[#FEF6E0] border border-[#fec931] px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#fec931] flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-black" />
            </span>
            <div>
              <p className="text-lg sm:text-xs text-slate-900 font-medium">
                Created By
              </p>
              <p className="text-sm sm:text-[15px] font-semibold text-gray-800">
                {data?.createdBy || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#fec931] flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-black" />
            </span>
            <div>
              <p className="text-[11px] sm:text-xs text-slate-900 font-medium">
                Created At
              </p>
              <p className="text-sm sm:text-[15px] font-semibold text-gray-800">
                {data?.createdAt?.split(" ")[0] || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* CONTACT PERSON DETAILS */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-4">
          {/* Heading */}
          <div className="flex items-center gap-3 mb-6 pb-3">
            <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-100 flex items-center justify-center shrink-0">
              <UserRound className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 uppercase flex items-center gap-2">
              Contact Person Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex w-full">
                <select
                  className="border border-gray-300 rounded-l px-3 py-2 bg-white w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
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
                  required
                  className="flex-1 border border-l-0 border-gray-300 rounded-r px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={data?.cpdDateOfBirth || ""}
                onChange={(e) =>
                  handleChange("cpdDateOfBirth", e.target.value)
                }
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mobile No<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                required
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={data?.cpdMobile || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange("cpdMobile", value)
                }}
              />
            </div>

            {/* Primary Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Primary Email Id<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={data?.cpdPrimaryEmailId || ""}
                onChange={(e) =>
                  handleChange("cpdPrimaryEmailId", e.target.value)
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={data?.cpdSecondaryEmailId || ""}
                onChange={(e) =>
                  handleChange("cpdSecondaryEmailId", e.target.value)
                }
              />
            </div>

            {/* Sourcing Channel */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Reseller Partner<span className="text-red-500 ml-1">*</span>
              </label>

              <div className="relative">
                <select
                  className="w-full appearance-none border border-gray-300 rounded 
                     px-3 py-2 pr-10 bg-white text-md text-gray-700
                     outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  value={data?.basicSrcChannel || ""}
                  onChange={(e) =>
                    handleChange("basicSrcChannel", e.target.value)
                  }
                >
                  <option value="">Select reseller partner</option>
                  {legalVehicalNameList?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2
                     w-4 h-4 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Document DETAILS */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-100 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-yellow-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 uppercase flex items-center gap-2">
              Basic Document Details
            </h2>
          </div>

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
                Aadhar No.<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                maxLength={12}
                inputMode="numeric"
                pattern = "0-9"
                value={data?.bddAadharNo || ""}
                onChange={(e) =>
                  handleChange(
                    "bddAadharNo",
                    e.target.value.replace(/\D/g,"").slice(0,12)
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
                    className="flex items-center gap-2">                  
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
                GSTN No.<span className="text-red-500 ml-1">*</span>
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
                Pan No<span className="text-red-500 ml-1">*</span>
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
                Risk Check<span className="text-red-500 ml-1">*</span>
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
                MCC<span className="text-red-500 ml-1">*</span>
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

            {/* Partner Logo Check */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Partner Logo Check
                <span className="text-red-500 ml-1">*</span>
              </label>

              <select
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
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
              <label className="block text-gray-700 font-medium mb-1">
                Partner Logo
                <span className="text-sm text-gray-500 font-normal">
                  (jpg or png)
                </span>
                <span className="text-red-400 ml-0.5">*</span>

              </label>
              <label className="relative flex items-center h-10 w-full border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[#1677c8] transition">
                <div className="w-full flex items-center justify-between">
                  {/* Left: File icon + File name */}
                  <div className="flex items-center min-w-0">
                    <FileText className="w-4 h-4 ml-3 text-gray-300 shrink-0" />
                    <span className="ml-2 text-xs text-gray-400 truncate">
                      {data?.partnerLogoName || "No file selected"}
                    </span>
                  </div>
                  {/* Right: View icon */}
                  <div className="mr-2 flex items-center gap-1">
                    {/* View Aadhar */}
                    <button
                      type="button"
                      onClick={() => handleViewFile(data?.partnerLogoName)}
                      className="p-1.5 rounded-md bg-green-50 hover:bg-green-100 transition"
                      title="View Partner Logo"
                    >
                      <Eye className="w-4 h-4 text-green-500" />
                    </button>

                    {/* Upload Partner Logo */}
                    <label
                      className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                      title="Upload Partner Logo"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#1677c8]" />

                      <input
                        ref={fileRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={data?.partnerLogoCheck !== "Yes"}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          // setPartnerLogo(file);
                          handleChange("partnerLogoFile", file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </label>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company Name (Business Name)<span className="text-red-500 ml-1">*</span>
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
                Company Legal Name<span className="text-red-500 ml-1">*</span>
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
        </div>

        {/* ── Selected Business Type ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-100 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 uppercase">
                Select Business Type
              </h2>
            </div>
          </div>
          {/* ───────────────── Business Entity Type ───────────────── */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-800 uppercase mb-3">
              Business Entity Type
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

              {[
                {
                  value: "Company",
                  subtitle: "Pvt Ltd / OPC / LLC",
                  icon: Building2,
                },
                {
                  value: "LLP",
                  subtitle: "Limited Liability",
                  icon: Handshake,
                },
                {
                  value: "Firm",
                  subtitle: "Partnership",
                  icon: BriefcaseBusiness,
                },
                {
                  value: "Proprietor",
                  subtitle: "Individual",
                  icon: UserRound,
                },
              ].map((item) => {

                const Icon = item.icon;

                const selected =
                  data?.bddMerchantBusinessType === item.value;

                return (
                  <div
                    key={item.value}
                    onClick={() =>
                      handleChange("bddMerchantBusinessType", item.value)
                    }
                    className={`
            relative h-[84px] rounded-xl border
            flex flex-col items-center justify-center
            cursor-pointer
            transition-all duration-200
            ${selected
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/30"
                      }
          `}
                  >

                    {/* Selected Indicator */}
                    <div
                      className={`
              absolute top-2 right-2
              w-4 h-4 rounded-full border
              flex items-center justify-center
              ${selected
                          ? "border-blue-600"
                          : "border-gray-300"
                        }
            `}
                    >
                      {selected && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>

                    {/* Icon */}
                    <div
                      className={`
              w-8 h-8 rounded-lg
              flex items-center justify-center mb-1
              ${selected
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-400"
                        }
            `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Title */}
                    <span
                      className={`
              text-xs font-semibold
              ${selected
                          ? "text-blue-700"
                          : "text-gray-600"
                        }
            `}
                    >
                      {item.value}
                    </span>

                    {/* Subtitle */}
                    <span className="text-[9px] text-gray-400 mt-0.5">
                      {item.subtitle}
                    </span>

                  </div>
                );
              })}

            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-6" />

          {/* Divider */}
          <div className="border-t border-gray-100 mb-6" />

          {/* ───────────────── Company Type ───────────────── */}
          <div>

            <label className="block text-xs font-semibold text-gray-800 uppercase mb-3">
              Company Type
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

              {[
                {
                  value: "Private Limited",
                  icon: Building2,
                },
                {
                  value: "One Person Company",
                  icon: UserRound,
                },
                {
                  value: "Public Limited",
                  icon: Building2,
                },
                {
                  value: "LLC",
                  icon: Building2,
                },
              ].map((item) => {

                const Icon = item.icon;

                const selected =
                  data?.companyType === item.value;

                return (
                  <div
                    key={item.value}
                    onClick={() =>
                      handleChange("companyType", item.value)
                    }
                    className={`
            relative h-[72px] rounded-xl border
            flex items-center gap-3 px-3
            cursor-pointer
            transition-all duration-200
            ${selected
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/30"
                      }
          `}
                  >

                    {/* Radio */}
                    <div
                      className={`
              w-4 h-4 rounded-full border shrink-0
              flex items-center justify-center
              ${selected
                          ? "border-blue-600"
                          : "border-gray-300"
                        }
            `}
                    >
                      {selected && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>

                    {/* Icon */}
                    <Icon
                      className={`
              w-4 h-4
              ${selected
                          ? "text-blue-600"
                          : "text-gray-400"
                        }
            `}
                    />

                    {/* Text */}
                    <div>

                      <p
                        className={`
                text-xs font-semibold
                ${selected
                            ? "text-blue-700"
                            : "text-gray-600"
                          }
              `}
                      >
                        {item.value}
                      </p>

                      {selected && (
                        <p className="text-[9px] text-blue-500 mt-0.5">
                          Selected
                        </p>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* STORE ADDRESS */}
        <div className="mt-5 bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-6 pb-3 pt-1">
            <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-100 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 uppercase">
              Company Address
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Address 1 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address 1<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={data?.addStoreAddress1 || ""}
                onChange={(e) =>
                  handleChange("addStoreAddress1", e.target.value)
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={data?.addStoreAddress2 || ""}
                onChange={(e) =>
                  handleChange("addStoreAddress2", e.target.value)
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={data?.addStoreAddress3 || ""}
                onChange={(e) =>
                  handleChange("addStoreAddress3", e.target.value)
                }
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Country<span className="text-red-500 ml-1">*</span>
              </label>

              <Select
                options={countryList.map((country) => ({
                  value: country,
                  label: country,
                }))}
                value={
                  data?.addCountry
                    ? {
                      value: data.addCountry,
                      label: data.addCountry,
                    }
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
              <label className="block text-gray-700 font-medium mb-2">
                State<span className="text-red-500 ml-1">*</span>
              </label>

              <Select
                options={stateList.map((item) => ({
                  value: item.state,
                  label: item.state,
                }))}
                value={
                  data?.addState
                    ? {
                      value: data.addState,
                      label: data.addState,
                    }
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
              <label className="block text-gray-700 font-medium mb-2">
                City<span className="text-red-500 ml-1">*</span>
              </label>

              <Select
                options={cityList.map((city) => ({
                  value: city,
                  label: city,
                }))}
                value={
                  data?.addCity
                    ? {
                      value: data.addCity,
                      label: data.addCity,
                    }
                    : null
                }
                onChange={(selected) =>
                  setData((prev) => ({
                    ...prev,
                    addCity: selected?.value || "",
                  }))
                }
                placeholder="Select City"
                isSearchable
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Zip Code
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={data?.addZipcode || ""}
                onChange={(e) =>
                  handleChange("addZipcode", e.target.value)
                }
              />
            </div>

          </div>
        </div>

        {/* ── Billing Address ──────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-5">
          <div className="flex items-center gap-3 mb-5 pb-3">
            <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 border border-yellow-100 flex items-center justify-center shrink-0">
              <ReceiptText className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 uppercase">
              Billing Address
            </h2>
          </div>

          {/* Checkbox */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm text-gray-600 italic cursor-pointer">
              <input
                type="checkbox"
                checked={data?.billingSameAsShipping || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  handleChange("billingSameAsShipping", checked);
                  if (checked) {
                    setData((prev) => ({
                      ...prev,

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
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              Same as Shipping Address
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Address Fields */}
            {[
              {
                label: "Address 1",
                field: "billingAddress1",
                required: true,
              },
              {
                label: "Address 2",
                field: "billingAddress2",
              },
              {
                label: "Address 3",
                field: "billingAddress3",
              },
            ].map(({ label, field, required }) => (
              <div key={field}>
                <label className="block text-gray-700 font-medium mb-2">
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </label>

                <input
                  type="text"
                  disabled={data?.billingSameAsShipping}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                Country<span className="text-red-500 ml-1">*</span>
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
                    ? {
                      value: data.billingCountry,
                      label: data.billingCountry,
                    }
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
              <label className="block text-gray-700 font-medium mb-2">
                State<span className="text-red-500 ml-1">*</span>
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
                    ? {
                      value: data.billingState,
                      label: data.billingState,
                    }
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
              <label className="block text-gray-700 font-medium mb-2">
                City<span className="text-red-500 ml-1">*</span>
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
                    ? {
                      value: data.billingCity,
                      label: data.billingCity,
                    }
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
              <label className="block text-gray-700 font-medium mb-2">
                Zip Code<span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={data?.billingSameAsShipping}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={data?.billingZipcode || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange("billingZipcode", value);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="grid grid-cols-3 items-center mt-10" >
        <div></div >
        {/* Center Button */}
        < div className="flex justify-center" >
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-500 text-white px-6 py-2 rounded"
          >
            Update
          </button>
        </div>

        {/* Right Button */}
        < div className="flex justify-end" >
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-[#fec931] text-black font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </form>
  );
}