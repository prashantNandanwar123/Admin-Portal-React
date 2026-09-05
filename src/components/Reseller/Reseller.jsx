import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { FaPlus, FaEdit, FaEye, FaSearch} from "react-icons/fa";
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

            if (response.respCode === 0) {
                setData(response.data || []);
            } else {
                setData([]);
                toast.error(response.respMsg);
            }
        } catch (error) {
            setData([]);
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };


    return (

    <div className="h-screen hide-scrollbar overflow-y-auto flex flex-col p-4 md:p-6 hide-scrollbar">
        {/* ── Header ── */}
        <div className="flex-shrink-0 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-2xl font-semibold text-[#1A2233]">
                    Reseller Management
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                    Securely manage reseller users with role-based access control, custom permissions, and controlled authorization settings.
                </p>
            </div>
            <button
                onClick={() => navigate("/app/reseller-basic-details")}
                className="bg-amber-400 text-slate-900 px-4 py-2.5 rounded-lg flex items-center gap-2 font-normal text-sm shadow transition self-start md:self-auto"
            >
                <FaPlus className="w-3 h-3" />
                Add New Reseller
            </button>
        </div>

        {/* ── Table ── */}
        <div
            className="min-h-0 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white"
            style={{ display: "flex", flexDirection: "column", height: "fit-content", maxHeight: "100%" }}
        >
            {/* ── ROW 1: Status tabs + Search + Entries ── */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 px-5 py-4 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedStatus("APPROVED");
                            setCurrentPage(1);
                            setSearchTerm("");
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold text-xs border transition
                        ${selectedStatus === "APPROVED"
                                ? "bg-green-600 text-white border-green-600 shadow-sm"
                                : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                            }`}
                    >
                        APPROVED
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedStatus("PENDING");
                            setCurrentPage(1);
                            setSearchTerm("");
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold text-xs border transition
                        ${selectedStatus === "PENDING"
                                ? "bg-yellow-500 text-white border-yellow-500 shadow-sm"
                                : "bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                            }`}
                    >
                        PENDING
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedStatus("REJECTED");
                            setCurrentPage(1);
                            setSearchTerm("");
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold text-xs border transition
                        ${selectedStatus === "REJECTED"
                                ? "bg-red-600 text-white border-red-600 shadow-sm"
                                : "bg-white text-red-700 border-red-300 hover:bg-red-50"
                            }`}
                    >
                        REJECTED
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                    <div className="flex items-center gap-2 text-sm">
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

                    <div className="relative w-full lg:w-80">
                        <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search reseller by name, email, mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-slate-300 pl-10 pr-4 py-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* ── ROW 2: Table ── */}
            <div className="overflow-auto min-h-0">
                <table className="min-w-[1400px] w-full text-xs whitespace-nowrap border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-50 text-slate-800">
                            <th className="px-3 py-3 text-center font-semibold tracking-wide">ID</th>
                            <th className="px-3 py-3 text-center font-semibold tracking-wide">Reseller ID</th>
                            <th className="px-3 py-3 text-center font-semibold tracking-wide">Created Date</th>
                            <th className="px-3 py-3 text-center font-semibold tracking-wide">Company Name</th>
                            <th className="px-3 py-3 text-center font-semibold tracking-wide">Full Name</th>
                            <th className="px-3 py-3 text-center font-semibold tracking-wide">Mobile No</th>
                            <th className="px-3 py-3 text-center font-semibold tracking-wide">Created By</th>
                            <th className="px-3 py-3 text-center font-semibold tracking-wide">Status</th>
                            <th className="px-15 py-3 text-left font-semibold tracking-wide">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-center">
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10 text-slate-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : currentData.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10 text-slate-500">
                                    No {selectedStatus.toLowerCase()} reseller found.
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-slate-50 transition">
                                    <td className="px-3 py-3">{index + 1}</td>
                                    <td className="px-3 py-3">{item.resellerId || "-"}</td>
                                    <td className="px-3 py-3">{item.createdAt || "-"}</td>
                                    <td className="px-3 py-3">{item.companyName || "-"}</td>
                                    <td className="px-3 py-3">
                                        {(item.firstName || item.lastName)
                                            ? `${item.firstName || ""} ${item.lastName || ""}`.trim()
                                            : "-"}
                                    </td>
                                   
                                    <td className="px-3 py-3">{item.mobile || "-"}</td>
                                    <td className="px-3 py-3">{item.createdBy || "-"}</td>

                                    {/* STATUS */}
                                    <td className="px-3 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                                        ${item.status === "APPROVED"
                                                    ? "bg-green-50 text-green-600"
                                                    : item.status === "PENDING"
                                                        ? "bg-yellow-50 text-yellow-600"
                                                        : "bg-red-50 text-red-600"
                                                }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full
                                            ${item.status === "APPROVED"
                                                        ? "bg-green-500"
                                                        : item.status === "PENDING"
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    }`}
                                            />
                                            {item.status === "APPROVED" ? "Active" : (item.status || selectedStatus)}
                                        </span>
                                    </td>

                                    {/* ACTION */}
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-2">
                                            {selectedStatus === "PENDING" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate("/app/reseller-edit-details", {
                                                            state: { id: item.id, requestId: item.requestId, resellerId: item.resellerId },
                                                        })
                                                    }
                                                    title="View Details"
                                                    className="flex items-center gap-1 border border-blue-300 text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-50"
                                                >
                                                    <FaEye />
                                                    View
                                                </button>
                                            )}

                                            {(selectedStatus === "REJECTED" || selectedStatus === "APPROVED") && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate("/app/reseller-view-details", {
                                                            state: { id: item.id, requestId: item.requestId, resellerId: item.resellerId },
                                                        })
                                                    }
                                                    className="flex items-center gap-1 border border-blue-300 text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-50"
                                                >
                                                    <FaEye />
                                                    View
                                                </button>
                                            )}

                                            {selectedStatus === "APPROVED" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate("/app/reseller-approvedit-details", {
                                                            state: { id: item.id, requestId: item.requestId, resellerId: item.resellerId },
                                                        })
                                                    }
                                                    className="flex items-center gap-1 border border-blue-300 text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-50"
                                                >
                                                    <FaEdit />
                                                    Edit
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                title="More actions"
                                                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
                                            >
                                               
                                            </button>
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
                <div className="text-sm text-slate-500">
                    Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
                    {Math.min(indexOfLast, filteredData.length)} of {filteredData.length} entries
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "bg-white hover:bg-slate-50 border-slate-300 text-slate-700"
                            }`}
                    >
                        Previous
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
                                    ? "bg-amber-400 text-slate-900 border-amber-400 shadow-sm"
                                    : "bg-white hover:bg-slate-50 border-slate-300 text-slate-700"
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
                            : "bg-white hover:bg-slate-50 border-slate-300 text-slate-700"
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