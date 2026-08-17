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
        mobileNo: "",
        emailId: "",
        reAddress1: "",
        reAddress2: "",
        reAddress3: "",
        reCountry: "",
        reState: "",
        reCity: "",
        reZipcode: "",
        reAadharNo: "",
        reGstnNO: "",
        rePanNo: "",
        RE_BeneficiaryAccountName: "",
        RE_BeneficiaryAccountNo: "",
        RE_BeneficiaryBankName: "",
        RE_BeneficiaryBranchName: "",
        RE_IFSCCode: ""
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
                const resellerData = response?.respData?.[0];
                setData(resellerData || {});
                console.log("SUCCESS RESELLER DATA:", resellerData);
            } else {
                toast.error(response.respMsg);
            }

        } catch (error) {
            console.error("View reseller error:", error);
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

                requestId: data?.requestId,
                resellerId: resellerId,

                firstName: data?.firstName,
                lastName: data?.lastName,
                email: data?.email,
                mobile: data?.mobile,
                companyName: data?.companyName,

                country: data?.country,
                address: data?.address,
                city: data?.city,
                state: data?.state,
                pincode: data?.pincode,

                aadharNo: data?.aadharNo,
                gstNo: data?.gstNo,
                panNo: data?.panNo,

                createdAt: data?.createdAt,
                approvedBy: userData?.userName,

                rejectionReason: data?.RSS_Remark,
                status: status,

                RE_BeneficiaryAccountName:
                    data?.RE_BeneficiaryAccountName,

                RE_BeneficiaryAccountNo:
                    data?.RE_BeneficiaryAccountNo,

                RE_BeneficiaryBankName:
                    data?.RE_BeneficiaryBankName,

                RE_BeneficiaryBranchName:
                    data?.RE_BeneficiaryBranchName,

                RE_IFSCCode:
                    data?.RE_IFSCCode,

                RSS_SettlementType:
                    data?.RSS_SettlementType,

                RSS_SettlementCycle:
                    data?.RSS_SettlementCycle,

                RSS_PaymentBy:
                    data?.RSS_PaymentBy,

                RSS_PaymentAdvice:
                    data?.RSS_PaymentAdvice,

                RSS_Remark:
                    data?.RSS_Remark?.trim(),
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
                                {data?.approvedBy || "-"}
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
                                {data?.createdAt || "-"}
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
                                            name="RSS_SettlementType"
                                            required
                                            value={type}
                                            checked={data?.RSS_SettlementType === type}
                                            onChange={(e) =>
                                                handleChange("RSS_SettlementType", e.target.value)
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
                                field: "RSS_SettlementCycle",
                                options: ["Daily", "Daily Twice", "Two Days Once", "Weekly"],
                            },
                            {
                                label: "Payment By",
                                field: "RSS_PaymentBy",
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
                                field: "RE_BeneficiaryAccountName",
                                required: true,
                                pattern: /^[A-Za-z ]+$/,
                                message: "Only alphabets are allowed",
                            },
                            {
                                label: "Beneficiary Account No",
                                field: "RE_BeneficiaryAccountNo",
                                required: true,
                                maxLength: 25,
                                pattern: /^[0-9]+$/,
                                message: "Only numbers are allowed",
                            },
                            {
                                label: "Beneficiary Bank Name",
                                field: "RE_BeneficiaryBankName",
                                required: true,
                                maxLength: 100,
                                pattern: /^[A-Za-z ]+$/,
                                message: "Only alphabets are allowed",
                            },
                            {
                                label: "Beneficiary Branch Name",
                                field: "RE_BeneficiaryBranchName",
                                required: true,
                                maxLength: 50,
                                pattern: /^[A-Za-z ]+$/,
                                message: "Only alphabets are allowed",
                            },
                            {
                                label: "IFSC Code",
                                field: "RE_IFSCCode",
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
                                        field === "RE_IFSCCode" ? "SBIN0001234" : "Enter value"
                                    }
                                    onChange={(e) => {
                                        let value = e.target.value;

                                        if (field === "RE_IFSCCode") {
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