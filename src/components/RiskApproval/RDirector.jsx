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
    Eye
} from "lucide-react";

export default function RDirector({ refId,
    handleNext,
    handleBack }) {

    const [openDirector, setOpenDirector] = useState(1);
    const [directorCount, setDirectorCount] = useState(1);
        const [directorData, setDirectorData] = useState({});

    useEffect(() => {
        VDirectorDetails(refId);
    }, [])

    const VDirectorDetails = async (refId) => {
        if (!refId) return;

        try {
            const response = await axiosInstance.post(
                `/merchant/kyc/view/director/${refId}`
            );

            if (response.respCode === 0) {
                toast.success(response.respMsg);

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
                                                readOnly
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
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewFile(selfie.fileName)}
                                                    className="mr-2 p-1.5 rounded-md text-gray-400 hover:text-[#1677c8] hover:bg-blue-50 transition shrink-0"
                                                    title="View Photograph"
                                                >
                                                    <Eye className="w-4 h-4 text-green-400" />
                                                </button>
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
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewFile(pan.fileName)}
                                                    className="mr-2 p-1.5 rounded-md text-gray-400 hover:text-[#1677c8] hover:bg-blue-50 transition shrink-0"
                                                    title="View PAN Card"
                                                >
                                                    <Eye className="w-4 h-4 text-green-400" />
                                                </button>

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
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewFile(aadhar.fileName)}
                                                    className="mr-2 p-1.5 rounded-md text-gray-400 hover:text-[#1677c8] hover:bg-blue-50 transition shrink-0"
                                                    title="View Aadhar Card"
                                                >
                                                    <Eye className="w-4 h-4 text-green-400" />
                                                </button>
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
        <div className="bg-white">
            <div className="max-w-screen mx-auto px-4 sm:px-6 py-5">
                {/* HEADER */}
                <div className="flex items-center justify-between pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#eef5f9]">
                            <UserRound className="w-4 h-4 text-[#126aa8]" />
                        </div>
                        <div>
                            <h2 className="xl:text-2xl sm:text-lg font-semibold text-[#173875]">
                                Review Director Details
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

                    {directorCount >= 2 && (
                        renderDirector(2)
                    )}
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


