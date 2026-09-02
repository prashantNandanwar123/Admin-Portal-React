import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";


import {
    UserRound,
    Info,
    ChevronUp,
    ChevronDown,
    Trash2,
    BriefcaseBusiness,
    Upload,
    FileText,
    CreditCard,
    ShieldCheck,
} from "lucide-react";


const EMPTY_DIRECTOR = {
    name: "",
    designation: "",
    photograph: null,
    panCard: "",
    panNo: "",
    aadhaarCard: "",
    aadhaarNo: "",
};

export default function DirectorDetails({ data, setData, handleNext,
    handleBack }) {


    const [openDirector, setOpenDirector] = useState(1);
    const [directors, setDirectors] = useState({
        1: { ...EMPTY_DIRECTOR }, // Make Copy In Object
        2: { ...EMPTY_DIRECTOR },
    });

    const [error, setError] = useState("");
    // ACCORDION
    const toggleDirector = (directorNumber) => {
        setOpenDirector((prev) =>
            prev === directorNumber ? null : directorNumber
        );
    };

    // INPUT CHANGE
    const handleChange = (directorNumber, field, value) => {
        setDirectors((prev) => ({
            ...prev,
            [directorNumber]: {
                ...prev[directorNumber],
                [field]: value,
            },
        }));
    };

    // FILE CHANGE
    const handleFileChange = (directorNumber, field, file) => {
        handleChange(directorNumber, field, file);
    };

    // RESET DIRECTOR
    const resetDirector = async (directorNumber) => {
        try {
            setDirectors((prev) => ({
                ...prev,
                [directorNumber]: {
                    ...EMPTY_DIRECTOR,
                },
            }));
        } catch (error) {
            toast.error(error);
        }
    };

    // SAVE DIRECTORS
    const handleSave = async () => {
        try {
            setError("");
            if (!data?.refId) {
                return;
            }
            if (!directors[1].name) {
                toast.error("Director Name is required");
                return;
            }
             
            if (!directors[1].designation) {
                toast.error("Director Designation is required");
                return;
            }
             
            if (!directors[1].aadhaarNo) {
                toast.error("Director Aadhar No is required");
                return;
            }
             
            if (!directors[1].panNo) {
                toast.error("Director Pan No is required");
                return;
            }
            const formData = new FormData();
            formData.append("refId", data?.refId);
            formData.append("uploadedBy", "administrator"),
            formData.append("director1Name", directors[1].name);
            formData.append("director1Designation", directors[1].designation);
            formData.append("director1AadharNo", directors[1].aadhaarNo);
            formData.append("director1Selfie", directors[1].photograph);
            formData.append("director1Pan", directors[1].panCard);
            formData.append("director1PanNo", directors[1].panNo);
            formData.append("director1Aadhar", directors[1].aadhaarCard);

            formData.append("director2Name", directors[2].name);
            formData.append("director2Designation", directors[2].designation);
            formData.append("director2AadharNo", directors[2].aadhaarNo);
            formData.append("director2Selfie", directors[2].photograph);
            formData.append("director2Pan", directors[2].panCard);
            formData.append("director2PanNo", directors[2].panNo);
            formData.append("director2Aadhar", directors[2].aadhaarCard);

            const response = await axiosInstance.post(
                "/merchant/kyc/director",
                formData
            );
            if (response?.respCode === 0) {
                toast.success(response?.respMsg);
                setData((prev) => ({
                    ...prev,
                    refId: response?.respData?.ref_id,
                }));
                handleNext();
            } else {
                toast.error(response?.respMsg);
                if (response?.respData && typeof response.respData === "object") {
                    Object.values(response.respData).forEach((msg) => {
                        toast.error(msg);
                    });
                }
            }

        } catch (error) {
            setError(error);
        }
    };

    // DIRECTOR UI
    const renderDirector = (directorNumber) => {
        const director = directors[directorNumber];
        const isOpen = openDirector === directorNumber;

        return (
            <div
                key={directorNumber}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
                {/* Accordion Header */}
                <div
                    onClick={() => toggleDirector(directorNumber)}
                    className="flex items-center justify-between px-3 sm:px-4 py-3 bg-gray-50 cursor-pointer select-none"
                >
                    <div className="flex items-center gap-2">
                        {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}

                        <span className="text-sm font-semibold text-gray-800">
                            Director {directorNumber}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteDirector(directorNumber);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md bg-white hover:bg-red-50 transition"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </button>
                </div>

                {/* Accordion Body */}
                {isOpen && (
                    <div className="border-t border-gray-200">
                        <div className="p-3 sm:p-4">
                            {/* First Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Director Name */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">
                                        Director {directorNumber} Name
                                        <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <div className="relative">
                                        <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={director.name}
                                            onChange={(e) =>
                                                handleChange(
                                                    directorNumber,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter director name"
                                            required
                                            className="w-full h-10 pl-9 pr-3 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#1677c8] focus:ring-1 focus:ring-[#1677c8]"
                                        />
                                    </div>
                                </div>

                                {/* Designation */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-600 mb-1.5">
                                        Designation
                                        <span className="text-red-500 ml-0.5">*</span>
                                    </label>

                                    <div className="relative">
                                        <BriefcaseBusiness className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1169ad] pointer-events-none" />
                                        <select
                                            value={director.designation} onChange={(e) =>
                                                handleChange(
                                                    directorNumber,
                                                    "designation",
                                                    e.target.value
                                                )
                                            }
                                            className="appearance-none w-full h-10 pl-9 pr-8 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#1677c8] focus:ring-1 focus:ring-[#1677c8]"
                                        >
                                            <option value="">Select designation</option>
                                            <option value="Director">Director</option>
                                            <option value="Managing Director">
                                                Managing Director
                                            </option>
                                            <option value="CEO">
                                                CEO
                                            </option>
                                            <option value="Proprietor">
                                                Proprietor
                                            </option>
                                            <option value="Partner">
                                                Partner
                                            </option>
                                            <option value="Authorized Signatory">
                                                Authorized Signatory
                                            </option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                {/* PAN */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                                        PAN Number
                                        <span className="text-red-400 ml-0.5">*</span>
                                    </label>

                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type="text"
                                            maxLength={10}
                                            value={director.panNo}
                                            onChange={(e) =>
                                                handleChange(
                                                    directorNumber,
                                                    "panNo",
                                                    e.target.value
                                                        .toUpperCase()
                                                        .replace(/[^A-Z0-9]/g, "")
                                                )
                                            }
                                            placeholder="ABCDE1234F"
                                            className="w-full h-10 pl-9 pr-3 text-xs text-gray-500 border border-gray-200 rounded-lg outline-none focus:border-[#1677c8] focus:ring-1 focus:ring-[#1677c8] uppercase"
                                        />
                                    </div>
                                    <p className="mt-1.5 text-[9px] text-gray-400">
                                        Format: AAAAA0000A (10 characters)
                                    </p>
                                </div>

                                {/* Aadhaar */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                                        Aadhaar Number
                                        <span className="text-red-400 ml-0.5">*</span>
                                    </label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type="text"
                                            maxLength={12}
                                            value={director.aadhaarNo}
                                            onChange={(e) =>
                                                handleChange(
                                                    directorNumber,
                                                    "aadhaarNo",
                                                    e.target.value.replace(/\D/g, "")
                                                )
                                            }
                                            placeholder="XXXXXXXXXXXX"
                                            className="w-full h-10 pl-9 pr-20 text-xs text-gray-500 border border-gray-200 rounded-lg outline-none focus:border-[#1677c8] focus:ring-1 focus:ring-[#1677c8]"
                                        />
                                    </div>
                                    <p className="mt-1.5 text-[9px] text-gray-400">
                                        12-digit Aadhaar number
                                    </p>
                                </div>
                            </div>

                            {/* Third Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                {/* Photograph */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                                        Director {directorNumber} Photograph
                                        <span className="text-red-400 ml-0.5">*</span>
                                    </label>
                                    <label className="relative flex items-center h-10 w-full border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[#1677c8] transition">
                                        <FileText className="w-4 h-4 ml-3 text-gray-300" />
                                        <span className="ml-2 text-xs text-gray-400 truncate">
                                            {director.photograph
                                                ? director.photograph.name ||
                                                "Photograph uploaded"
                                                : "Upload director photograph"}
                                        </span>
                                        <div className="absolute right-2 flex items-center justify-center w-6 h-6 rounded-md border border-[#9cc9ee] bg-[#f7fbff]">
                                            <Upload className="w-3.5 h-3.5 text-[#1677c8]" />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    directorNumber,
                                                    "photograph",
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                        />
                                    </label>
                                </div>

                                {/* Pan Card */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                                        Director {directorNumber} Pan Card
                                        <span className="text-red-400 ml-0.5">*</span>
                                    </label>
                                    <label className="relative flex items-center h-10 w-full border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[#1677c8] transition">
                                        <FileText className="w-4 h-4 ml-3 text-gray-300" />
                                        <span className="ml-2 text-xs text-gray-400 truncate pr-12">
                                            {director.panCard
                                                ? director.panCard.name ||
                                                "Document uploaded"
                                                : "Upload Director Pan Card"}
                                        </span>

                                        <div className="absolute right-2 flex items-center justify-center w-6 h-6 rounded-md border border-[#9cc9ee] bg-[#f7fbff]">
                                            <Upload className="w-3.5 h-3.5 text-[#1677c8]" />
                                        </div>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    directorNumber,
                                                    "panCard",
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                        />
                                    </label>
                                </div>

                                {/* Aadhar Card */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                                        Director {directorNumber} Aadhar Card
                                        <span className="text-red-400 ml-0.5">*</span>
                                    </label>
                                    <label className="relative flex items-center h-10 w-full border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[#1677c8] transition">
                                        <FileText className="w-4 h-4 ml-3 text-gray-300" />
                                        <span className="ml-2 text-xs text-gray-400 truncate pr-12">
                                            {director.aadhaarCard
                                                ? director.aadhaarCard.name ||
                                                "Document uploaded"
                                                : "Upload Director Aadhar Card"}
                                        </span>
                                        <div className="absolute right-2 flex items-center justify-center w-6 h-6 rounded-md border border-[#9cc9ee] bg-[#f7fbff]">
                                            <Upload className="w-3.5 h-3.5 text-[#1677c8]" />
                                        </div>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    directorNumber,
                                                    "aadhaarCard",
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // MAIN UI
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5">
                {/* HEADER */}
                <div className="flex items-center justify-between pb-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#eef5f9]">
                            <UserRound className="w-4 h-4 text-[#126aa8]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[#173875]">
                                Add Director Details
                            </h2>
                            <p className="mt-0.5 text-[10px] text-gray-400">
                                Director information
                            </p>
                        </div>
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mt-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                        {error}
                    </div>
                )}

                {/* INFO */}
                <div className="mt-6 flex items-center gap-2 px-3 h-9 rounded-lg bg-[#f0f7ff] border border-[#a8d2ff]">
                    <Info className="w-3.5 h-3.5 text-[#126ab0]" />

                    <span className="text-[10px] text-[#1858a0]">
                        Minimum 1 directors required for your entity type.
                    </span>
                </div>

                {/* DIRECTORS */}
                <div className="mt-3 space-y-3">
                    {renderDirector(1)}
                    {renderDirector(2)}
                </div>

                {/* BUTTONS */}
                <div className="flex justify-between gap-2 mt-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-2.5 rounded-full shadow-sm transition"
                    >
                        Save & Next
                    </button>
                </div>
            </div>
        </div>
    );
}

