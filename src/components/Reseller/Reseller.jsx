import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { FaPlus, FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Reseller() {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [modalMode, setModalMode] = useState(null);
    const [saving, setSaving] = useState(false);

    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showViewForm, setShowViewForm] = useState(false);

    const navigate = useNavigate();
    // Search
    const filteredData = data.filter((item) => {
        const search = searchTerm.trim().toLowerCase();
        if (!search) return true;
        const valuesToCheck = [
            item.id,
            item.userId,
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

    const handleViewClick = (refId) => {
        setSelectedMerchant(refId);
        setShowViewForm(true);
    };
    //  Open Form
    if (showViewForm) {
        return (
            <ResellerBasicDetails
                onBack={() => setShowViewForm(false)}  //  sahi state
            />
        );
    }

    // ─── Table columns ───────────────────────────────────────────────────────────
    const TABLE_COLS = [
        "ID",
        "USERID",
        "COMPANY CODE",
        "COMPANY NAME",
        "FIRST NAME",
        "LAST NAME",
        "EMAIL ID",
        "MOBILE NO",
        "CREATE BY",
        "STATUS",
        "ACTION",
    ];
    // Pagination Logic 
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const indexOfLast = currentPage * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;

    const currentData = filteredData.slice(indexOfFirst, indexOfLast);

    const [showModal, setShowModal] = useState(false);
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
        fetchResellers();
    }, []);

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
    const fetchResellers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post(
                "/reSeller?page=0&size=10"
            );
            console.log("RESPONSE -->", response)
            if (response?.respCode === 0) {
                setData(response.data || []);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error(error);
            toast.error(error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };


    // ───Status Api ─────────────────────────────────────────────────────────────
    const handleStatusChange = async (item) => {
        try {
            const payload = {
                userId: item.userId,
                status: item.status === "A" ? "D" : "A",
            };
            const response = await axiosInstance.post("/updateReStatus", payload);
            if (response?.respCode === 0) {
                toast.success(response?.respMsg);
                fetchResellers();
            } else {
                toast.error(response?.respMsg);
            }
        } catch (error) {
            console.error(error);
            toast.error(error);
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
                {/* ── ROW 1: Search bar — auto height ── */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 px-5 py-4 border-b border-slate-200 bg-white">
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

                {/* ── ROW 2: Table — 1fr, scroll jab overflow ── */}
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
                            {currentData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-slate-50 transition"
                                >
                                    <td className="px-3 py-3">{index + 1}</td>
                                    <td className="px-3 py-3">{item.userId}</td>
                                    <td className="px-3 py-3">{item.companyCode}</td>
                                    <td className="px-3 py-3">{item.companyName}</td>
                                    <td className="px-3 py-3">{item.firstName}</td>
                                    <td className="px-3 py-3">{item.lastName}</td>
                                    <td className="px-3 py-3">{item.emailId}</td>
                                    <td className="px-3 py-3">{item.mobileNo}</td>

                                    <td className="px-3 py-3">{item.createdBy}</td>
                                    <td className="px-3 py-3">
                                        <button
                                            onClick={() => handleStatusChange(item)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border transition ${item.status === "A"
                                                ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                                                : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                                                }`}
                                        >
                                            {item.status === "A" ? "A" : "D"}
                                        </button>
                                    </td>

                                    {/* Action */}
                                    < td className="px-3 py-3 text-center" >
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => navigate("/app/reseller-view-details", {
                                                    state: {
                                                        userId: item.userId,
                                                    },
                                                })
                                                }
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                VIEW
                                            </button>
                                            <button
                                                onClick={() => navigate("/app/reseller-edit-details", {
                                                    state: {
                                                        userId: item.userId,
                                                    },
                                                })}
                                                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-xs">
                                                EDIT
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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