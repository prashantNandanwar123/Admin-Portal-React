import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import statecity from "../../utils/statecity.json";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function ResellerBasicDetails() {
    const [userName, setUserData] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);            
            setUserData(parsedUser);
        }
    }, []);
    const navigate = useNavigate();
    const [data, setData] = useState({
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
    const [errors, setErrors] = useState({});
    const [logo, setLogo] = useState(null);
    const countryList = statecity.map((item) => item.country);

    // Selected Country
    const selectedCountry = statecity.find(
        (item) => item.country === data?.reCountry
    );

    // States of selected country
    const stateList = selectedCountry?.states || [];

    // Selected State
    const selectedState = stateList.find(
        (item) => item.state === data?.reState
    );

    // Cities of selected state
    const cityList = selectedState?.cities || [];

    const handleChange = (field, value) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // ─── Handle Save Api ─────────────────────────────────────────────────────────────
    const saveResellerDetails = async () => {
        try {
            const formData = new FormData();
            formData.append("logo", logo);
            formData.append(
                "reseller",
                new Blob(
                    [
                        JSON.stringify({
                            firstName: data.firstName,
                            lastName: data.lastName,
                            legalVehicleType: data.legalVehicleType,
                            companyName: data.companyName,
                            companyCode: data.companyCode,
                            mobileNo: data.mobileNo,
                            emailId: data.emailId,
                            reAddress1: data.reAddress1,
                            reAddress2: data.reAddress2,
                            reAddress3: data.reAddress3,
                            reCountry: data.reCountry,
                            reState: data.reState,
                            reCity: data.reCity,
                            reZipcode: data.reZipcode,
                            reAadharNo: data.reAadharNo,
                            reGstnNO: data.reGstnNO,
                            rePanNo: data.rePanNo,

                            RSS_SettlementType: data?.RSS_SettlementType,
                            RSS_SettlementCycle: data?.RSS_SettlementCycle,
                            RSS_PaymentBy: data?.RSS_PaymentBy,
                            RSS_PaymentAdvice: data?.RSS_PaymentAdvice,

                            RE_BeneficiaryAccountName: data.RE_BeneficiaryAccountName,
                            RE_BeneficiaryAccountNo: data.RE_BeneficiaryAccountNo,
                            RE_BeneficiaryBankName: data.RE_BeneficiaryBankName,
                            RE_BeneficiaryBranchName: data.RE_BeneficiaryBranchName,
                            RE_IFSCCode: data.RE_IFSCCode
                        }),
                    ],
                    {
                        type: "application/json",
                    }
                )
            );

            const response = await axiosInstance.post(
                `/saveResellerDetails/${userName?.userName}`,
                formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            }
            );

            if (response?.respCode === 0) {
                toast.success(response.respMsg);
                // navigate after success
                setTimeout(() => {
                    navigate("/app/reseller");
                }, 1000);
            } else {
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
            <div
                className="overflow-y-auto hide-scrollbar p-6"
                style={{ height: "calc(100vh - 120px)" }}
            >                {/*Header Section*/}
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
                            value={data?.emailId || ""}
                            required
                            onChange={(e) => handleChange("emailId", e.target.value)}
                        />
                        {errors?.emailId && (
                            <p className="text-red-500 text-xs mt-1">{errors.emailId}</p>
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
                            value={data?.mobileNo || ""}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                handleChange("mobileNo", value);
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

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Company Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={data?.companyCode || ""}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    companyCode: e.target.value,
                                })
                            }
                        />
                        {errors?.companyCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyCode}</p>
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
                            name="reAadharNo"
                            maxLength={12}
                            required
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={data?.reAadharNo || ""}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                handleChange("reAadharNo", value);
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
                            value={data?.reGstnNO || ""}
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

                        {errors?.reGstnNO && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.reGstnNO}
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
                            value={data?.rePanNo || ""}
                            maxLength={10}
                            placeholder="Eg. ABCDE1234F"
                            required
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase();

                                // Allow only valid characters (A-Z, 0-9)
                                if (/^[A-Z0-9]*$/.test(value)) {
                                    handleChange("rePanNo", value);

                                    // Format validation (only when length is 10)
                                    if (value.length === 10) {
                                        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

                                        if (!panRegex.test(value)) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                rePanNo: "Invalid PAN format (e.g. ABCDE1234F)",
                                            }));
                                        } else {
                                            setErrors((prev) => ({
                                                ...prev,
                                                rePanNo: "",
                                            }));
                                        }
                                    } else {
                                        setErrors((prev) => ({
                                            ...prev,
                                            rePanNo: "PAN must be 10 characters",
                                        }));
                                    }
                                }
                            }}
                        />

                        {errors?.rePanNo && (
                            <p className="text-red-500 text-xs mt-1">{errors.rePanNo}</p>
                        )}
                    </div>
                </div>
                {/* Logo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Logo
                            <span className="text-sm text-gray-500 font-normal">
                                {" "} (jpg or png)
                            </span>
                        </label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setLogo(file);
                                handleChange("partnerLogoFile", file);
                            }}
                            className="block w-full text-sm text-gray-700 border border-gray-300 rounded bg-white
                            file:mr-3 file:px-3 file:py-2 file:border-0 file:border-r
                            file:border-gray-300 file:bg-gray-100 file:text-black
                            hover:file:bg-gray-200"
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                            Reseller Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data?.legalVehicleType || ""}
                            required
                            onChange={(e) => handleChange("legalVehicleType", e.target.value)}
                            className="w-full h-8 border border-gray-400 rounded-sm bg-white px-3 text-sm text-gray-600 outline-none"
                        >
                            <option value="">-- Select --</option>
                            <option value="Referral / Partner Model">Referral / Partner Model</option>
                            <option value="Aggregator Model">Aggregator Model</option>
                            <option value="Hosted Model">Hosted Model</option>
                        </select>
                    </div>
                    <div></div>
                </div>
                {/* ── Address  Details ───────────────────────────────────── */}
                <div className="">
                    <h2 className="text-[20px] text-gray-700 mb-6 border-b border-gray-300 pb-3 pt-5"> Address Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                        {[
                            { label: "Address 1", field: "reAddress1", required: true },
                            { label: "Address 2", field: "reAddress2" },
                            { label: "Address 3", field: "reAddress3" },
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
                            <Select
                                options={countryList.map((country) => ({
                                    value: country,
                                    label: country,
                                }))}
                                value={
                                    data?.reCountry
                                        ? { value: data.reCountry, label: data.reCountry }
                                        : null
                                }
                                onChange={(selected) =>
                                    setData((prev) => ({
                                        ...prev,
                                        reCountry: selected?.value || "",
                                        reState: "",
                                        reCity: "",
                                    }))
                                }
                                placeholder="Select Country"
                                isSearchable
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                State<span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={stateList.map((item) => ({
                                    value: item.state,
                                    label: item.state,
                                }))}
                                value={
                                    data?.reState
                                        ? { value: data.reState, label: data.reState }
                                        : null
                                }
                                onChange={(selected) =>
                                    setData((prev) => ({
                                        ...prev,
                                        reState: selected?.value || "",
                                        reCity: "",
                                    }))
                                }
                                isSearchable
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                City<span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={cityList.map((city) => ({
                                    value: city,
                                    label: city,
                                }))}
                                value={
                                    data?.reCity
                                        ? { value: data.reCity, label: data.reCity }
                                        : null
                                }
                                onChange={(selected) =>
                                    setData((prev) => ({
                                        ...prev,
                                        reCity: selected?.value || "",
                                    }))
                                }
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
                                value={data?.reZipcode || ""}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    handleChange("reZipcode", value);
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
                                                // remove special characters and spaces
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
                <div className="flex justify-center mt-8">
                    <button
                        onClick={saveResellerDetails}
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}