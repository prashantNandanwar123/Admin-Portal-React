import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Calendar,
  Clock,
  Phone,
  Smartphone,
  Mail,
  FileText,
  ShieldCheck,
  Building2,
  Globe,
  Image as ImageIcon,
  Store,
  MapPin,
  Landmark,
  ChevronDown,
  ArrowRight,
  ClipboardList,
  UploadCloud,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────
   MOCK DATA
   In your real app these come from props / API calls. Kept here only so
   this file renders standalone. Swap these for your real lists.
──────────────────────────────────────────────────────────────────────── */
const legalVehicalNameList = [
  "Online Marketplace",
  "Sales Team",
  "Digital Marketing",
  "Referral Partner",
  "Website Signup",
];

const documentOptions = [
  { value: "Aadhar", label: "Aadhar" },
  { value: "PAN", label: "PAN" },
  { value: "Passport", label: "Passport" },
];

const sezOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const mccList = [
  { code: "5411", name: "Grocery Stores" },
  { code: "5812", name: "Restaurants" },
  { code: "5999", name: "Retail Stores - Miscellaneous" },
  { code: "4899", name: "Cable, Satellite & Other Pay TV" },
  { code: "6300", name: "Insurance Sales & Underwriting" },
  { code: "8299", name: "Educational Services" },
];

const countryList = ["India", "United States", "United Arab Emirates", "Singapore", "United Kingdom"];

const stateList = [
  { state: "West Bengal" },
  { state: "Maharashtra" },
  { state: "Delhi" },
  { state: "Karnataka" },
  { state: "Tamil Nadu" },
];

const cityList = ["Kolkata", "Mumbai", "New Delhi", "Bengaluru", "Chennai"];

const billingStateList = stateList;
const billingCityList = cityList;

/* ────────────────────────────────────────────────────────────────────────
   SMALL REUSABLE UI PRIMITIVES
──────────────────────────────────────────────────────────────────────── */

const inputBase =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300/70 " +
  "focus:border-amber-400 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

function Field({ label, required, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-700 font-medium text-[13.5px] mb-2">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function SectionHeading({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 text-amber-600 shrink-0">
        <Icon size={18} strokeWidth={2.1} />
      </span>
      <h2 className="text-[16px] sm:text-[18px] font-semibold text-gray-800 tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-6 sm:px-7 sm:py-7 ${className}`}
    >
      {children}
    </div>
  );
}

