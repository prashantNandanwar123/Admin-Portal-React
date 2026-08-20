import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import statecity from "../../utils/statecity.json";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import { User, CalendarDays } from "lucide-react";


export default function ResellerBasicDetails() {

  const navigate = useNavigate();
  const [data, setData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    legalVehicleType: "",
    companyName: "",
    companyCode: "",
    mobile: "",
    email: "",
    address: "",
    country: "",
    State: "",
    City: "",
    pincode: "",
    aadharNo: "",
    gstNo: "",
    PanNo: "",
    reBeneficiaryAccountName: "",
    reBeneficiaryAccountNo: "",
    reBeneficiaryBankName: "",
    reBeneficiaryBranchName: "",
    reIFSCCode: "",
    rssSettlementType: "",
    rssSettlementCycle: "",
    rssPaymentBy: "",
    RSS_PaymentAdvice: "",
    status: "",


  })


  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);


  const [errors, setErrors] = useState({});
  const countryList = statecity.map((item) => item.country);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [passportPhoto, setPassportPhoto] = useState(null);
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [addressProof, setAddressProof] = useState(null);

  // const [documents, setDocuments] = useState([]);

  const [responsePopup, setResponsePopup] = useState({
    show: false,
    message: "",
    success: false,
    resellerId: "",
    firstName: "",
    lastName: "",
  });

  const location = useLocation();
  const resellerId = location.state?.resellerId;

  // Selected Country
  const selectedCountry = statecity.find(
    (item) => item.country === data?.country
  );

  const stateList = selectedCountry?.states || [];
  const selectedState = stateList.find(
    (item) => item.state === data?.state
  );

  const cityList = selectedState?.cities || [];
  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    viewResellers();
  }, []);


  const viewResellers = async () => {
    try {
      if (!resellerId) {
        toast.error("Reseller ID is missing");
        return;
      }
      console.log("Reseller ID:", resellerId);

      const response = await axiosInstance.post(
        `/reseller/viewReseller/${resellerId}`
      );

      console.log("FULL RESPONSE --->>>", response);

      if (response.respCode === 0) {
        const resellerData = response?.respData;

        // Set all reseller data into form state
        setData((prev) => ({
          ...prev,
          ...resellerData,
        }));
        setData(resellerData || {});

        const addressProof = resellerData.documents?.find(
          doc => doc.documentType === "ADDRESS_PROOF"
        );

        const panCard = resellerData.documents?.find(
          doc => doc.documentType === "PAN_CARD"
        );

        const aadhaarCard = resellerData.documents?.find(
          doc => doc.documentType === "AADHAAR_CARD"
        );

        const passportPhoto = resellerData.documents?.find(
          doc => doc.documentType === "PASSPORT_PHOTO"
        );
        setAddressProof(addressProof?.originalFileName);
        setPanCard(panCard?.originalFileName);
        setAadharCard(aadhaarCard?.originalFileName);
        setPassportPhoto(passportPhoto?.originalFileName);

      } else {
        toast.error(response.respMsg);
      }

    } catch (error) {
      toast.error(error);
    }
  };

  // Document File Api Call
  const viewFile = async (id) => {
    try {
      const response = await axiosInstance.post(
        `/reseller/reDownloadDocs/${id}`,

        {
          responseType: "blob",
        }
      );
      console.log("blob file", response);
      const blobUrl = URL.createObjectURL(response);
      window.open(blobUrl, "_blank");

      // Optional: free memory after some time
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 5000);

    } catch (error) {
      toast.error(error);
    }
  };


  // ─── Reseller Update Save Api ─────────────────────────────────────────────────────────────
  const resellerAdminUpdate = async () => {
    if (!resellerId) {
      toast.error("Reseller ID is missing");
      return;
    }
    // Status validation
    if (!data?.status) {
      toast.error("Please select Approve or Reject");
      return;
    }
    // Remark validation
    if (!data?.RSS_Remark?.trim()) {
      toast.error("Please enter remark");
      return;
    }
    try {
      setSubmitLoading(true);

      const status = data.status;
      const payload = {

        requestId: `REQ${Date.now()}`,
        resellerId: resellerId,

        createdBy: userData?.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
        aadharNo: data.aadharNo,
        gstNo: data.gstNo,
        panNo: data.panNo,
        reBeneficiaryAccountName: data.reBeneficiaryAccountName,
        reBeneficiaryAccountNo: data.reBeneficiaryAccountNo,
        reBeneficiaryBankName: data.reBeneficiaryBankName,
        reBeneficiaryBranchName: data.reBeneficiaryBranchName,
        reIFSCCode: data.reIFSCCode,
        rssSettlementType: data?.rssSettlementType,
        rssSettlementCycle: data?.rssSettlementCycle,
        rssPaymentBy: data?.rssPaymentBy,
        RSS_PaymentAdvice: data?.RSS_PaymentAdvice,
        status: data?.status,
      };

      const response = await axiosInstance.post(
        `/reseller/admin/${resellerId}/${status}`,
        payload
      );

      console.log("Reseller Admin Update Response --->>>", response);

      // SUCCESS RESPONSE
      if (response?.respCode === 0) {
        const resData = response?.respData || {};
        if (status === "REJECTED") {
          toast.success(response?.respMsg);
          setTimeout(() => {
            navigate("/app/reseller");
          }, 500);
          return;
        }
        if (status === "APPROVED") {
          setResponsePopup({
            show: true,
            message: response?.respMsg,
            success: true,
            resellerId: resData?.resellerId,
            firstName: resData?.firstName,
            lastName: resData?.lastName,
          });
          return;
        }
      }
      toast.error(response?.respMsg);
      // Backend validation errors
      if (
        response?.respData &&
        typeof response.respData === "object"
      ) {
        Object.values(response.respData).forEach((msg) => {
          if (msg) {
            toast.error(msg);
          }
        });
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-y-auto hide-scrollbar bg-[#F7F7F8] p-4 sm:p-6 xl:p-8 space-y-5 sm:space-y-6">
        {/* Header Section */}
        <div>
          <h2 className="text-xl xl:text-2xl sm:text-lg uppercase text-slate-800 font-bold tracking-tight">
            Edit Reseller
          </h2>
          <p className="pt-2 pb-1 text-sm sm:text-base text-[#0D47A1] font-medium">
            Edit and update reseller details securely, including profile
            information, business data, and account settings with
            controlled validation.
          </p>
        </div>

        {/* ── Status ─────────────────────────────────────────────────── */}
        <div className="w-full rounded-xl bg-[#FEF6E0] border border-[#F3E3B0] px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-[#8a6d1a]" />
            </span>
            <div>
              <p className="text-[11px] sm:text-xs text-[#8a6d1a] font-medium">
                Created By
              </p>
              <p className="text-sm sm:text-[15px] font-semibold text-gray-800">
                {data?.createdBy || "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-[#8a6d1a]" />
            </span>
            <div>
              <p className="text-[11px] sm:text-xs text-[#8a6d1a] font-medium">
                Created Date
              </p>
              <p className="text-sm sm:text-[15px] font-semibold text-gray-800">
                {data?.createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* ── Basic Reseller Details ────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-7">
          <h2 className="text-[17px] sm:text-lg xl:text-xl font-semibold text-gray-800">
            Basic Reseller Details
          </h2>
          <div className="border-t border-gray-200 mt-3 mb-5" />

          {/* Row-1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
            {/* First Name */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                value={data?.firstName || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    firstName: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                  })
                }
              />
              {errors?.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                value={data?.lastName || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    lastName: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                  })
                }
              />
              {errors?.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                Email Id<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Eg. example@example.com"
                className="w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                value={data?.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
              {errors?.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Row-2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 mt-5">
            {/* Mobile */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                Mobile<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={10}
                required
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                value={data?.mobile || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange("mobile", value);
                }}
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                Comapny Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                value={data?.companyName || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    companyName: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                  })
                }
              />
              {errors?.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>
          </div>

          {/* Row-3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 mt-5">
            {/* Aadhar No */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                Aadhar No.<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="reAadharNo"
                maxLength={12}
                required
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
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
            {/* GSTN No */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                GSTN No.<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={15}
                required
                placeholder="Eg. 27AAPFU0939F1ZV"
                className="w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition uppercase"
                value={data?.gstNo || ""}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();

                  // Allow only A-Z and 0-9
                  if (/^[A-Z0-9]*$/.test(value)) {
                    handleChange("reGstnNO", value);

                    // GST Validation
                    const gstRegex =
                      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

                    if (value.length === 15) {
                      if (!gstRegex.test(value)) {
                        setErrors((prev) => ({
                          ...prev,
                          reGstnNO: "Invalid GST format",
                        }));
                      } else {
                        setErrors((prev) => ({
                          ...prev,
                          reGstnNO: "",
                        }));
                      }
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        reGstnNO: "GST must be 15 characters",
                      }));
                    }
                  }
                }}
              />
              {errors?.gstNo && (
                <p className="text-red-500 text-xs mt-1">{errors.gstNo}</p>
              )}
            </div>
            {/* Pan No */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                Pan No<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition uppercase"
                value={data?.panNo || ""}
                maxLength={10}
                placeholder="Eg. ABCDE1234F"
                required
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();

                  if (/^[A-Z0-9]*$/.test(value)) {
                    handleChange("panNo", value);

                    if (value.length === 10) {
                      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

                      if (!panRegex.test(value)) {
                        setErrors((prev) => ({
                          ...prev,
                          panNo: "Invalid PAN format (e.g. ABCDE1234F)",
                        }));
                      } else {
                        setErrors((prev) => ({
                          ...prev,
                          panNo: "",
                        }));
                      }
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        panNo: "PAN must be 10 characters",
                      }));
                    }
                  }
                }}
              />
              {errors?.panNo && (
                <p className="text-red-500 text-xs mt-1">{errors.panNo}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Address Details ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-7">
          <h2 className="text-[17px] sm:text-lg xl:text-xl font-semibold text-gray-800">
            Address Details
          </h2>
          <div className="border-t border-gray-200 mt-3 mb-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-7">
            {/* Address */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                value={data?.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              {errors?.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                Country <span className="text-red-500">*</span>
              </label>
              <Select
                options={countryList.map((country) => ({
                  value: country,
                  label: country,
                }))}
                value={
                  data?.country
                    ? { value: data.country, label: data.country }
                    : null
                }
                onChange={(selected) =>
                  setData((prev) => ({
                    ...prev,
                    country: selected?.value || "",
                    state: "",
                    city: "",
                  }))
                }
                placeholder="Select Country"
                isSearchable
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <Select
                options={stateList.map((item) => ({
                  value: item.state,
                  label: item.state,
                }))}
                value={
                  data?.state
                    ? { value: data.state, label: data.state }
                    : null
                }
                onChange={(selected) =>
                  setData((prev) => ({
                    ...prev,
                    state: selected?.value || "",
                    city: "",
                  }))
                }
                placeholder="Select State"
                isSearchable
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <Select
                options={cityList.map((city) => ({
                  value: city,
                  label: city,
                }))}
                value={
                  data?.city
                    ? { value: data.city, label: data.city }
                    : null
                }
                onChange={(selected) =>
                  setData((prev) => ({
                    ...prev,
                    city: selected?.value || "",
                  }))
                }
                placeholder="Select City"
                isSearchable
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full border border-gray-200 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                value={data?.pincode || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange("pincode", value);
                }}
              />
            </div>

          </div>
        </div>

        {/* ── Settlement Setup ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-7">
          <h2 className="text-[17px] sm:text-lg xl:text-xl font-semibold text-gray-800">
            Settlement Setup
          </h2>
          <div className="border-t border-gray-200 mt-3 mb-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 xl:gap-x-7 gap-y-5">
            <div>
              <label className="block text-[13px] sm:text-sm font-semibold text-gray-600 mb-2">
                Settlement Type <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-5 mt-2">
                {["Manual", "Automatic"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-1.5 text-[13px] sm:text-sm text-gray-700"
                  >
                    <input
                      type="radio"
                      name=" rssSettlementType"
                      required
                      value={type}
                      checked={data?.rssSettlementType === type}
                      onChange={(e) =>
                        handleChange(" rssSettlementType", e.target.value)
                      }
                      className="accent-amber-500 w-4 h-4"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {[
              {
                label: "Settlement Cycle (If Automated)",
                field: "rssSettlementCycle",
                options: ["Daily", "Daily Twice", "Two Days Once", "Weekly"],
              },
              {
                label: "Payment By",
                field: "rssPaymentBy",
                options: ["A/C Credit", "IMPS", "NEFT", "RTGS"],
              },
              {
                label: "Payment Advice",
                field: "RSS_PaymentAdvice",
                options: ["Daily", "Monthly", "Weekly"],
              },
            ].map(({ label, field, options }) => (
              <div key={field}>
                <label className="block text-[13px] sm:text-sm font-semibold text-gray-600 mb-2">
                  {label} <span className="text-red-500">*</span>
                </label>
                <select
                  value={data?.[field] || ""}
                  required
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full h-10 border border-gray-200 rounded-lg bg-white px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                >
                  <option value="">-- Select --</option>
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* ── Beneficiary Account Details ──────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-7">
          <h2 className="text-[17px] sm:text-lg xl:text-xl font-semibold text-gray-800">
            Beneficiary Account Details
          </h2>
          <div className="border-t border-gray-200 mt-3 mb-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
            {[
              {
                label: "Beneficiary Account Name",
                field: "reBeneficiaryAccountName",
                required: true,
                pattern: /^[A-Za-z ]+$/,
                message: "Only alphabets are allowed",
              },
              {
                label: "Beneficiary Account No",
                field: "reBeneficiaryAccountNo",
                required: true,
                maxLength: 25,
                pattern: /^[0-9]+$/,
                message: "Only numbers are allowed",
              },
              {
                label: "Beneficiary Bank Name",
                field: "reBeneficiaryBankName",
                required: true,
                maxLength: 100,
                pattern: /^[A-Za-z ]+$/,
                message: "Only alphabets are allowed",
              },
              {
                label: "Beneficiary Branch Name",
                field: "reBeneficiaryBranchName",
                required: true,
                maxLength: 50,
                pattern: /^[A-Za-z ]+$/,
                message: "Only alphabets are allowed",
              },
              {
                label: "IFSC Code",
                field: "reIFSCCode",
                required: true,
                placeholder: "ABCD***",
                pattern: /^[A-Z0-9]+$/,
                maxLength: 11,
              },
            ].map(({ label, field, required, pattern, message, maxLength }) => (
              <div key={field}>
                <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                  {label}
                  {required && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="text"
                  value={data?.[field] || ""}
                  required
                  maxLength={maxLength}
                  placeholder={
                    field === "reIFSCCode" ? "SBIN0001234" : "Enter value"
                  }
                  onChange={(e) => {
                    let value = e.target.value;

                    if (field === "reIFSCCode") {
                      value = value.toUpperCase();
                      value = value.replace(/[^A-Z0-9]/g, "");
                    }

                    if (pattern && value && !pattern.test(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        [field]: message,
                      }));
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        [field]: "",
                      }));
                    }

                    handleChange(field, value);
                  }}
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
                />
                {errors?.[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Upload Documents Details ───────────────────────────────── */}
        <div className="w-full mt-5">
          <h2 className="text-[20px] text-gray-700 my-3">
            Upload Documents Details
          </h2>

          <p className="border-t border-gray-300 py-3"></p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Reseller Photograph",
                state: passportPhoto,
                setState: setPassportPhoto,
              },
              {
                title: "Aadhar Card",
                state: aadharCard,
                setState: setAadharCard,
              },
              {
                title: "Pan Card",
                state: panCard,
                setState: setPanCard,
              },
              {
                title: "Address Proof",
                state: addressProof,
                setState: setAddressProof,
              },
            ].map((document, index) => (
              <div
                key={index}
                className="relative flex h-[125px] flex-col items-center justify-center rounded-lg border border-dashed border-[#d9e2ef] bg-[#f9fbfd] px-3 text-center"
              >

                {/* Green Tick - Top Right */}
                {document.state && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 32 32" class="text-3xl text-green-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M 16 8 C 7.664063 8 1.25 15.34375 1.25 15.34375 L 0.65625 16 L 1.25 16.65625 C 1.25 16.65625 7.097656 23.324219 14.875 23.9375 C 15.246094 23.984375 15.617188 24 16 24 C 16.382813 24 16.753906 23.984375 17.125 23.9375 C 24.902344 23.324219 30.75 16.65625 30.75 16.65625 L 31.34375 16 L 30.75 15.34375 C 30.75 15.34375 24.335938 8 16 8 Z M 16 10 C 18.203125 10 20.234375 10.601563 22 11.40625 C 22.636719 12.460938 23 13.675781 23 15 C 23 18.613281 20.289063 21.582031 16.78125 21.96875 C 16.761719 21.972656 16.738281 21.964844 16.71875 21.96875 C 16.480469 21.980469 16.242188 22 16 22 C 15.734375 22 15.476563 21.984375 15.21875 21.96875 C 11.710938 21.582031 9 18.613281 9 15 C 9 13.695313 9.351563 12.480469 9.96875 11.4375 L 9.9375 11.4375 C 11.71875 10.617188 13.773438 10 16 10 Z M 16 12 C 14.34375 12 13 13.34375 13 15 C 13 16.65625 14.34375 18 16 18 C 17.65625 18 19 16.65625 19 15 C 19 13.34375 17.65625 12 16 12 Z M 7.25 12.9375 C 7.09375 13.609375 7 14.285156 7 15 C 7 16.753906 7.5 18.394531 8.375 19.78125 C 5.855469 18.324219 4.105469 16.585938 3.53125 16 C 4.011719 15.507813 5.351563 14.203125 7.25 12.9375 Z M 24.75 12.9375 C 26.648438 14.203125 27.988281 15.507813 28.46875 16 C 27.894531 16.585938 26.144531 18.324219 23.625 19.78125 C 24.5 18.394531 25 16.753906 25 15 C 25 14.285156 24.90625 13.601563 24.75 12.9375 Z"></path></svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                {/* Upload Icon */}
                <label
                  htmlFor={`document-${index}`}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-[#94a3b8]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16V4m0 0L8 8m4-4l4 4"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3"
                    />
                  </svg>
                </label>

                <input
                  id={`document-${index}`}
                  type="file"
                  value={document.originalFileName}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert("File size must be less than 5 MB");
                        e.target.value = "";
                        return;
                      }
                      document.setState(file);
                    }
                  }}
                />

                {/* Document Name */}
                <p className="mt-2 text-xs font-medium leading-4 text-[#475569]">
                  {document.title}
                  <span className="text-red-500">*</span>
                </p>

                {/* Selected File */}
                {document.state ? (
                  <>
                    <p
                      className="mt-1 max-w-[120px] truncate text-[10px] font-medium text-green-600"
                      title={document.state.name}
                    >
                      {document.state}
                    </p>

                    {/* View Icon */}
                    <button
                      type="button"
                      onClick={() => {
                        const fileUrl = URL.createObjectURL(
                          document.state
                        );
                        window.open(fileUrl, "_blank");
                      }}
                      className="mt-1 flex items-center gap-1 text-[10px] text-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />
                      </svg>

                      View
                    </button>
                  </>
                ) : (
                  <p className="mt-1 text-[9px] text-[#94a3b8]">
                    PDF / JPG / PNG - max 5 MB
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Risk Status & Remark ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xl:gap-8">
            {/* Approve / Reject */}
            <div>
              <label className="block text-[13px] sm:text-sm font-semibold text-gray-600 mb-2">
                Risk Status <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6 mt-2">
                {[
                  { label: "Approve", value: "APPROVED" },
                  { label: "Reject", value: "REJECTED" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center gap-2 text-[13px] sm:text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={type.value}
                      checked={data?.status === type.value}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-4 h-4 accent-[#FDB913] cursor-pointer"
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Remark */}
            <div>
              <label className="block text-[13px] sm:text-sm font-semibold text-gray-600 mb-2">
                Remark <span className="text-red-500">*</span>
              </label>
              <textarea
                name="RSS_Remark"
                required
                rows={1}
                placeholder="Enter remark..."
                onChange={(e) => handleChange("RSS_Remark", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none resize-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* ── Submit ───────────────────────────────────────────────── */}
        <div className="flex justify-center pt-2">
          <button
            onClick={resellerAdminUpdate}
            type="button"
            disabled={submitLoading}
            className={`bg-green-600 text-white px-8 py-2.5 rounded-lg font-medium transition ${submitLoading
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-green-700 cursor-pointer"
              }`}
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </div>

      </div>

      {responsePopup.show && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[500px] rounded-2xl bg-white shadow-2xl p-7">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <span className="text-4xl text-green-600">✓</span>
              </div>
            </div>

            <h2 className="text-center text-2xl font-bold text-slate-800 mb-2">
              Success
            </h2>

            <p className="text-center text-slate-500 text-[15px] mb-5">
              {responsePopup.message}
            </p>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-600">Reseller ID</span>
                <span className="font-bold text-gray-800">
                  {responsePopup.resellerId || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-600">First Name</span>
                <span className="font-bold text-gray-800">
                  {responsePopup.firstName || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-gray-600">Last Name</span>
                <span className="font-bold text-gray-800">
                  {responsePopup.lastName || "-"}
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setResponsePopup({
                    show: false,
                    message: "",
                    success: false,
                    resellerId: "",
                    firstName: "",
                    lastName: "",
                  });
                  navigate("/app/reseller");
                }}
                className="bg-[#FDB913] hover:bg-[#f3aa00] text-[#071C39] font-semibold px-8 py-2.5 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}