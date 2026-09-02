import { Routes, Route, Navigate } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense } from "react";

/* Layout */
import Layout from "./components/Layout";
import RiskApproval from "./components/RiskApproval/RiskApproval";
import MerchantsViewedit from "./components/MerchantViewEdit/MerchantsViewedit";
import Reseller from "./components/Reseller/Reseller";
import ResellerBasicDetails from "./components/Reseller/ResellerBasicDetails";
import ResellesViewDetails from "./components/Reseller/ResellesViewDetails";
import ResellesEditDetails from "./components/Reseller/ResellesEditDetails";
import ReditApprove from "./components/Reseller/ReditApprove";

/* Lazy Loaded Pages */
const Login = lazy(() => import("./pages/Login"));
const Forgot = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MerchantRegistration = lazy(() => import("./pages/MerchantRegistration"));
const MerchantCredential = lazy(() => import("./pages/MerchantCredential"));
const Reports = lazy(() => import("./pages/Reports"));
const MerchantWebhook = lazy(() => import("./pages/MerchantWebhook"));
const UpiPaymentProcessor = lazy(() => import("./pages/UpiPaymentProcessor"));
const User = lazy(() => import("./pages/User"));
const Role = lazy(() => import("./pages/Role"));
const Rseller = lazy(() => import("./components/Reseller/Reseller"));
const VirtualAccounts = lazy(() => import("./components/virtualAccounts/VirtualAccounts"));


/* Protected Route */
function ProtectedRoute({ children }) {
  const isLogin = localStorage.getItem("isLogin");
  if (!isLogin) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        transition={Slide}
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="ml-2 text-2xl font-bold text-gray-600 hover:text-black"
          >
            ×
          </button>
        )}
        toastClassName={(context) =>
          `relative flex p-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-white text-black shadow-none
          ${context?.type === "success"
            ? "border-green-500"
            : context?.type === "error"
              ? "border-red-500"
              : "border-blue-500"
          }`
        }
      />

      {/* Suspense Wrapper for Lazy Loading */}
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="register-merchant" element={<MerchantRegistration />} />
          <Route path="risk-approval" element={<RiskApproval />} />
          <Route path="merchant-credential" element={<MerchantCredential />} />
          <Route path="merchants" element={<MerchantsViewedit />} />
          <Route path="merchant-webhook" element={<MerchantWebhook />} />
          <Route path="reports" element={<Reports />} />
          <Route path="upi-payment-processor" element={<UpiPaymentProcessor />} />
          <Route path="users" element={<User />} />
          <Route path="roles" element={<Role />} />
          <Route path="reseller" element={<Reseller />} />
          <Route path="reseller-basic-details" element={<ResellerBasicDetails />} />
          <Route path="reseller-view-details" element={<ResellesViewDetails />} />
          <Route path="reseller-edit-details" element={<ResellesEditDetails />} />
          <Route path="reseller-approvedit-details" element={<ReditApprove />} />

          <Route path="virtual-accounts" element={<VirtualAccounts />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* </Suspense> */}
    </>
  );
}

export default App;