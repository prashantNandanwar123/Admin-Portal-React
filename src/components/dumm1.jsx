import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";

export default function ECompanyDocs({ refId, handleNext, handleBack }) {

    const [documents, setDocuments] = useState({
        AOA: "",
        COMPANY_PAN: "",
        MOA: "",
        GST: "",
        COI: "",
        CANCELLED_CHEQUE: "",
        SIGNAGE: "",
        OFFICE_SHOP_PHOTO_1: "",
        OFFICE_SHOP_PHOTO_2: ""

    });

    useEffect(() => {
        viewCompanyDocs(refId);
    }, []);

    const viewCompanyDocs = async (refId) => {
        try {
            const response = await axiosInstance.post(
                `/merchant/kyc/viewCompanyDocs/${10001}`
            );

            console.log("company REsponse -->>>", response);

            if (response?.respCode === 0) {
                toast.success(response?.respMsg);
                // Documents
                const apiDocuments = response?.respData?.documents || [];

                const documentMap = {
                    AOA: null,
                    COMPANY_PAN: null,
                    MOA: null,
                    GST: null,
                    COI: null,
                    CANCELLED_CHEQUE: null,
                    SIGNAGE: null,
                    OFFICE_SHOP_PHOTO_1: null,
                    OFFICE_SHOP_PHOTO_2: null,
                };

                apiDocuments.forEach((doc) => {
                    documentMap[doc.fileType] = {
                        fileName: doc.fileName,
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

    const [userData, setUserData] = useState(null);

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


    // handleSaveEditCompany  APi
    const handleSaveEditCompany = async () => {
        try {
            const formData = new FormData();

            formData.append("refId", refId);
            formData.append("updatedBy", userData?.userName || "");

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

            console.log("Form Data payload : " + formData);

            const response = await axiosInstance.post(
                `/merchant/kyc/edit/companyDocs`,
                formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            }
            );
            const resData = response;

            if (resData?.respCode === 0) {
                toast.success(resData?.respMsg);
            } else {
                toast.error(resData?.respMsg);
            }
        } catch (error) {
            toast.error(error);
        }
    }

    const documentList = [
        {
            title: "Articles of Association (AOA)",
            documentType: "AOA",
        },
        {
            title: "Company Pan Card",
            documentType: "COMPANY_PAN",
        },
        {
            title: "Memorandum of Association (MOA)",
            documentType: "MOA",
        },
        {
            title: "Company GST Certificate",
            documentType: "GST",
        },
        {
            title: "Certificate of Incorporation (COI)",
            documentType: "COI",
        },
        {
            title: "Cancel check",
            documentType: "CANCELLED_CHEQUE",
        },
        {
            title: "Company Signature",
            documentType: "SIGNAGE",
        },
        {
            title: "Office / Shop Photo 1",
            documentType: "OFFICE_SHOP_PHOTO_1",
        },
        {
            title: "Office / Shop Photo 2",
            documentType: "OFFICE_SHOP_PHOTO_2",
        },

    ];

    // View document
    const viewFile = async (fileName) => {
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
            <div className="border-t border-gray-200 mt-3 mb-5" />
            {children}
        </div>
    );

    return (
        <div className="overflow-y-auto hide-scrollbar  sm:p-6 xl:p-8 space-y-5 sm:space-y-6">
            {/* ───────────── Header ───────────── */}
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
                                        Edit Company Documents
                                    </h2>
                                    <p className="text-[11px] font-medium text-slate-400">
                                        Upload and manage your company verification documents
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Document Status - RIGHT */}
                        <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
                            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                            <span className="text-xs font-semibold text-blue-700">
                                DOCUMENT VERIFICATION
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status */}
            <SectionCard title="Documents Details">
                {/* Upload Documents Details */}
                <div className="w-full">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {documentList.map((document, index) => {
                            const existingDocument = documents[document.documentType];//AOA
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
                                    {/* <input
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
                                    /> */}

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
                                                existingDocument.fileName
                                            }
                                        >
                                            {existingDocument.fileName}
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
                                                        existingDocument.fileName
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


            {/* BACK & NEXT BUTTONS */}
            <div className="flex justify-between items-center gap-4 mt-10">
                <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full"
                >
                    Back
                </button>
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleSaveEditCompany}
                        className="bg-green-500 hover:bg-green-500 text-white px-6 py-2 rounded"
                    >
                        Update
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 bg-amber-400  text-gray-900 font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
}