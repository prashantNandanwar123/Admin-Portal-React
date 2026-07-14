import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";


export default function ResellerViewDetails() {
    const [apiData, setData] = useState({});
    const location = useLocation();
    const userId = location.state?.userId;
    console.log("user Id", userId);

    useEffect(() => {
        viewResellers();
    }, []);
    const viewResellers = async () => {
        try {
            const response = await axiosInstance.post(`/viewReseller/${userId}`);
            console.log("FULL RESPONSE-->>>:", response);
            if (response?.respCode === 0) {
                setData(response?.respData?.[0] || {});
            } else {
                toast.error(response?.respMsg);
                setData({});
            }
        } catch (error) {
            toast.error(error);
            setData({});
        }
    };

    const ViewField = ({ label, value, required }) => (
        <div>
            <label className="block text-gray-700 font-medium mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="w-full min-h-[42px] border border-gray-300 rounded-md bg-gray-100 px-3 py-2 flex items-center text-gray-700">
                {value || "-"}
            </div>
        </div>
    );

    return (
        <div className="overflow-y-auto hide-scrollbar p-6" style={{ height: "calc(100vh - 120px)" }}>
            <h2 className="text-2xl uppercase text-blue-900 font-bold">
                View  Reseller
            </h2>
            <p className="py-3 text-lg text-blue-900">View and manage reseller onboarding details including profile information, verification status, and account configuration in a centralized dashboard.
            </p>
            <p className="border-t border-gray-300 py-3"></p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
                <div>
                    <label className="text-gray-700 text-[18px]">
                        Created By : {apiData?.createdBy}
                    </label>
                </div>
                <div>
                    <label className="text-gray-700 text-[18px] pe-5">
                        Created Date : {apiData?.createdDate}
                    </label>
                </div>
            </div>

            {/* ── Basic Document Details ───────────────────────────────────── */}
            <div>
                <h2 className="text-[20px] text-gray-700 mt-5 my-3">
                    Basic Reseller Details
                </h2>
                <p className="border-t border-gray-300 py-3"></p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.firstName || ""}
                        />
                    </div>
                    {/* Last Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.lastName || ""}
                            readOnly
                        />

                    </div>
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Email Id<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.emailId || ""}
                            readOnly
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {/*Mobile*/}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Mobile<span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.mobileNo || ""}
                            readOnly
                        />
                    </div>

                    {/* Comapny Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Comapny Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.companyName || ""}
                            readOnly
                        />
                    </div>

                    {/* Company Code */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Company Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.companyCode || ""}
                            readOnly
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {/* AAdhar No */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Aadhar No.<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.reAadharNo || ""}
                            readOnly
                        />
                    </div>
                    {/* GSTN No */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            GSTN No.<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.reGstnNO || ""}
                            readOnly
                        />

                    </div>
                    {/* Pan No */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Pan No<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.rePanNo || ""}
                            readOnly
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {/* Logo */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Logo
                            <span className="text-sm text-gray-500 font-normal">
                                {" "} (jpg or png)
                            </span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.logoPath || ""}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                            Reseller Type <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={apiData?.legalVehicleType || ""}
                            readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        />
                    </div>
                    <div></div>
                </div>
            </div>
            {/* ── Address  Details ───────────────────────────────────── */}
            <h2 className="text-[20px] text-gray-700 my-3">
                Address
            </h2>
            <p className="border-t border-gray-300 py-3"></p>
            {/* Row-1*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Address 1<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        value={apiData?.reAddress1 || ""}
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Address 2<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        value={apiData?.reAddress2 || ""}
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Address 3<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        value={apiData?.reAddress3 || ""}
                        readOnly
                    />
                </div>
            </div>
            {/* Row-2*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Country */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Country<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        value={apiData?.reCountry || ""}
                        readOnly
                    />
                </div>
                {/* State */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        State<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        value={apiData?.reState || ""}
                        readOnly
                    />
                </div>
                {/* City */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        City<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        value={apiData?.reCity || ""}
                        readOnly
                    />
                </div>
            </div>
            {/* Row-3*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {/* Zip Code */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Zip Code<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        value={apiData?.reZipcode || ""}
                        readOnly
                    />
                </div>
                <div></div>
                <div></div>
            </div>
            {/* ── Settlement Setup ──────────────────────────────────────────── */}
            <div className="pt-4">
                <h2 className="text-[18px] text-[#5c5c5c] mb-5">
                    Settlement Setup
                </h2>
                <p className="border-t border-gray-300 py-3"></p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-7 gap-y-5">
                    {/* Settlement Type */}
                    <div>
                        <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                            Settlement Type
                        </label>
                        <div className="flex items-center gap-5 mt-2">
                            {["Manual", "Automatic"].map((type) => (
                                <label
                                    key={type}
                                    className="flex items-center gap-1 text-[14px] text-[#5c5c5c]"
                                >
                                    <input
                                        type="radio"
                                        checked={apiData?.RSS_SettlementType === type}
                                        readOnly
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Settlement Cycle */}
                    <div>
                        <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                            Settlement Cycle (If Automated)
                        </label>
                        <input
                            type="text"
                            value={apiData?.RSS_SettlementCycle || ""}
                            readOnly
                            className="w-full h-8 border border-gray-400 rounded-sm bg-gray-100 px-3 outline-none"
                        />
                    </div>
                    {/* Payment By */}
                    <div>
                        <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                            Payment By
                        </label>

                        <input
                            type="text"
                            value={apiData?.RSS_PaymentBy || ""}
                            readOnly
                            className="w-full h-8 border border-gray-400 rounded-sm bg-gray-100 px-3 outline-none"
                        />
                    </div>
                    {/* Payment Advice */}
                    <div>
                        <label className="block text-[14px] font-semibold text-[#6b5f4d] mb-2">
                            Payment Advice
                        </label>

                        <input
                            type="text"
                            value={apiData?.RSS_PaymentAdvice || ""}
                            readOnly
                            className="w-full h-8 border border-gray-400 rounded-sm bg-gray-100 px-3 outline-none"
                        />
                    </div>
                </div>
            </div>
            {/* ── Beneficiary Account Details ───────────────────────────────── */}
            <div className="pt-4">
                <h2 className="text-[20px] text-gray-700 my-3">
                    Beneficiary Account Details
                </h2>
                <p className="border-t border-gray-300 py-3"></p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Beneficiary Account Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.RE_BeneficiaryAccountName || ""}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Beneficiary Account No<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.RE_BeneficiaryAccountNo || ""}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Beneficiary Bank Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.RE_BeneficiaryBankName || ""}
                            readOnly
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Beneficiary Branch Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.RE_BeneficiaryBranchName || ""}
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            IFSC Code<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={apiData?.RE_IFSCCode || ""}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}