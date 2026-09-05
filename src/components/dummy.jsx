import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";
import {
    UserRound,
    ChevronUp,
    ChevronDown,
    BriefcaseBusiness,
    FileText,
    CreditCard,
    ShieldCheck,
    Eye,
    Upload
} from "lucide-react";

export default function EDirectorDetails({ refId,
    handleNext,
    handleBack }) {

    const [openDirector, setOpenDirector] = useState(1);
    const [directorCount, setDirectorCount] = useState(1);
    const [directorData, setDirectorData] = useState({});
    const [userData, setUserData] = useState(null);

    // Get logged-in user
    useEffect(() => {
        VDirectorDetails(refId);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUserData(JSON.parse(storedUser));
            } catch (error) {
                console.error("Invalid user data in localStorage", error);
            }
        }
    },
        []);


    // View Api Director Details
    const VDirectorDetails = async (refId) => {
        if (!refId) return;

        try {
            const response = await axiosInstance.post(
                `/merchant/kyc/view/director/${1022}`
            );
            console.log("view response--->>", response);

            if (response.respCode === 0) {
                const directors = response.respData?.directors || [];
                // Number of directors coming from API
                const count = response.respData?.directorNumber
                    || directors.length
                    || 1;
                setDirectorCount(count);
                // Keep director data separately
                const directorMap = {};

                directors.forEach((director) => {
                    directorMap[director.directorNumber] = director;
                });
                setDirectorData(directorMap);
                // Open first director by default
                setOpenDirector(1);
            }

        } catch (error) {
            toast.error(error);
        }
    };

    // handleEditDirector APi CAll
    const handleEditDirector = async () => {

        console.log("handleedit:", handleEditDirector);
          

        try {
            const formData = new FormData();
            formData.append("refId", refId);
            formData.append("updatedBy", userData?.userName || ""),
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
                "/merchant/kyc/edit/director",
                formData
            );
            console.log("view Api save", response);
            if (response?.respcode === 0) {
                toast.success(response?.respMsg);
            }
            else {

            }
        } catch (error) {

        }
    }



 console.log("handleedit:", handleEditDirector);
    // Document File Api Call
    const handleViewFile = async (fileName) => {
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
            const fileUrl = URL.createObjectURL(response);
            window.open(fileUrl, "_blank");

            setTimeout(() => {
                URL.revokeObjectURL(fileUrl);
            }, 10000);

        } catch (error) {
            toast.error(error);
        }
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

    // ACCORDION
    const toggleDirector = (directorNumber) => {
        setOpenDirector((prev) =>

            prev === directorNumber ? null : directorNumber
        );
    };

    // DIRECTOR UI
    const renderDirector = (directorNumber) => {
        const isOpen = openDirector === directorNumber;

        const currentDirector = directorData?.[directorNumber] || {};

        const selfie = currentDirector?.documents?.find(
            (doc) => doc.fileType === "DIRECTOR_SELFIE"
        );

        const pan = currentDirector?.documents?.find(
            (doc) => doc.fileType === "DIRECTOR_PAN"
        );

        const aadhar = currentDirector?.documents?.find(
            (doc) => doc.fileType === "DIRECTOR_AADHAAR"
        );


        return (
            <>
                <div
                    key={directorNumber}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white">
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
                                                onChange={(e) =>
                                                    handleChange(
                                                        directorNumber,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                value={currentDirector?.directorName || ""}
                                                placeholder="Enter director name"
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
                                            <input
                                                readOnly
                                                value={currentDirector?.directorDesignation || ""}
                                                className="appearance-none w-full h-10 pl-9 pr-8 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#1677c8] focus:ring-1 focus:ring-[#1677c8]"

                                            >
                                            </input>
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

                                                value={currentDirector?.directorPanNo || ""}
                                                className="w-full h-10 pl-9 pr-3 text-xs text-gray-500 border border-gray-200 rounded-lg outline-none focus:border-[#1677c8] focus:ring-1 focus:ring-[#1677c8] uppercase"
                                            />
                                        </div>
                                    </div>

                                    {/* Aadhaar */}
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                                            Aadhar Number
                                            <span className="text-red-400 ml-0.5">*</span>
                                        </label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                value={currentDirector?.directorAadharNo || ""}

                                                className="w-full h-10 pl-9 pr-20 text-xs text-gray-500 border border-gray-200 rounded-lg outline-none focus:border-[#1677c8] focus:ring-1 focus:ring-[#1677c8]"
                                            />
                                        </div>
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
                                            <div className="w-full flex items-center justify-between">
                                                {/* Left: File icon + File name */}
                                                <div className="flex items-center min-w-0">
                                                    <FileText className="w-4 h-4 ml-3 text-gray-300 shrink-0" />
                                                    <span className="ml-2 text-xs text-gray-400 truncate">
                                                        {selfie?.fileName || "No photograph uploaded"}
                                                    </span>
                                                </div>

                                                {/* Right: View icon */}
                                                <div className="mr-2 flex items-center gap-1">
                                                    {/* View */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewFile(selfie.fileName)}
                                                        className="p-1.5 rounded-md bg-green-100 hover:bg-green-200 transition"
                                                        title="View Photograph"
                                                    >
                                                        <Eye className="w-4 h-4 text-green-500" />
                                                    </button>

                                                    {/* Upload */}
                                                    <label
                                                        className="p-1.5 rounded-md bg-blue-100 hover:bg-blue-200 transition cursor-pointer"
                                                        title="Upload Photograph"
                                                    >
                                                        <Upload className="w-3.5 h-3.5 text-[#1677c8]" />

                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileUpload(e, "selfie")}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Pan Card */}
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                                            Director {directorNumber} Pan Card
                                            <span className="text-red-400 ml-0.5">*</span>
                                        </label>

                                        <label className="relative flex items-center h-10 w-full border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[#1677c8] transition">
                                            <div className="w-full flex items-center justify-between">
                                                {/* Left: File icon + File name */}
                                                <div className="flex items-center min-w-0">
                                                    <FileText className="w-4 h-4 ml-3 text-gray-300 shrink-0" />
                                                    <span className="ml-2 text-xs text-gray-400 truncate">
                                                        {pan?.fileName || "No PAN document uploaded"}
                                                    </span>
                                                </div>

                                                {/* Right: View icon */}
                                                <div className="mr-2 flex items-center gap-1">
                                                    {/* View PAN */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewFile(pan.fileName)}
                                                        className="p-1.5 rounded-md bg-green-50 hover:bg-green-100 transition"
                                                        title="View PAN Card"
                                                    >
                                                        <Eye className="w-4 h-4 text-green-500" />
                                                    </button>

                                                    {/* Upload PAN */}
                                                    <label
                                                        className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                                                        title="Upload PAN Card"
                                                    >
                                                        <Upload className="w-3.5 h-3.5 text-[#1677c8]" />

                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileUpload(e, "pan")}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Aadhar Card */}
                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                                            Director {directorNumber} Aadhar Card
                                            <span className="text-red-400 ml-0.5">*</span>
                                        </label>
                                        <label className="relative flex items-center h-10 w-full border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[#1677c8] transition">
                                            <div className="w-full flex items-center justify-between">
                                                {/* Left: File icon + File name */}
                                                <div className="flex items-center min-w-0">
                                                    <FileText className="w-4 h-4 ml-3 text-gray-300 shrink-0" />
                                                    <span className="ml-2 text-xs text-gray-400 truncate">
                                                        {aadhar?.fileName || "No Aadhaar document uploaded"}
                                                    </span>
                                                </div>
                                                {/* Right: View icon */}
                                                <div className="mr-2 flex items-center gap-1">
                                                    {/* View Aadhar */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewFile(aadhar.fileName)}
                                                        className="p-1.5 rounded-md bg-green-50 hover:bg-green-100 transition"
                                                        title="View Aadhar Card"
                                                    >
                                                        <Eye className="w-4 h-4 text-green-500" />
                                                    </button>

                                                    {/* Upload Aadhar */}
                                                    <label
                                                        className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                                                        title="Upload Aadhar Card"
                                                    >
                                                        <Upload className="w-3.5 h-3.5 text-[#1677c8]" />

                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileUpload(e, "aadhar")}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    };

    // MAIN UI
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5">
                {/* HEADER */}
                <div className="flex items-center justify-between pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#eef5f9]">
                            <UserRound className="w-4 h-4 text-[#126aa8]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[#173875]">
                                Edit Director Details
                            </h2>
                            <p className="mt-0.5 text-sm text-gray-500">
                                Director information
                            </p>
                        </div>
                    </div>
                </div>

                {/* DIRECTORS */}
                <div className="mt-3 space-y-3">
                    {renderDirector(1)}

                    {directorCount >= 1 && renderDirector(2)}
                </div>


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
                            onClick={handleEditDirector}
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
        </div>
    );
};


