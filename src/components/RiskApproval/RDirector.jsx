import React, { useEffect, useState } from "react";
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
    Eye
} from "lucide-react";

export default function RDirector({ refId,
    data,
    setData,
    errors,
    handleNext,
    handleBack }) {
    const EMPTY_DIRECTOR = {
        name: "",
        designation: "",
        photograph: null,
        panCard: "",
        panNo: "",
        aadhaarCard: "",
        aadhaarNo: "",
    };

    const [openDirector, setOpenDirector] = useState(1);

    const [directors, setDirectors] = useState({
        1: { ...EMPTY_DIRECTOR }, // Make Copy In Object
        2: { ...EMPTY_DIRECTOR },
    });

    useEffect(() => {
        VDirectorDetails(refId);
    }, [])

    const [directorData, setDirectorData] = useState({});
    const [directorAadharCard, setDirectorAadhar] = useState({});
    const [directorSelfie, setDirectorSelfie] = useState({});
    const [directorPan, setDirectorPan] = useState({});


    const VDirectorDetails = async (ref_id) => {
        if (!ref_id) return;

        try {
            const response = await axiosInstance.post(
                `/merchant/kyc/view/director/${ref_id}`
            );
            console.log("view response--->>", response);
            if (response.respCode === 0) {
                toast.success(response.respMsg);


                const directorData = response.respData?.directors || [];

                directorData.forEach((director) => {
                    setDirectorData(director);

                    director.documents?.forEach((doc) => {
                        if (doc.fileType === "DIRECTOR_AADHAAR") {
                            setDirectorAadhar(doc);
                        }
                        if (doc.fileType === "DIRECTOR_PAN") {
                            setDirectorPan(doc);
                        }
                        if (doc.fileType === "DIRECTOR_SELFIE") {
                            setDirectorSelfie(doc);
                        }

                    });
                });


            }
        } catch (error) {

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
        const director = directors[directorNumber];
        const isOpen = openDirector === directorNumber;


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
                                                value={directorData.directorName}
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
                                                value={directorData.directorDesignation}
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

                                                value={directorData.directorPanNo}
                                                className="w-full h-10 pl-9 pr-3 text-xs text-gray-500 border border-gray-200 rounded-lg outline-none focus:border-[#1677c8] focus:ring-1 focus:ring-[#1677c8] uppercase"
                                            />
                                        </div>
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
                                                value={directorData.directorAadharNo}

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
                                            <FileText className="w-4 h-4 ml-3 text-gray-300" />
                                            <span className="ml-2 text-xs text-gray-400 truncate">
                                                {directorSelfie.fileName}
                                            </span>

                                            {/* View Icon */}
                                            <button
                                                type="button"
                                                onClick={() => viewFile(apiData[item.file])}
                                                rel="noreferrer"                                                
                                                className="mr-2 p-1.5 rounded-md text-gray-400 hover:text-[#1677c8] hover:bg-blue-50 transition"
                                                title="View Photograph"
                                            >
                                                <Eye className="w-4 h-4 text-green-400" />
                                            </button>

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
                                            <span className="ml-2 text-xs text-gray-400 truncate">
                                                {directorPan.fileName}
                                            </span>
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
                                            <span className="ml-2 text-xs text-gray-400 truncate">
                                                {directorAadharCard.fileName}
                                            </span>
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


                {/* BACK & NEXT BUTTONS */}
                <div className="flex justify-between items-center gap-4 mt-10">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>



    );

};


