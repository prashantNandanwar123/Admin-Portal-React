import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { FaPlus, FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

// ─── Modal ────────────────────────────────────────────────────────────────────
function ResellerModal({
    mode,
    form,
    setForm,
    logo,
    setLogo,
    onClose,
    onSave,
    fetchResellers,
}) {
    const isEdit = mode === "edit";

    // ─── Handle Save Api ─────────────────────────────────────────────────────────────
    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("logo", logo);
            formData.append(
                "reseller",
                new Blob(
                    [
                        JSON.stringify({
                            firstName: form.firstName,
                            lastName: form.lastName,
                            companyName: form.companyName,
                            companyCode: form.companyCode,
                            mobileNo: form.mobileNo,
                            emailId: form.emailId,
                        }),
                    ],
                    {
                        type: "application/json",
                    }
                )
            );

            const response = await axiosInstance.post(
                "/saveResellerDetails/superadmin",
                formData
            );

            console.log("save response", response);

            if (response?.respCode === 0) {
                toast.success(response.respMsg);
                onClose();
                fetchResellers();
            } else {
                toast.error(response?.respMsg);
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    return (
        <div className="fixed inset-0  flex justify-center items-center z-50 px-4">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl  border border-gray-100 p-8 animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-5">
                    <h2 className="text-3xl font-bold text-orange-800 uppercase">
                        Add New Reseller
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                    {/* Company Name */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Company Name
                        </label>

                        <input
                            type="text"
                            name="companyName"
                            value={form.companyName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    companyName: e.target.value
                                })
                            }
                            placeholder="Enter Company Name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    {/* Company Code */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Company Code
                        </label>

                        <input
                            type="text"
                            name="companyCode"
                            value={form.companyCode}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    companyCode: e.target.value
                                })
                            }
                            placeholder="Enter Company Code"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            First Name
                        </label>

                        <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    firstName: e.target.value
                                })
                            }
                            placeholder="Enter First Name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    lastName: e.target.value
                                })
                            }
                            placeholder="Enter Last Name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Email ID
                        </label>

                        <input
                            type="email"
                            name="emailId"
                            value={form.emailId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    emailId: e.target.value
                                })
                            }
                            placeholder="Enter Email Address"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Mobile Number
                        </label>

                        <input
                            type="text"
                            name="mobileNo"
                            value={form.mobileNo}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    mobileNo: e.target.value
                                })
                            }
                            placeholder="Enter Mobile Number"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    {/* Upload Logo */}
                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Upload Company Logo
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setLogo(e.target.files[0])}
                            className="
                        w-full
                        p-3
                        rounded-xl
                        border-2
                        border-dashed
                        border-blue-300
                        bg-blue-50
                        cursor-pointer
                        hover:bg-blue-100
                        transition-all
                    "
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 mt-10">

                    <button
                        onClick={onClose}
                        className="
                    px-6 py-3
                    rounded-xl
                    bg-gray-100
                    text-gray-700
                    font-semibold
                    hover:bg-gray-200
                    transition-all
                "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="
                    px-8 py-3
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    text-white
                    font-semibold
                    shadow-lg
                    hover:shadow-xl
                    hover:scale-105
                    transition-all
                    duration-200
                "
                    >
                        Save
                    </button>

                </div>
            </div>
        </div>
    )
}

// ─── Open Add Modal ──────────────────────────────────────────────────────────
const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setModalMode("add");
    fetchUserNameList();
};

const handleFormChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
};


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
    "LOGO",
    "CREATE BY",
    "STATUS"
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Reseller() {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [modalMode, setModalMode] = useState(null);
    const [saving, setSaving] = useState(false);

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

    useEffect(() => {
        fetchResellers();
    }, []);


    // ─── Fetch List ─────────────────────────────────────────────────────────────
    const fetchResellers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post(
                "/reSeller?page=0&size=10"
            );

            if (response?.respCode === 0) {
                console.log("fetch Resellers::--->>>", response);
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

    return (
        <div className="min-h-screen p-4 md:p-6">
            {/* ── Header ── */}
            <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl uppercase pb-3 text-blue-900 font-extrabold">
                        Reseller
                    </h1>
                    <p className="pb-3 text-lg text-blue-900">
                        Create and manage user roles with customized permissions, access controls, and authorization settings securely.
                    </p>
                </div>
                <button
                    onClick={() => setModalMode(true)}
                    className="bg-blue-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm shadow transition self-start md:self-auto"
                >
                    <FaPlus />
                    Add NEW RESELLER
                </button>
            </div>

            {/* ── Table ── */}
            <div>
                <div className="w-full flex justify-end mb-4">
                    <div className="relative w-80">
                        <FaSearch className="absolute top-4 left-3 text-slate-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search merchant..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="w-full border border-slate-300 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="w-full overflow-x-auto overflow-hidden">
                    <table className="min-w-[1200px] w-full text-xs break-words">
                        <thead>
                            <tr className="bg-orange-600 text-white">
                                {TABLE_COLS.map((col) => (
                                    <th key={col} className="px-3 py-3 text-left font-semibold tracking-wide">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.userId}</td>
                                    <td>{item.companyCode}</td>
                                    <td>{item.companyName}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.emailId}</td>
                                    <td>{item.mobileNo}</td>                                    
                                    <td>
                                        <img
                                            src={item.logo}
                                            alt=""
                                            className="h-10 w-10"
                                        />
                                    </td>
                                    <td>{item.createdBy}</td>
                                    <td>{item.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {data.length > 0 && (
                    <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
                        Total <span className="font-bold text-blue-700">{data.length}</span> user(s) loaded
                    </div>
                )}
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