import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { User, CalendarDays } from "lucide-react";

export default function ResellerViewDetails() {
    const [apiData, setData] = useState({});
    const location = useLocation();
    const resellerId = location.state?.resellerId;

    console.log("Reseller Id", resellerId);

    useEffect(() => {
        viewResellers();
    }, []);

    const viewResellers = async () => {
        try {
            const response = await axiosInstance.post(
                `/reseller/viewReseller/${resellerId}`
            );
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

    /* ── Reusable read-only field (matches the reference card design) ── */
    const ViewField = ({ label, value, required }) => (
        <div>
            <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="w-full min-h-[42px] border border-gray-200 rounded-lg bg-white px-3 py-2 flex items-center text-[13px] sm:text-sm text-gray-800 shadow-sm">
                {value || "-"}
            </div>
        </div>
    );

    /* ── Section wrapper card ── */
    const SectionCard = ({ title, children, className = "" }) => (
        <div
            className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 xl:p-7 ${className}`}
        >
            <h2 className="text-[17px] sm:text-lg xl:text-xl font-semibold text-gray-800">
                {title}
            </h2>
            <div className="border-t border-gray-200 mt-3 mb-5" />
            {children}
        </div>
    );

    return (
        <div className="overflow-y-auto hide-scrollbar bg-[#F7F7F8] p-4 sm:p-6 xl:p-8 space-y-5 sm:space-y-6">
            <div>
                <h2 className="text-xl xl:text-2xl sm:text-lg uppercase text-slate-800 font-bold tracking-tight">
                    View Reseller
                </h2>
                <p className="pt-2 pb-1 text-sm sm:text-base text-[#0D47A1] font-medium">
                    View and manage reseller onboarding details including profile
                    information, verification status, and account configuration in a
                    centralized dashboard.
                </p>
            </div>

            {/* ── Onboarding Status ─────────────────────────────────────── */}
            <SectionCard title="Reseller Onboarding Status">
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
                                {apiData?.approvedBy || "-"}
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
                                {apiData?.createdAt || "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* ── Basic Reseller Details ───────────────────────────────── */}
            <SectionCard title="Basic Reseller Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
                    <ViewField label="First Name" required value={apiData?.firstName} />
                    <ViewField label="Last Name" required value={apiData?.lastName} />
                    <ViewField label="Email Id" required value={apiData?.email} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 mt-5">
                    <ViewField label="Mobile" required value={apiData?.mobile} />
                    <ViewField label="Company Name" required value={apiData?.companyName} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 mt-5">
                    <ViewField label="Aadhar No." required value={apiData?.aadharNo} />
                    <ViewField label="GSTN No." required value={apiData?.gstNo} />
                    <ViewField label="Pan No" required value={apiData?.panNo} />
                </div>
            </SectionCard>

            {/* ── Address ───────────────────────────────────────────────── */}
            <SectionCard title="Address">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
                    <ViewField label="Address" required value={apiData?.address} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 mt-5">
                    <ViewField label="Country" required value={apiData?.country} />
                    <ViewField label="State" required value={apiData?.state} />
                    <ViewField label="City" required value={apiData?.city} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 mt-5">
                    <ViewField label="Zip Code" required value={apiData?.pincode} />
                </div>
            </SectionCard>

            {/* ── Settlement Setup ──────────────────────────────────────── */}
            <SectionCard title="Settlement Setup">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 xl:gap-x-7 gap-y-5">
                    <div>
                        <label className="block text-[13px] sm:text-sm font-medium text-gray-600 mb-2">
                            Settlement Type
                        </label>
                        <div className="flex items-center gap-5">
                            {["Manual", "Automatic"].map((type) => (
                                <label
                                    key={type}
                                    className="flex items-center gap-1.5 text-[13px] sm:text-sm text-gray-700"
                                >
                                    <input
                                        type="radio"
                                        checked={apiData?.RSS_SettlementType === type}
                                        readOnly
                                        className="accent-amber-500 w-4 h-4"
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    <ViewField
                        label="Settlement Cycle (If Automated)"
                        value={apiData?.RSS_SettlementCycle}
                    />
                    <ViewField label="Payment By" value={apiData?.RSS_PaymentBy} />
                    <ViewField label="Payment Advice" value={apiData?.RSS_PaymentAdvice} />
                </div>
            </SectionCard>

            {/* ── Beneficiary Account Details ──────────────────────────── */}
            <SectionCard title="Beneficiary Account Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
                    <ViewField
                        label="Beneficiary Account Name"
                        required
                        value={apiData?.RE_BeneficiaryAccountName}
                    />
                    <ViewField
                        label="Beneficiary Account No"
                        required
                        value={apiData?.RE_BeneficiaryAccountNo}
                    />
                    <ViewField
                        label="Beneficiary Bank Name"
                        required
                        value={apiData?.RE_BeneficiaryBankName}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 mt-5">
                    <ViewField
                        label="Beneficiary Branch Name"
                        required
                        value={apiData?.RE_BeneficiaryBranchName}
                    />
                    <ViewField label="IFSC Code" required value={apiData?.RE_IFSCCode} />
                </div>
            </SectionCard>

            {/* Status */}
            <SectionCard title="Status">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
                    <ViewField
                        label="Status"
                        value={apiData?.status}
                    />

                    <ViewField
                        label="Rejection Reason"
                        value={apiData?.rejectionReason}
                    />
                </div>
            </SectionCard>
        </div>
    );
}