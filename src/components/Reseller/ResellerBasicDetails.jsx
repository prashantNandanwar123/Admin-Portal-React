import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import statecity from "../../utils/statecity.json";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function ResellerBasicDetails() {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    const navigate = useNavigate();
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        legalVehicleType: "",
        companyName: "",
        companyCode: "",
        mobile: "",
        email: "",
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        aadharNo: "",
        gstNo: "",
        RePanNo : "",
        RE_BeneficiaryAccountName: "",
        RE_BeneficiaryAccountNo: "",
        RE_BeneficiaryBankName: "",
        RE_BeneficiaryBranchName: "",
        RE_IFSCCode: "",
        RSS_SettlementType: "",
        RSS_SettlementCycle: "",
        RSS_PaymentBy: "",
        RSS_PaymentAdvice: ""

    })
    const [errors, setErrors] = useState({});
    const countryList = statecity.map((item) => item.country);
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
    const [passportPhoto, setPassportPhoto] = useState(null);
    const [aadharCard, setAadharCard] = useState(null);
    const [panCard, setPanCard] = useState(null);
    const [addressProof, setAddressProof] = useState(null);
    
    // ─── Handle Save Api ─────────────────────────────────────────────────────────────
    const saveResellerDetails = async () => {
        try {
            const formData = new FormData();
            formData.append("passportPhoto", passportPhoto);
            formData.append("aadharCard", aadharCard);
            formData.append("panCard", panCard);
            formData.append("addressProof", addressProof);
            formData.append(
                "reseller",
                new Blob(
                    [
                        JSON.stringify({
                            requestId: `REQ${Date.now()}`,
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
                            RE_BeneficiaryAccountName: data.RE_BeneficiaryAccountName,
                            RE_BeneficiaryAccountNo: data.RE_BeneficiaryAccountNo,
                            RE_BeneficiaryBankName: data.RE_BeneficiaryBankName,
                            RE_BeneficiaryBranchName: data.RE_BeneficiaryBranchName,
                            RE_IFSCCode: data.RE_IFSCCode,
                            RSS_SettlementType: data?.RSS_SettlementType,
                            RSS_SettlementCycle: data?.RSS_SettlementCycle,
                            RSS_PaymentBy: data?.RSS_PaymentBy,
                            RSS_PaymentAdvice: data?.RSS_PaymentAdvice,
                        }),
                    ],
                    {
                        type: "application/json",
                    }
                )
            );
            console.log("Form Data payload : " + formData);

            const response = await axiosInstance.post(
                `/reseller/admin/signup`,
                formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            }
            );

            if (response.success === true) {
                toast.success(response.message);
                // navigate after success
                setTimeout(() => {
                    navigate("/app/reseller");
                }, 1000);
            } else if (response.success === false) {
                toast.error(response.message);
            }

            else {
                toast.error(response?.respMsg);
                if (response?.respData && typeof response.respData === "object") {
                    Object.values(response.respData).forEach((msg) => {
                        toast.error(msg);
                    });
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    return (
        <>
            <div className="overflow-y-auto hide-scrollbar p-6">
                <div>
                    <h2 className="text-2xl uppercase pb-2 text-blue-900 font-extrabold">
                        Reseller Onboarding
                    </h2>
                    <p className="pb-3 text-lg text-blue-900">Streamlined reseller onboarding with secure registration, verification, and role-based access setup for faster activation.
                    </p>
                </div>

                {/* ── Basic Document Details ───────────────────────────────────── */}
                <h2 className="text-[20px] text-gray-700 mt-5 my-3">
                    Basic Reseller Details
                </h2>
                <p className="border-t border-gray-300 py-3"></p>
                {/* Row-1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* First Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={data?.firstName || ""}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    firstName: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                                }))
                            }
                        />
                        {errors?.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                    </div>
                    {/* Last Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
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
                        <label className="block text-gray-700 font-medium mb-2">
                            Email Id<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Eg. example@example.com"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={data?.email || ""}
                            required
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                        {errors?.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>
                </div>
                {/* Row-2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
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
                            value={data?.mobile || ""}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                handleChange("mobile", value);
                            }}
                        />
                    </div>
                    {/* Last Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Comapny Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
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
                            value={data?.gstNo || ""}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase();

                                // Allow only A-Z and 0-9
                                if (/^[A-Z0-9]*$/.test(value)) {
                                    handleChange("gstNo", value);

                                    // GST Validation
                                    const gstRegex =
                                        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

                                    if (value.length === 15) {
                                        if (!gstRegex.test(value)) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                gstNo: "Invalid GST format",
                                            }));
                                        } else {
                                            setErrors((prev) => ({
                                                ...prev,
                                                gstNo: "",
                                            }));
                                        }
                                    } else {
                                        setErrors((prev) => ({
                                            ...prev,
                                            gstNo: "GST must be 15 characters",
                                        }));
                                    }
                                }
                            }}
                        />

                        {errors?.gstNo && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.gstNo}
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
                            value={data?.panNo || ""}
                            maxLength={10}
                            placeholder="Eg. ABCDE1234F"
                            required
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase();

                                // Allow only valid characters (A-Z, 0-9)
                                if (/^[A-Z0-9]*$/.test(value)) {
                                    handleChange("panNo", value);

                                    // Format validation (only when length is 10)
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

                {/* ── Address  Details ───────────────────────────────────── */}
                <div className="">
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
                            <label className="block text-gray-700 font-medium mb-2">
                                Zip Code<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={data?.pincode || ""}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    handleChange("pincode", value);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Settlement Setup ──────────────────────────────────────────── */}
                <div className="pt-4">
                    <h2 className="text-[18px] text-[#5c5c5c] mb-2">Settlement Setup</h2>
                    <p className="border-t border-gray-300 py-3"></p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-7 gap-y-5">
                        {/*  Fixed: value+onChange now on the <input>, not <label> */}
                        <div>
                            <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                                Settlement Type <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-5 mt-2">
                                {["Manual", "Automatic"].map((type) => (
                                    <label key={type} className="flex items-center gap-1 text-[14px] text-[#5c5c5c]">
                                        <input
                                            type="radio"
                                            name="RSS_SettlementType"
                                            required
                                            value={type}
                                            checked={data?.RSS_SettlementType === type}
                                            onChange={(e) => handleChange("RSS_SettlementType", e.target.value)}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {[
                            { label: "Settlement Cycle (If Automated)", field: "RSS_SettlementCycle", options: ["Daily", "Daily Twice", "Two Days Once", "Weekly"] },
                            { label: "Payment By", field: "RSS_PaymentBy", options: ["A/C Credit", "IMPS", "NEFT", "RTGS"] },
                            { label: "Payment Advice", field: "RSS_PaymentAdvice", options: ["Daily", "Monthly", "Weekly"] },
                        ].map(({ label, field, options }) => (
                            <div key={field}>
                                <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                                    {label} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data?.[field] || ""}
                                    required
                                    onChange={(e) => handleChange(field, e.target.value)}
                                    className="w-full h-8 border border-gray-400 rounded-sm bg-white px-3 text-sm text-gray-600 outline-none"
                                >
                                    <option value="">-- Select --</option>
                                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Beneficiary Account Details ───────────────────────────────── */}
                <div className="pt-4">
                    <h2 className="text-[20px] text-gray-700 my-3">
                        Beneficiary Account Details
                    </h2>
                    <p className="border-t border-gray-300 py-3"></p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        ].map(
                            ({
                                label,
                                field,
                                required,
                                pattern,
                                message,
                                maxLength,
                            }) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {label}
                                        {required && <span className="text-red-500"> *</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={data?.[field] || ""}
                                        required
                                        maxLength={maxLength}
                                        placeholder={
                                            field === "RE_IFSCCode"
                                                ? "SBIN0001234"
                                                : "Enter value"
                                        }
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            // ONLY for IFSC Code
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
                                        className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors?.[field] && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors[field]}
                                        </p>
                                    )}
                                </div>
                            )
                        )}
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
                                    className="flex h-[125px] flex-col items-center justify-center rounded-lg border border-dashed border-[#d9e2ef] bg-[#f9fbfd] px-3 text-center"
                                >
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
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];

                                            if (file) {
                                                // 5 MB validation
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

                                    {/* Selected File Name */}
                                    {document.state ? (
                                        <p
                                            className="mt-1 max-w-[150px] truncate text-[10px] font-medium text-green-600"
                                            title={document.state.name}
                                        >
                                            {document.state.name}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-[9px] text-[#94a3b8]">
                                            PDF / JPG / PNG - max 5 MB
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>




                <div className="flex justify-center mt-8">
                    <button
                        onClick={saveResellerDetails}
                        type="submit"
                        className="bg-yellow-500 text-white px-5 py-2 rounded"
                    >
                        Submit Application
                    </button>
                </div>
            </div>
        </>
    );
}