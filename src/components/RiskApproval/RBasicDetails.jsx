import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import {
  User, CalendarDays,
  UserPlus, UserRound, FileText, MapPin, Building2, Handshake, BriefcaseBusiness, ReceiptText,
  Eye, ArrowRight,
} from "lucide-react";

export default function RBasicDetails({ refId, handleNext }) {
  const [apiData, setApiData] = useState({});


  useEffect(() => {
    if (!refId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `/rMerchantBasicDetails/${refId}`
        );
        if (response?.respCode === 0) {
          toast.success(response?.respMsg);
          setApiData(response?.respData || {});
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [refId]);

  // Document File Api Call
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
      <div className="p-2">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[20px]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500"></div>
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 text-yellow-600">
              <UserPlus size={18} />
            </span>
            <h2 className="text-xl sm:text-xl text-slate-800 font-semibold -mt-2">
              Review and manage the merchant onboarding information and business details.
            </h2>
          </div>
          <p className="ml-12 pb-1 text-sm text-slate-500 font-normal -mt-2">
            Review and approve merchant risk details
          </p>
        </div>

        <div className="w-full rounded-xl bg-[#FEF6E0] border border-[#fec931] px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#fec931] flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-black" />
            </span>
            <div>
              <p className="text-lg sm:text-xs text-slate-900 font-medium">Created By</p>
              <p className="text-sm sm:text-[15px] font-semibold text-gray-800">
                {apiData?.createdBy}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#fec931] flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-black" />
            </span>
            <div>
              <p className="text-xs sm:text-xs text-slate-900 font-medium">
                Created Date
              </p>
              <p className="text-sm sm:text-[15px] font-semibold text-gray-800">
                {apiData?.createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* ── Contact Person Details ───────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pb-4 mt-5">
          <div className="rounded-md mt-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
                <UserRound size={15} />
              </span>
              <h2 className="text-md font-semibold text-gray-900 uppercase">
                Contact Person Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium text-sm mb-1">
                  Full Name<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="w-12 h-10 border border-gray-300 rounded-l px-2 py-1.5 text-md bg-gray-100"
                    value={apiData?.cpdNameTitle || ""}
                    readOnly
                  />
                  <input
                    type="text"
                    className="w-70 h-10 border border-l-0 border-gray-300 rounded-r px-2 py-1 text-md bg-gray-100"
                    value={apiData?.cpdName || ""}
                    readOnly
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700 font-medium text-sm mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  className="w-full h-10 border border-gray-300 rounded px-2 py-1 text-md bg-gray-100"
                  value={apiData?.cpdDateOfBirth || ""}
                  readOnly
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-gray-700 font-medium text-sm mb-1">
                  Mobile No<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  className="w-full h-10 border border-gray-300 rounded px-2 py-1 text-md bg-gray-100"
                  value={apiData?.cpdMobile || ""}
                  readOnly
                />
              </div>

              {/* Primary Email */}
              <div>
                <label className="block text-gray-700 font-medium text-sm mb-1">
                  Primary Email Id<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  className="w-full h-10 border border-gray-300 rounded px-2 py-1 text-md bg-gray-100"
                  value={apiData?.cpdPrimaryEmailId || ""}
                  readOnly
                />
              </div>

              {/* Secondary Email */}
              <div>
                <label className="block text-gray-700 font-medium text-sm mb-1">
                  Secondary Email Id
                </label>
                <input
                  type="email"
                  className="w-full h-10 border border-gray-300 rounded px-2 py-1 text-xs bg-gray-100"
                  value={apiData?.cpdSecondaryEmailId || ""}
                  readOnly
                />
              </div>

              {/* Sourcing Channel */}
              <div className="flex flex-col justify-center gap-1">
                <label className="text-gray-700 font-medium text-sm">
                  Reseller Partner<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  className="w-full h-10 border border-gray-200 rounded px-2 py-1 bg-gray-50 text-gray-700 text-md focus:outline-none"
                  value={apiData?.basicSrcChannel || ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Basic Document Details ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-5">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-gray-900 uppercase">
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
                  <label key={doc.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="accent-yellow-500"
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
                Aadhar No.<span className="text-red-500 ml-1">*</span>
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
              <div className="border border-gray-200 rounded-full px-4 sm:px-5 py-3 flex flex-wrap items-center gap-4 sm:gap-6 bg-white">
                {sezOptions.map((item) => (
                  <label key={item.value} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      className="accent-yellow-500"
                      checked={
                        (item.value === "BDD_SEZDetail" &&
                          apiData.bddSez === "BDD_SEZDetail" ||
                          (item.value === "BDD_GSTDetail" &&
                            apiData?.bddGst === "BDD_GSTDetail"
                          )
                        )
                      }
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
                GSTN No.<span className="text-red-500 ml-1">*</span>
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
                Pan No<span className="text-red-500 ml-1">*</span>
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
                Risk Check<span className="text-red-500 ml-1">*</span>
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
                MCC<span className="text-red-500 ml-1">*</span>
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

            {/* Partner Logo Check */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Partner Logo Check<span className="text-red-500 ml-1">*</span>
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
                <span className="text-xs text-gray-500 font-normal ml-1">
                  (jpg or png)
                </span>
              </label>

              <div className="flex items-center justify-between w-full h-[44px] px-3 border border-gray-200 rounded-lg bg-white">
                {/* Left: File Icon + File Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-500 truncate">
                    {apiData?.partnerLogoName || "No Logo uploaded"}
                  </span>
                </div>

                {/* Right: View Icon */}
                <button
                  type="button"
                  onClick={() =>
                    handleViewFile(apiData?.partnerLogoName || "")
                  }
                  disabled={!apiData?.partnerLogoName}
                  className={`
        p-1.5 rounded-md transition shrink-0
        ${apiData?.partnerLogoName
                      ? "text-gray-400 hover:text-[#1677c8] hover:bg-blue-50 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                    }
      `}
                  title="View Partner Logo"
                >
                  <Eye className="w-4 h-4 text-green-400" />
                </button>
              </div>
            </div>

            {/* Store Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company Name (Business Name)<span className="text-red-500 ml-1">*</span>
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
                Company Legal Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                value={apiData?.storeLegalName || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* ── Selected Business Type ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
              <Building2 className="w-4 h-4" />
            </span>
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
                  apiData?.bddMerchantBusinessType === item.value;

                return (
                  <div
                    key={item.value}
                    className={`
              relative h-[84px] rounded-xl border
              flex flex-col items-center justify-center
              ${selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-gray-50 opacity-50"
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
                          : "bg-gray-200 text-gray-400"
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
                          : "text-gray-500"
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
                  apiData?.companyType === item.value;

                return (
                  <div
                    key={item.value}
                    className={`
              relative h-[72px] rounded-xl border
              flex items-center gap-3 px-3
              ${selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-gray-50 opacity-50"
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
                            : "text-gray-500"
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
        {/* ── Store Address ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mt-8">
          <h2 className="text-base font-semibold text-gray-900 uppercase text-gray-700 font-semibold pb-3 flex items-center gap-2 uppercase">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
              <MapPin className="w-4 h-4 text-yellow-600" />
            </span>
            Company Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-7">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Address 1<span className="text-red-500 ml-1">*</span>
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
                Country<span className="text-red-500 ml-1">*</span>
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
                State<span className="text-red-500 ml-1">*</span>
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
                City<span className="text-red-500 ml-1">*</span>
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
                Zip Code<span className="text-red-500 ml-1">*</span>
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-5">
          <div className="rounded-md pb-4">
            <div className="flex items-center gap-3 mb-5 pb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
                <ReceiptText className="w-4 h-4 text-yellow-600" />
              </span>
              <h2 className="text-base font-semibold text-gray-900 uppercase">
                Billing Address
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
                  Country<span className="text-red-500 ml-1">*</span>
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
                  State<span className="text-red-500 ml-1">*</span>
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
                  City<span className="text-red-500 ml-1">*</span>
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
                  Zip Code<span className="text-red-500 ml-1">*</span>
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
        </div>

        {/* Handle BUTTON */}
        <div className="flex justify-end mt-10">
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-[#fec931] font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}