import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import {
    FileText,
    ArrowRight,
    X,
    Info,
    CheckCircle2,
    FileCheck2,
    ListChecks,
} from "lucide-react";

export default function CompanyDocuments({
    data,
    setData,
    errors,
    handleNext,
    handleBack,
}) {
    const [userData, setUserData] = useState(null);

    const [companyPan, setCompanyPan] = useState(null);
    const [aoa, setAoa] = useState(null);
    const [moa, setMoa] = useState(null);
    const [gst, setGst] = useState(null);
    const [coi, setCoi] = useState(null);
    const [cancelledCheque, setCancelledCheque] = useState(null);
    const [signage, setSignage] = useState(null);
    const [officeShopPhoto1, setOfficeShopPhoto1] = useState(null);
    const [officeShopPhoto2, setOfficeShopPhoto2] = useState(null);
    const [showDocumentRequirements, setShowDocumentRequirements] = useState(false);

    // Get logged-in user
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUserData(JSON.parse(storedUser));
            } catch (error) {
                console.error("Invalid user data in localStorage", error);
            }
        }
    }, []);

    // Save Company Documents
    const saveCompanyDocuments = async () => {
        try {
            const formData = new FormData();
            formData.append("refId", data?.refId || "");
            formData.append("uploadedBy", userData?.userName || "");

            if (companyPan) {
                formData.append("companyPan", companyPan);
            }
            if (aoa) {
                formData.append("aoa", aoa);
            }
            if (moa) {
                formData.append("moa", moa);
            }
            if (gst) {
                formData.append("gst", gst);
            }
            if (coi) {
                formData.append("coi", coi);
            }
            if (cancelledCheque) {
                formData.append("cancelledCheque", cancelledCheque);
            }
            if (signage) {
                formData.append("signage", signage);
            }
            if (officeShopPhoto1) {
                formData.append("officeShopPhoto1", officeShopPhoto1);
            }
            if (officeShopPhoto2) {
                formData.append("officeShopPhoto2", officeShopPhoto2);
            }

            const response = await axiosInstance.post(
                `/merchant/kyc/uploadCompanyDocs`,
                formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            }
            );

            const resData = response;
            if (resData?.respCode === 0) {
                toast.success(resData?.respMsg);
                setData((prev) => ({
                    ...prev,
                    refId:
                        resData?.respData?.ref_id ||
                        prev.refId,
                }));
                handleNext();
            } else {
                toast.error(resData?.respMsg);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <>
            <div className="overflow-y-auto hide-scrollbar p-4">
                {/* ──── Header ───*/}
                <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden p-[40px]">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-500">
                        <div className="flex items-center justify-between w-full px-6 py-4">
                            {/* Company Documents - LEFT */}
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf3f9]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-blue-700"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M7 3h8l4 4v14H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 3v5h5M9 13h6M9 17h6"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <h2 className="text-xl sm:text-xl font-semibold text-blue-900">
                                            Company Documents
                                        </h2>
                                        <p className="text-xs text-slate-400">
                                            Upload and manage your company verification documents
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Status*/}
                            <div className="flex items-center gap-2 rounded-full border-none bg-yellow-100 px-4 py-2">
                                <span className="h-2 w-2 rounded-full bg-green-600"></span>
                                <span className="text-xs font-semibold text-green-700">
                                    DOCUMENT VERIFICATION
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ───────────── Upload Documents Card ───────────── */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    {/* Section Header */}
                    <div className="px-5 pt-4 pb-3 sm:px-6">
                        <div className="flex items-center justify-between gap-4">
                            {/* Left Section - Not Clickable */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-blue-900">
                                        Documents Requirements
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        View upload guidelines & LOB checklist
                                    </p>
                                </div>
                            </div>

                            {/* Right Arrow - Only this is clickable */}
                            <button
                                type="button"
                                onClick={() => setShowDocumentRequirements(true)}
                                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shrink-0"
                            >
                                <ArrowRight size={17} />
                            </button>
                        </div>
                    </div>

                    {showDocumentRequirements && (
                        <div
                            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4"
                            onClick={() => setShowDocumentRequirements(false)}
                        >
                            <div
                                className="w-full max-w-[395px] max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Popup Header */}
                                <div className="flex items-start justify-between px-4 py-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <h2 className="text-[13px] font-semibold text-blue-900">
                                                Document Requirements
                                            </h2>
                                            <p className="text-[9px] text-slate-400">
                                                Please read before uploading your documents
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowDocumentRequirements(false)}
                                        className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 hover:text-slate-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                {/* Popup Content */}
                                <div className="px-2 py-2 max-h-[calc(90vh-110px)] overflow-y-auto">
                                    {/* Information */}
                                    <div className="mx-2 mb-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 flex gap-2">
                                        <Info
                                            size={14}
                                            className="text-blue-500 mt-0.5 shrink-0"
                                        />
                                        <p className="text-[9px] leading-4 text-slate-600">
                                            Kindly provide your company's legal and identification
                                            documents, duly signed, sealed, and self-attested by the
                                            designated authority.
                                        </p>
                                    </div>

                                    {/* Accepted File Formats */}
                                    <div className="mx-2 mb-2 rounded-lg border border-slate-200 overflow-hidden">
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 border-b border-slate-200">
                                            <div className="w-6 h-6 rounded-md bg-green-100 text-green-600 flex items-center justify-center">
                                                <CheckCircle2 size={13} />
                                            </div>
                                            <span className="text-[10px] font-semibold text-blue-900">
                                                Accepted File Formats
                                            </span>
                                        </div>

                                        <div className="px-3 py-2 flex gap-2">
                                            <span className="px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-[8px] text-green-600 font-medium">
                                                PNG
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-[8px] text-green-600 font-medium">
                                                JPEG
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-[8px] text-green-600 font-medium">
                                                PDF
                                            </span>
                                        </div>
                                    </div>


                                    {/* LOB Requirements */}
                                    <div className="mx-2 mb-2 rounded-lg border border-slate-200 overflow-hidden">
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 border-b border-slate-200">
                                            <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                <ListChecks size={13} />
                                            </div>
                                            <span className="text-[10px] font-semibold text-blue-900">
                                                Document Requirements
                                            </span>
                                        </div>

                                        <div className="px-3 py-2">
                                            <div className="space-y-1">
                                                <p className="text-[9px] leading-4 text-slate-600">
                                                    <span className="font-semibold">1.</span> Document must be printed on the{" "}
                                                    <span className="font-semibold">official company letterhead.</span>
                                                </p>

                                                <p className="text-[9px] leading-4 text-slate-600">
                                                    <span className="font-semibold">2.</span> The document must be{" "}
                                                    <span className="font-semibold">properly signed</span> by the authorized signatory.
                                                </p>

                                                <p className="text-[9px] leading-4 text-slate-600">
                                                    <span className="font-semibold">3.</span>{" "}
                                                    <span className="font-semibold">Company stamp / seal</span> should be clearly visible.
                                                </p>

                                                <p className="text-[9px] leading-4 text-slate-600">
                                                    <span className="font-semibold">4.</span> Authorized signatory's{" "}
                                                    <span className="font-semibold">name & designation</span> should be mentioned.
                                                </p>

                                                <p className="text-[9px] leading-4 text-slate-600">
                                                    <span className="font-semibold">5.</span>{" "}
                                                    <span className="font-semibold">Date</span> must be clearly written on the document.
                                                </p>

                                                <p className="text-[9px] leading-4 text-slate-600">
                                                    <span className="font-semibold">6.</span> No{" "}
                                                    <span className="font-semibold">overwriting, blurring, or editing</span> should be present.
                                                </p>

                                                <p className="text-[9px] leading-4 text-slate-600">
                                                    <span className="font-semibold">7.</span> Document must be uploaded in{" "}
                                                    <span className="font-semibold">clear, readable quality</span> (PDF / JPG).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end px-3 py-2 border-t border-slate-100 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setShowDocumentRequirements(false)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-semibold shadow-sm transition"
                                    >
                                        <CheckCircle2 size={12} />
                                        Got it
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Documents Grid */}
                    <div className="p-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3">
                            {[
                                {
                                    title: "Articles of Association (AOA)",
                                    state: aoa,
                                    setState: setAoa,
                                    icon: "aoa",
                                },
                                {
                                    title: "Company Pan Card",
                                    state: companyPan,
                                    setState: setCompanyPan,
                                    icon: "pan",
                                },
                                {
                                    title: "Memorandum of Association (MOA)",
                                    state: moa,
                                    setState: setMoa,
                                    icon: "moa",
                                },
                                {
                                    title: "Company GST Certificate",
                                    state: gst,
                                    setState: setGst,
                                    icon: "gst",
                                },
                                {
                                    title: "Certificate of Incorporation (COI)",
                                    state: coi,
                                    setState: setCoi,
                                    icon: "coi",
                                },
                                {
                                    title: "Cancel check",
                                    state: cancelledCheque,
                                    setState: setCancelledCheque,
                                    icon: "cheque",
                                },
                                {
                                    title: "Company Signature",
                                    state: signage,
                                    setState: setSignage,
                                    icon: "signature",
                                },
                                {
                                    title: "Office / Shop Photo 1",
                                    state: officeShopPhoto1,
                                    setState: setOfficeShopPhoto1,
                                    icon: "office",
                                },
                                {
                                    title: "Office / Shop Photo 2",
                                    state: officeShopPhoto2,
                                    setState: setOfficeShopPhoto2,
                                    icon: "office",
                                },
                                
                            ].map((document, index) => (

                                <div
                                    key={index}
                                    className={`
                                    group relative flex min-h-[175px] flex-col
                                    items-center justify-center
                                    rounded-2xl border
                                    px-4 py-5 text-center
                                    transition-all duration-200
                                    ${document.state
                                            ? "border-green-200 bg-green-50/50"
                                            : "border-slate-200 bg-slate-50/70 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md"
                                        }
                                `}
                                >

                                    {/* Upload Icon */}
                                    <label
                                        htmlFor={`document-${index}`}
                                        className={`
                                            flex h-14 w-14 cursor-pointer
                                            items-center justify-center
                                            rounded-2xl transition-all duration-200
                                            ${document.state
                                                ? "bg-green-100 text-green-600"
                                                : "bg-blue-50 text-blue-600 shadow-sm group-hover:bg-blue-100"
                                            }
                                            `}
                                    >
                                        {document.state ? (
                                            // Uploaded Check Icon
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-7 w-7"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        ) : (
                                            <>

                                                {document.icon === "aoa" && (
                                                    // AOA - Document
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 3h9l4 4v14H6a2 2 0 01-2-2V5a2 2 0 012-2z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            d="M14 3v5h5M8 12h8M8 16h6"
                                                        />
                                                    </svg>
                                                )}

                                                {document.icon === "pan" && (
                                                    // PAN Card Icon
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                    >
                                                        <rect
                                                            x="3"
                                                            y="5"
                                                            width="18"
                                                            height="14"
                                                            rx="2"
                                                        />
                                                        <circle cx="8" cy="11" r="2" />
                                                        <path
                                                            strokeLinecap="round"
                                                            d="M13 10h5M13 14h4"
                                                        />
                                                    </svg>
                                                )}

                                                {document.icon === "moa" && (
                                                    // MOA - Document
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 3h9l4 4v14H6a2 2 0 01-2-2V5a2 2 0 012-2z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            d="M14 3v5h5M8 12h8M8 16h8"
                                                        />
                                                    </svg>
                                                )}

                                                {document.icon === "gst" && (
                                                    // GST Certificate
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 3h9l4 4v14H6a2 2 0 01-2-2V5a2 2 0 012-2z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            d="M14 3v5h5M8 12h8M8 16h5"
                                                        />
                                                        <circle cx="17" cy="16" r="2" />
                                                    </svg>
                                                )}

                                                {document.icon === "coi" && (
                                                    // Certificate of Incorporation
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 3h9l4 4v14H6a2 2 0 01-2-2V5a2 2 0 012-2z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            d="M14 3v5h5"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9 15l2 2 4-4"
                                                        />
                                                    </svg>
                                                )}

                                                {document.icon === "cheque" && (
                                                    // Cancelled Cheque
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                    >
                                                        <rect
                                                            x="3"
                                                            y="6"
                                                            width="18"
                                                            height="12"
                                                            rx="1.5"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            d="M6 10h6M6 14h4M15 10h3M15 14h3"
                                                        />
                                                    </svg>
                                                )}

                                                {document.icon === "signature" && (
                                                    // Signature
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4 17c2-4 4-6 6-5 2 1-1 5 1 6 2 1 4-4 6-5 2-1 3 1 3 2"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            d="M4 21h16"
                                                        />
                                                    </svg>
                                                )}

                                                {document.icon === "office" && (
                                                    // Office / Shop
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 10l2-6h14l2 6"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4 10v9h16v-9"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            d="M8 19v-5h8v5M3 10h18"
                                                        />
                                                    </svg>
                                                )}
                                            </>
                                        )}
                                    </label>


                                    {/* Hidden File Input */}
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
                                    <p className="mt-4 max-w-[190px] text-sm font-semibold leading-5 text-slate-700">
                                        {document.title}
                                        <span className="ml-1 text-red-500">*</span>
                                    </p>

                                    {/* File Name */}
                                    {document.state ? (
                                        <div className="mt-2 flex max-w-[210px] items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3.5 w-3.5 flex-shrink-0 text-green-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>

                                            <p className="truncate text-[10px] font-semibold text-green-600"
                                                title={document.state.name}>
                                                {document.state.name}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-[10px] text-slate-400">
                                            PDF, JPG, JPEG, PNG · Max 5 MB
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ───────────── Bottom Action Bar ───────────── */}
                    <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-6">
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* Back */}
                            <button
                                type="button"
                                onClick={handleBack}
                                className="
                                inline-flex w-full items-center
                                justify-center gap-2 rounded-xl
                                border border-slate-300 bg-white
                                px-6 py-2.5 text-sm font-semibold
                                text-slate-600 shadow-sm
                                transition-all duration-200
                                hover:border-slate-400 hover:bg-slate-100
                                sm:w-auto
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Back
                            </button>

                            {/* Save & Next */}
                            <button
                                type="button"
                                onClick={saveCompanyDocuments}
                                className="
                                inline-flex w-full items-center
                                justify-center gap-2 rounded-xl
                                bg-amber-400 px-7 py-2.5
                                text-sm font-bold text-slate-900
                                shadow-sm
                                transition-all duration-200
                                hover:bg-amber-500
                                hover:shadow-md
                                active:scale-[0.98]
                                sm:w-auto
                            "
                            >
                                Save & Next

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}