function RadioPill({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none group">
      <span
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
          checked ? "border-amber-500" : "border-gray-300 group-hover:border-amber-300"
        }`}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-amber-500" />}
      </span>
      <input type="radio" className="hidden" checked={checked} onChange={onChange} />
      <span className={`text-sm ${checked ? "text-gray-900 font-medium" : "text-gray-600"}`}>
        {label}
      </span>
    </label>
  );
}

/* Minimal dependency-free searchable select — mirrors the react-select API
   used in the original code (options / value / onChange / isDisabled / isSearchable)
   so no fields or logic had to be dropped, only the underlying implementation. */
function SearchableSelect({ options, value, onChange, placeholder, isDisabled, isSearchable = true }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border rounded-lg px-3 py-2.5 text-sm text-left transition
          ${
            isDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white border-gray-300 hover:border-amber-400 text-gray-800"
          }
          ${open ? "ring-2 ring-amber-300/70 border-amber-400" : ""}`}
      >
        <span className={value ? "" : "text-gray-400"}>{value ? value.label : placeholder || "-- Select --"}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && !isDisabled && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto">
          {isSearchable && (
            <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-300"
              />
            </div>
          )}
          {filtered.length === 0 && <div className="px-3 py-2 text-sm text-gray-400">No options</div>}
          {filtered.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                setQuery("");
              }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-amber-50 ${
                value?.value === opt.value ? "bg-amber-50 text-amber-700 font-medium" : "text-gray-700"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────────────────── */
export default function EditBasicDetailsForm() {
  const [data, setData] = useState({
    createdBy: "administrator",
    createdDate: "15/06/2026 08:11:50",
    basicSrcChannel: "",

    cpdNameTitle: "",
    cpdName: "",
    cpdDateOfBirth: "",
    cpdPhoneNo: "",
    cpdMobile: "",
    cpdPrimaryEmailId: "",
    cpdSecondaryEmailId: "",

    bddDocument: "",
    bddAadharNo: "",
    bddSez: "",
    bddGstnNO: "",
    bddPanNo: "",
    riskCheck: "",
    bddCategory: "",
    bddAgpMcc: "",
    bddVintageType: "",
    bddMerchantBusinessType: "",
    bddMerchantWebsiteURL: "",
    partnerLogoCheck: "",
    partnerLogoFile: null,
    partnerLogoPath: "",
    storeDbaName: "HelloPe",
    storeLegalName: "HelloPe pvt ltd",

    addStoreAddress1: "",
    addStoreAddress2: "",
    addStoreAddress3: "",
    addCountry: "",
    addState: "",
    addCity: "",
    addZipcode: "",

    billingSameAsShipping: false,
    billingAddress1: "",
    billingAddress2: "",
    billingAddress3: "",
    billingCountry: "",
    billingState: "",
    billingCity: "",
    billingZipcode: "",
  });

  const [errors, setErrors] = useState({});
  const partnerLogoRef = useRef(null);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAndNext = () => {
    const newErrors = {};
    if (!data.partnerLogoCheck) newErrors.partnerLogoCheck = "Partner Logo Check is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Saving basic details:", data);
    }
  };

  const handleNext = () => {
    console.log("Proceeding to next step with:", data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1366px] mx-auto px-4 py-6 sm:px-6 lg:px-8 xl:px-10 xl:py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl uppercase text-gray-900 font-extrabold py-1 tracking-tight">
            Edit Basic Details
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-3xl">
            Edit Basic Details Form collects essential information such as personal and contact
            details to create a user profile.
          </p>
        </div>

        <div className="flex flex-col gap-6 xl:gap-7">
          {/* ── STORE ONBOARDING STATUS ─────────────────────────────── */}
          <Card>
            <SectionHeading icon={ClipboardList} title="Store Onboarding Status" />

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-7 divide-y sm:divide-y-0 sm:divide-x divide-amber-200/80">
              <div className="flex items-center gap-3 sm:pr-6">
                <span className="w-9 h-9 rounded-full bg-amber-200/70 flex items-center justify-center text-amber-700 shrink-0">
                  <User size={16} />
                </span>
                <div>
                  <p className="text-xs text-gray-500">Created By</p>
                  <p className="text-sm font-semibold text-gray-800">{data?.createdBy}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:px-6 pt-3 sm:pt-0">
                <span className="w-9 h-9 rounded-full bg-amber-200/70 flex items-center justify-center text-amber-700 shrink-0">
                  <Calendar size={16} />
                </span>
                <div>
                  <p className="text-xs text-gray-500">Created Date</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {data?.createdDate?.split(" ")[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:pl-6 pt-3 sm:pt-0">
                <span className="w-9 h-9 rounded-full bg-amber-200/70 flex items-center justify-center text-amber-700 shrink-0">
                  <Clock size={16} />
                </span>
                <div>
                  <p className="text-xs text-gray-500">Created Time</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {data?.createdDate?.split(" ")[1]}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-7">
              <Field label="Sourcing Channel" required>
                <select
                  className={inputBase}
                  value={data?.basicSrcChannel || ""}
                  onChange={(e) => handleChange("basicSrcChannel", e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {legalVehicalNameList?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Card>

          {/* ── CONTACT PERSON DETAILS ──────────────────────────────── */}
          <Card>
            <SectionHeading icon={User} title="Contact Person Details" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-7">
              {/* Full Name */}
              <Field label="Full Name">
                <div className="flex w-full">
                  <select
                    className="border border-gray-300 rounded-l-lg px-2.5 py-2.5 bg-white w-24 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/70 focus:border-amber-400"
                    value={data?.cpdNameTitle || ""}
                    onChange={(e) => handleChange("cpdNameTitle", e.target.value)}
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
                    className="flex-1 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/70 focus:border-amber-400"
                    value={data?.cpdName || ""}
                    onChange={(e) => handleChange("cpdName", e.target.value)}
                  />
                </div>
              </Field>

              {/* Date of Birth */}
              <Field label="Date of Birth">
                <input
                  type="date"
                  className={inputBase}
                  value={data?.cpdDateOfBirth || ""}
                  onChange={(e) => handleChange("cpdDateOfBirth", e.target.value)}
                />
              </Field>

              {/* Phone */}
              <Field label="Phone No. with STD Code">
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className={`${inputBase} pl-9`}
                    value={data?.cpdPhoneNo || ""}
                    onChange={(e) => handleChange("cpdPhoneNo", e.target.value)}
                  />
                </div>
              </Field>

              {/* Mobile */}
              <Field label="Mobile">
                <div className="relative">
                  <Smartphone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className={`${inputBase} pl-9`}
                    value={data?.cpdMobile || ""}
                    onChange={(e) => handleChange("cpdMobile", e.target.value)}
                  />
                </div>
              </Field>

              {/* Primary Email */}
              <Field label="Primary Email Id">
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className={`${inputBase} pl-9`}
                    value={data?.cpdPrimaryEmailId || ""}
                    onChange={(e) => handleChange("cpdPrimaryEmailId", e.target.value)}
                  />
                </div>
              </Field>

              {/* Secondary Email */}
              <Field label="Secondary Email Id">
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className={`${inputBase} pl-9`}
                    value={data?.cpdSecondaryEmailId || ""}
                    onChange={(e) => handleChange("cpdSecondaryEmailId", e.target.value)}
                  />
                </div>
              </Field>
            </div>
          </Card>

          {/* ── BASIC DOCUMENT DETAILS ──────────────────────────────── */}
          <Card>
            <SectionHeading icon={FileText} title="Basic Document Details" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-7">
              {/* Documents radio */}
              <Field label="Documents">
                <div className="flex items-center flex-wrap gap-5 border border-gray-200 rounded-full px-5 py-3 bg-white">
                  {documentOptions.map((doc) => (
                    <RadioPill
                      key={doc.value}
                      label={doc.label}
                      checked={data?.bddDocument === doc.value}
                      onChange={() => handleChange("bddDocument", doc.value)}
                    />
                  ))}
                </div>
              </Field>

              {/* Aadhar No */}
              <Field label="Aadhar No.">
                <input
                  type="text"
                  className={inputBase}
                  value={data?.bddAadharNo || ""}
                  onChange={(e) => handleChange("bddAadharNo", e.target.value)}
                />
              </Field>

              {/* SEZ Detail */}
              <Field label="SEZ Detail">
                <div className="border border-gray-200 rounded-full px-5 py-3 flex items-center gap-6 bg-white">
                  {sezOptions.map((item) => (
                    <RadioPill
                      key={item.value}
                      label={item.label}
                      checked={data?.bddSez === item.value}
                      onChange={() => handleChange("bddSez", item.value)}
                    />
                  ))}
                </div>
              </Field>

              {/* GSTN No */}
              <Field label="GSTN No.">
                <input
                  type="text"
                  className={inputBase}
                  value={data?.bddGstnNO || ""}
                  onChange={(e) => handleChange("bddGstnNO", e.target.value)}
                />
              </Field>

              {/* PAN NO */}
              <Field label="Pan No">
                <input
                  type="text"
                  className={inputBase}
                  value={data?.bddPanNo || ""}
                  onChange={(e) => handleChange("bddPanNo", e.target.value)}
                />
              </Field>

              {/* Risk Check */}
              <Field label="Risk Check">
                <select
                  className={inputBase}
                  value={data?.riskCheck || ""}
                  onChange={(e) => handleChange("riskCheck", e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </Field>

              {/* Category */}
              <Field label="Category">
                <select
                  className={inputBase}
                  value={data?.bddCategory || ""}
                  onChange={(e) => handleChange("bddCategory", e.target.value)}
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
              </Field>

              {/* MCC */}
              <Field label="MCC">
                <select
                  className={inputBase}
                  value={data?.bddAgpMcc || ""}
                  onChange={(e) => handleChange("bddAgpMcc", e.target.value)}
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
              </Field>

              {/* Vintage Type */}
              <Field label="Vintage Type">
                <select
                  className={inputBase}
                  value={data?.bddVintageType || ""}
                  onChange={(e) => handleChange("bddVintageType", e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="<1Y - New">&lt;1Y - New</option>
                  <option value=">1<3Y">&gt;1&lt;3Y</option>
                  <option value=">3<5Y">&gt;3&lt;5Y</option>
                  <option value=">5Y">&gt;5Y</option>
                </select>
              </Field>

              {/* Merchant Business Type */}
              <Field label="Merchant Business Type">
                <select
                  className={inputBase}
                  value={data?.bddMerchantBusinessType || ""}
                  onChange={(e) => handleChange("bddMerchantBusinessType", e.target.value)}
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
              </Field>

              {/* Merchant Website URL */}
              <Field label="Merchant Website URL">
                <div className="relative">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="https://www.example.com"
                    className={`${inputBase} pl-9`}
                    value={data?.bddMerchantWebsiteURL || ""}
                    onChange={(e) => handleChange("bddMerchantWebsiteURL", e.target.value)}
                  />
                </div>
              </Field>

              {/* Partner Logo Check */}
              <Field label="Partner Logo Check" required>
                <select
                  className={inputBase}
                  value={data?.partnerLogoCheck || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleChange("partnerLogoCheck", value);
                    if (value === "No") {
                      handleChange("partnerLogoFile", null);
                      if (partnerLogoRef.current) {
                        partnerLogoRef.current.value = "";
                      }
                    }
                  }}
                >
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors?.partnerLogoCheck && (
                  <p className="text-red-500 text-xs mt-1">{errors.partnerLogoCheck}</p>
                )}
              </Field>

              {/* Partner Logo */}
              <Field
                label={
                  <>
                    Partner Logo{" "}
                    <span className="text-xs text-gray-400 font-normal">(jpg or png)</span>
                  </>
                }
              >
                <label
                  className={`flex items-center gap-2 w-full border border-dashed rounded-lg px-3 py-2.5 text-sm cursor-pointer transition ${
                    data?.partnerLogoCheck !== "Yes"
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-gray-300 hover:border-amber-400 text-gray-600"
                  }`}
                >
                  <UploadCloud size={16} className="shrink-0" />
                  <span className="truncate">
                    {data?.partnerLogoFile?.name || "Choose file — no file chosen"}
                  </span>
                  <input
                    ref={partnerLogoRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    disabled={data?.partnerLogoCheck !== "Yes"}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      handleChange("partnerLogoFile", file);
                    }}
                  />
                </label>
                {data?.partnerLogoPath && (
                  <p className="mt-2 text-sm text-gray-600 font-medium">
                    {data.partnerLogoPath.split(/[/\\]/).pop()}
                  </p>
                )}
              </Field>

              {/* Store Name */}
              <Field label="Store Name (Business Name)">
                <div className="relative">
                  <Store size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className={`${inputBase} pl-9`}
                    value={data?.storeDbaName || ""}
                    onChange={(e) => handleChange("storeDbaName", e.target.value)}
                  />
                </div>
              </Field>

              {/* Legal Name */}
              <Field label="Legal Name">
                <div className="relative">
                  <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className={`${inputBase} pl-9`}
                    value={data?.storeLegalName || ""}
                    onChange={(e) => handleChange("storeLegalName", e.target.value)}
                  />
                </div>
              </Field>
            </div>
          </Card>

          {/* ── STORE ADDRESS ───────────────────────────────────────── */}
          <Card>
            <SectionHeading icon={MapPin} title="Store Address" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-7">
              {/* Address 1 */}
              <Field label="Address 1">
                <input
                  type="text"
                  className={inputBase}
                  value={data?.addStoreAddress1 || ""}
                  onChange={(e) => handleChange("addStoreAddress1", e.target.value)}
                />
              </Field>

              {/* Address 2 */}
              <Field label="Address 2">
                <input
                  type="text"
                  className={inputBase}
                  value={data?.addStoreAddress2 || ""}
                  onChange={(e) => handleChange("addStoreAddress2", e.target.value)}
                />
              </Field>

              {/* Address 3 */}
              <Field label="Address 3">
                <input
                  type="text"
                  className={inputBase}
                  value={data?.addStoreAddress3 || ""}
                  onChange={(e) => handleChange("addStoreAddress3", e.target.value)}
                />
              </Field>

              {/* Country */}
              <Field label="Country" required>
                <SearchableSelect
                  options={countryList.map((country) => ({ value: country, label: country }))}
                  value={data?.addCountry ? { value: data.addCountry, label: data.addCountry } : null}
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
              </Field>

              {/* State */}
              <Field label="State" required>
                <SearchableSelect
                  options={stateList.map((item) => ({ value: item.state, label: item.state }))}
                  value={data?.addState ? { value: data.addState, label: data.addState } : null}
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
              </Field>

              {/* City */}
              <Field label="City" required>
                <SearchableSelect
                  options={cityList.map((city) => ({ value: city, label: city }))}
                  value={data?.addCity ? { value: data.addCity, label: data.addCity } : null}
                  onChange={(selected) =>
                    setData((prev) => ({ ...prev, addCity: selected?.value || "" }))
                  }
                  placeholder="Select City"
                  isSearchable
                />
              </Field>

              {/* Zip Code */}
              <Field label="Zip Code">
                <input
                  type="text"
                  className={inputBase}
                  value={data?.addZipcode || ""}
                  onChange={(e) => handleChange("addZipcode", e.target.value)}
                />
              </Field>
            </div>
          </Card>

          {/* ── BILLING ADDRESS ─────────────────────────────────────── */}
          <Card>
            <SectionHeading icon={Landmark} title="Billing Address" />

            {/* Checkbox */}
            <div className="mb-5 -mt-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 italic cursor-pointer">
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-7">
              {/* Address Fields */}
              {[
                { label: "Address 1", field: "billingAddress1", required: true },
                { label: "Address 2", field: "billingAddress2" },
                { label: "Address 3", field: "billingAddress3" },
              ].map(({ label, field, required }) => (
                <Field label={label} required={required} key={field}>
                  <input
                    type="text"
                    disabled={data?.billingSameAsShipping}
                    className={inputBase}
                    value={data?.[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                </Field>
              ))}

              {/* Country */}
              <Field label="Country" required>
                <SearchableSelect
                  isDisabled={data?.billingSameAsShipping}
                  options={countryList.map((country) => ({ value: country, label: country }))}
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
              </Field>

              {/* State */}
              <Field label="State" required>
                <SearchableSelect
                  isDisabled={data?.billingSameAsShipping}
                  options={billingStateList.map((item) => ({ value: item.state, label: item.state }))}
                  value={
                    data?.billingState ? { value: data.billingState, label: data.billingState } : null
                  }
                  onChange={(selected) =>
                    setData((prev) => ({
                      ...prev,
                      billingState: selected?.value || "",
                      billingCity: "",
                    }))
                  }
                />
              </Field>

              {/* City */}
              <Field label="City" required>
                <SearchableSelect
                  isDisabled={data?.billingSameAsShipping}
                  options={billingCityList.map((city) => ({ value: city, label: city }))}
                  value={data?.billingCity ? { value: data.billingCity, label: data.billingCity } : null}
                  onChange={(selected) =>
                    setData((prev) => ({ ...prev, billingCity: selected?.value || "" }))
                  }
                />
              </Field>

              {/* Zip Code */}
              <Field label="Zip Code" required>
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  disabled={data?.billingSameAsShipping}
                  className={inputBase}
                  value={data?.billingZipcode || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange("billingZipcode", value);
                  }}
                />
              </Field>
            </div>
          </Card>

          {/* SAVE BUTTONS */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pb-4">
            <button
              type="button"
              onClick={handleSaveAndNext}
              className="w-full sm:w-auto border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              Update
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-2.5 rounded-lg shadow-sm transition"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}