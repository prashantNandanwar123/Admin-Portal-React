import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { FaPlus, FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash, FaInfoCircle, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Reseller() {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [modalMode, setModalMode] = useState(null);

    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState("APPROVED");

    const navigate = useNavigate();
    // Search
    const filteredData = data.filter((item) => {
        const search = searchTerm.trim().toLowerCase();
        if (!search) return true;
        const valuesToCheck = [
            item.id,
            item.userId,
            item.requestId,
            item.companyCode,
            item.companyName,
            item.firstName,
            item.lastName,
            item.emailId,
            item.mobileNo,
            item.status,
            item.createdBy,
        ];
        return valuesToCheck.some((val) =>
            String(val).toLowerCase().includes(search)
        );
        console.log(valuesToCheck);
    });

    // ─── Table columns ───────────────────────────────────────────────────────────
    const TABLE_COLS = [
        "ID",
        "REQUESTED ID",
        "RESELLER ID",
        "COMPANY NAME",
        "FIRST NAME",
        "LAST NAME",
        "MOBILE NO",
        "CREATED AT",
        "STATUS",
        "ACTION",
    ];

    // Pagination Logic 
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const indexOfLast = currentPage * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;

    const currentData = filteredData.slice(indexOfFirst, indexOfLast);

    const [form, setForm] = useState({
        ID: "",
        UserId: "",
        companyName: "",
        companyCode: "",
        firstName: "",
        lastName: "",
        emailId: "",
        mobileNo: "",
        logo: "",
        CreateBy: "",
        status: ""
    });

    const [logo, setLogo] = useState(null);
    const closeModal = () => {
        setModalMode(null);
        setForm(EMPTY_FORM);
        setEditId(null);
    };

    useEffect(() => {
        fetchResellers(selectedStatus, 0);
    }, [selectedStatus, entriesPerPage]);


    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    const EMPTY_FORM = {
        ID: "",
        UserId: "",
        companyName: "",
        companyCode: "",
        firstName: "",
        lastName: "",
        emailId: "",
        mobileNo: "",
        logo: "",
        CreateBy: "",
        status: ""
    };

    // ─── Fetch List ─────────────────────────────────────────────────────────────
    const fetchResellers = async (status = selectedStatus, page = 0) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post(
                `/reseller/status/${status}?page=${page}&size=${entriesPerPage}`
            );

            console.log("RESELLER RESPONSE -->", response);

            if (response.respCode === 0) {
                setData(response.data || []);
            } else {
                setData([]);
                toast.error(response.respMsg);
            }
        } catch (error) {
            console.error("Reseller API Error:", error);
            setData([]);
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="h-full overflow-hidden flex flex-col p-4 md:p-6">
            {/* ── Header ── */}
            <div className="flex-shrink-0 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl uppercase pb-3 text-blue-900 font-extrabold">
                        Reseller
                    </h1>
                    <p className="pb-3 text-lg text-blue-900">
                        Securely manage reseller users with role-based access control, custom permissions, and controlled authorization settings.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/app/reseller-basic-details")}
                    className="bg-blue-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm shadow transition self-start md:self-auto"
                >
                    <FaPlus />
                    Add NEW RESELLER
                </button>
            </div>

            {/* ── Table ── */}
            <div
                className="min-h-0 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white"
                style={{ display: "flex", flexDirection: "column", height: "fit-content", maxHeight: "100%" }}
            >
                {/* ── ROW 1: Search bar ── */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 px-5 py-4 border-b border-slate-200 bg-white">
                    {/* APPROVED */}
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedStatus("APPROVED");
                            setCurrentPage(1);
                            setSearchTerm("");
                        }}
                        className={`px-5 py-2.5 rounded-lg font-semibold text-sm border transition
                             ${selectedStatus === "APPROVED"
                                ? "bg-green-600 text-white border-green-600 shadow-sm"
                                : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                            }`}
                    >
                        APPROVED
                    </button>

                    {/* PENDING */}
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedStatus("PENDING");
                            setCurrentPage(1);
                            setSearchTerm("");
                        }}
                        className={`px-5 py-2.5 rounded-lg font-semibold text-sm border transition
                        ${selectedStatus === "PENDING"
                                ? "bg-yellow-500 text-white border-yellow-500 shadow-sm"
                                : "bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                            }`}
                    >
                        PENDING
                    </button>

                    {/* REJECTED */}
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedStatus("REJECTED");
                            setCurrentPage(1);
                            setSearchTerm("");
                        }}
                        className={`px-5 py-2.5 rounded-lg font-semibold text-sm border transition
                          ${selectedStatus === "REJECTED"
                                ? "bg-red-600 text-white border-red-600 shadow-sm"
                                : "bg-white text-red-700 border-red-300 hover:bg-red-50"
                            }`}
                    >
                        REJECTED
                    </button>

                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-600 font-medium">Show</span>
                        <select
                            value={entriesPerPage}
                            onChange={(e) => {
                                setEntriesPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-slate-600 font-medium">entries</span>
                    </div>

                    <div className="w-full flex justify-end mb-4">
                        <div className="relative w-80">
                            <FaSearch className="absolute top-4 left-3 text-slate-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search merchant..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);

                                }}
                                className="w-full border border-slate-300 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>

                {/* ── ROW 2 ── */}
                <div className="overflow-auto min-h-0">
                    <table className="min-w-[1400px] w-full text-xs whitespace-nowrap border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-orange-600 text-white">
                                {TABLE_COLS.map((col) => (
                                    <th key={col} className="px-3 py-3 text-left font-semibold tracking-wide">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={TABLE_COLS.length}
                                        className="text-center py-10 text-slate-500"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : currentData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={TABLE_COLS.length}
                                        className="text-center py-10 text-slate-500"
                                    >
                                        No {selectedStatus.toLowerCase()} reseller found.
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((item, index) => (
                                    <tr
                                        key={item.id || index}
                                        className="hover:bg-slate-50 transition"
                                    >

                                        {/* ID */}
                                        <td className="px-3 py-3">
                                            {index + 1}
                                        </td>

                                        {/* REQUESTED ID */}
                                        <td className="px-3 py-3">
                                            {item.requestId || "-"}
                                        </td>

                                        {/* RESELLER ID */}
                                        <td className="px-3 py-3">
                                            {item.resellerId || "-"}
                                        </td>

                                        {/* COMPANY NAME */}
                                        <td className="px-3 py-3">
                                            {item.companyName || "-"}
                                        </td>

                                        {/* FIRST NAME */}
                                        <td className="px-3 py-3">
                                            {item.firstName || "-"}
                                        </td>

                                        {/* LAST NAME */}
                                        <td className="px-3 py-3">
                                            {item.lastName || "-"}
                                        </td>

                                        {/* MOBILE NO */}
                                        <td className="px-3 py-3">
                                            {item.mobile || "-"}
                                        </td>

                                        {/* CREATED AT */}
                                        <td className="px-3 py-3">
                                            {item.createdAt || "-"}
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-3 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold border
                                                ${item.status === "APPROVED"
                                                        ? "bg-green-100 text-green-700 border-green-300"
                                                        : item.status === "PENDING"
                                                            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                                            : "bg-red-100 text-red-700 border-red-300"
                                                    }`}
                                            >
                                                {item.status || selectedStatus}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td className="px-3 py-3 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                {/* PENDING → ONLY INFO ICON */}
                                                {selectedStatus === "PENDING" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate("/app/reseller-edit-details", {
                                                                state: {
                                                                    id: item.id,
                                                                    requestId: item.requestId,
                                                                    resellerId: item.resellerId,
                                                                },
                                                            })
                                                        }
                                                        title="View Details"
                                                        className="w-8 h-8 flex items-center justify-center rounded-full  text-green-900 transition"
                                                    >
                                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 32 32" class="text-3xl text-green-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M 16 8 C 7.664063 8 1.25 15.34375 1.25 15.34375 L 0.65625 16 L 1.25 16.65625 C 1.25 16.65625 7.097656 23.324219 14.875 23.9375 C 15.246094 23.984375 15.617188 24 16 24 C 16.382813 24 16.753906 23.984375 17.125 23.9375 C 24.902344 23.324219 30.75 16.65625 30.75 16.65625 L 31.34375 16 L 30.75 15.34375 C 30.75 15.34375 24.335938 8 16 8 Z M 16 10 C 18.203125 10 20.234375 10.601563 22 11.40625 C 22.636719 12.460938 23 13.675781 23 15 C 23 18.613281 20.289063 21.582031 16.78125 21.96875 C 16.761719 21.972656 16.738281 21.964844 16.71875 21.96875 C 16.480469 21.980469 16.242188 22 16 22 C 15.734375 22 15.476563 21.984375 15.21875 21.96875 C 11.710938 21.582031 9 18.613281 9 15 C 9 13.695313 9.351563 12.480469 9.96875 11.4375 L 9.9375 11.4375 C 11.71875 10.617188 13.773438 10 16 10 Z M 16 12 C 14.34375 12 13 13.34375 13 15 C 13 16.65625 14.34375 18 16 18 C 17.65625 18 19 16.65625 19 15 C 19 13.34375 17.65625 12 16 12 Z M 7.25 12.9375 C 7.09375 13.609375 7 14.285156 7 15 C 7 16.753906 7.5 18.394531 8.375 19.78125 C 5.855469 18.324219 4.105469 16.585938 3.53125 16 C 4.011719 15.507813 5.351563 14.203125 7.25 12.9375 Z M 24.75 12.9375 C 26.648438 14.203125 27.988281 15.507813 28.46875 16 C 27.894531 16.585938 26.144531 18.324219 23.625 19.78125 C 24.5 18.394531 25 16.753906 25 15 C 25 14.285156 24.90625 13.601563 24.75 12.9375 Z"></path></svg>
                                                    </button>
                                                )}

                                                {/* REJECTED → ONLY VIEW */}
                                                {selectedStatus === "REJECTED" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate("/app/reseller-view-details", {
                                                                state: {
                                                                    id: item.id,
                                                                    requestId: item.requestId,
                                                                    resellerId: item.resellerId,
                                                                },
                                                            })
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium"
                                                    >
                                                        VIEW
                                                    </button>
                                                )}

                                                {/* APPROVED → VIEW + EDIT */}
                                                {selectedStatus === "APPROVED" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate("/app/reseller-view-details", {
                                                                    state: {
                                                                        id: item.id,
                                                                        requestId: item.requestId,
                                                                        resellerId: item.resellerId,
                                                                    },
                                                                })
                                                            }
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium"
                                                        >
                                                            VIEW
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate("/app/reseller-edit-details", {
                                                                    state: {
                                                                        id: item.id,
                                                                        requestId: item.requestId,
                                                                        resellerId: item.resellerId,
                                                                    },
                                                                })
                                                            }
                                                            className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-medium"
                                                        >
                                                            EDIT
                                                        </button>
                                                    </>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── ROW 3: Pagination ── */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3 px-5 py-3 border-t border-slate-200 bg-white">
                    <div className="text-sm text-slate-600">
                        Showing{" "}
                        <span className="font-semibold text-slate-800">
                            {filteredData.length === 0 ? 0 : indexOfFirst + 1}
                        </span>
                        {" "}to{" "}
                        <span className="font-semibold text-slate-800">
                            {Math.min(indexOfLast, filteredData.length)}
                        </span>
                        {" "}of{" "}
                        <span className="font-semibold text-slate-800">
                            {filteredData.length}
                        </span>
                        {" "}entries
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                : "bg-white hover:bg-blue-50 border-slate-300 text-slate-700"
                                }`}
                        >
                            Prev
                        </button>
                        {getPageNumbers().map((page, i) =>
                            page === "..." ? (
                                <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm select-none">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition border ${currentPage === page
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                        : "bg-white hover:bg-blue-50 border-slate-300 text-slate-700"
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        )}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                : "bg-white hover:bg-blue-50 border-slate-300 text-slate-700"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Add / Edit Modal ── */}
            {modalMode && (
                <ResellerModal
                    mode={modalMode}
                    form={form}
                    setForm={setForm}
                    logo={logo}
                    setLogo={setLogo}
                    onClose={closeModal}
                    fetchResellers={fetchResellers}
                />
            )}
        </div>
    )
}