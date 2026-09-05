import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { Eye, User, CalendarDays, UserPlus } from "lucide-react";


export default function ResellerViewDetails() {

    const [apiData, setData] = useState({});
    const [passportPhoto, setPassportPhoto] = useState(null);
    const [aadharCard, setAadharCard] = useState(null);
    const [panCard, setPanCard] = useState(null);
    const [addressProof, setAddressProof] = useState(null);
    const location = useLocation();
    const resellerId = location.state?.resellerId;
    const [documents, setDocuments] = useState({
        PASSPORT_PHOTO: null,
        AADHAAR_CARD: null,
        PAN_CARD: null,
        ADDRESS_PROOF: null,
    });

    useEffect(() => {
        viewResellers();
    }, []);

    const viewResellers = async () => {
        try {
            const response = await axiosInstance.post(
                `/reseller/viewReseller/${resellerId}`
            );

            if (response?.respCode === 0) {
                setData(response?.respData || {});
                // Documents
                const apiDocuments = response?.respData?.documents || [];

                const documentMap = {
                    PASSPORT_PHOTO: null,
                    AADHAAR_CARD: null,
                    PAN_CARD: null,
                    ADDRESS_PROOF: null,
                };

                apiDocuments.forEach((doc) => {
                    documentMap[doc.documentType] = {
                        id: doc.id,
                        originalFileName: doc.originalFileName,
                        downloadUrl: doc.downloadUrl,
                    };
                });

                setDocuments(documentMap);
            } else {
                toast.error(response?.respMsg);
                setData({});
            }
        } catch (error) {
            toast.error(error);
            setData({});
        }
    };

    const documentList = [
        {
            title: "Reseller Photograph",
            documentType: "PASSPORT_PHOTO",
        },
        {
            title: "Aadhar Card",
            documentType: "AADHAAR_CARD",
        },
        {
            title: "Pan Card",
            documentType: "PAN_CARD",
        },
        {
            title: "Address Proof",
            documentType: "ADDRESS_PROOF",
        },
    ];

    // View document
    const viewFile = async (documentId) => {
        try {
            if (!documentId) {
                toast.error("Document ID is missing");
                return;
            }

            console.log("Downloading document ID:", documentId);

            const response = await axiosInstance.get(
                `/reseller/reDownloadDocs/${documentId}`,
                {
                    responseType: "blob",
                }
            );

            console.log("BLOB RESPONSE --->>>", response);

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
            <div className="mb-5" />
            {children}
        </div>
    );

    return (
        <div className="overflow-y-auto hide-scrollbar bg-[#F7F7F8] p-4 sm:p-6 xl:p-8 space-y-5 sm:space-y-6">


            <div className="mb-5 rounded-2xl border border-slate-200 bg-white px-5 py-2 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-500 via-yellow-500 to-yellow-500"></div>
                <div>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 shrink-0">
                            <UserPlus size={18} />
                        </span>
                        <h2 className="text-xl text-blue-900 font-semibold">
                             Reseller Details
                        </h2>
                    </div>
                    <p className="ml-12 pb-1 text-sm text-blue-900">
                        View and manage reseller onboarding details including profile
                        information, verification status, and account configuration in a
                        centralized dashboard.
                    </p>
                </div>
            </div>

            {/* ── Onboarding Status ─────────────────────────────────────── */}
            <SectionCard>
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
                                Created At
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
                    <ViewField label="Mobile No" required value={apiData?.mobile} />
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
                                        checked={apiData?.rssSettlementType === type}
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
                        value={apiData?.rssSettlementCycle}
                    />
                    <ViewField label="Payment By" value={apiData?.rssPaymentBy} />
                    <ViewField label="Payment Advice" value={apiData?.RSS_PaymentAdvice} />
                </div>
            </SectionCard>

            {/* ── Beneficiary Account Details ──────────────────────────── */}
            <SectionCard title="Beneficiary Account Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
                    <ViewField
                        label="Beneficiary Account Name"
                        required
                        value={apiData?.reBeneficiaryAccountName}
                    />
                    <ViewField
                        label="Beneficiary Account No"
                        required
                        value={apiData?.reBeneficiaryAccountNo}
                    />
                    <ViewField
                        label="Beneficiary Bank Name"
                        required
                        value={apiData?.reBeneficiaryBankName}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 mt-5">
                    <ViewField
                        label="Beneficiary Branch Name"
                        required
                        value={apiData?.reBeneficiaryBranchName}
                    />
                    <ViewField label="IFSC Code" required value={apiData?.reIFSCCode} />
                </div>
            </SectionCard>

            {/* Status */}
            <SectionCard title="Documents Details">
                {/* Upload Documents Details */}
                <div className="w-full">
                    <p className="border-t border-gray-300 py-3"></p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {documentList.map((document, index) => {
                            const existingDocument =
                                documents[document.documentType];
                            const hasDocument = !!existingDocument;
                            return (
                                <div
                                    key={index}
                                    className={`relative flex h-[125px] flex-col items-center justify-center rounded-lg px-3 text-center ${hasDocument
                                        ? "border-2 border-green-500 bg-[#f9fbfd]"
                                        : "border border-dashed border-[#d9e2ef] bg-[#f9fbfd]"
                                        }`}
                                >

                                    {/* Green Tick */}
                                    {hasDocument && (
                                        <div className="absolute top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
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

                                    {/* Hidden File Input */}
                                    <input
                                        id={`document-${index}`}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.jfif"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0];

                                            if (!file) return;

                                            if (
                                                file.size >
                                                5 * 1024 * 1024
                                            ) {
                                                toast.error(
                                                    "File size must be less than 5 MB"
                                                );

                                                e.target.value = "";
                                                return;
                                            }

                                            // For now only UI update
                                            setDocuments((prev) => ({
                                                ...prev,
                                                [document.documentType]: {
                                                    id: null,
                                                    originalFileName:
                                                        file.name,
                                                    downloadUrl: null,
                                                    file: file,
                                                },
                                            }));
                                        }}
                                    />

                                    {/* Document Name */}
                                    <p className="mt-2 text-xs font-medium leading-4 text-[#475569]">
                                        {document.title}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </p>

                                    {/* Existing File Name */}
                                    {hasDocument ? (
                                        <p
                                            className="mt-1 max-w-[150px] truncate text-[10px] font-medium text-green-600"
                                            title={
                                                existingDocument.originalFileName
                                            }
                                        >
                                            {existingDocument.originalFileName}
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-[9px] text-[#94a3b8]">
                                            PDF / JPG / PNG - max 5 MB
                                        </p>
                                    )}

                                    {/* Icons */}
                                    <div className="mt-2 flex items-center gap-3">
                                        {/* Eye Icon - First */}
                                        {hasDocument && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    viewFile(
                                                        existingDocument.id
                                                    )
                                                }
                                                title="View document"
                                                className="cursor-pointer"
                                            >
                                                <Eye
                                                    className="h-5 w-5 text-blue-500"
                                                    strokeWidth={1.8}
                                                />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </SectionCard>
        </div>
    );
}