import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SuperAdminLogin from "./SuperAdminLogin";

import SuperAdminDashboard from "./SuperAdminDashboard";
import SuperAdminPackages from "./SuperAdminPackages";
import SuperAdminLayout from "./SuperAdminLayout";
import SuperAdminMangement from "./SuperAdminMangement";
import SuperAdminPaymentHistory from "./SuperAdminPaymentHistory";
import SuperAdminRazorpaysettin from "./SuperAdminRazorpaysettin";
import SuperAdminDemoRequests from "./SuperAdminDemoRequests";
import SuperAdminWebsiteSettings from "./SuperAdminWebsiteSettings";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<SuperAdminLogin />} />

        <Route path="/" element={<SuperAdminLayout />}>
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="demo-requests" element={<SuperAdminDemoRequests />} />
          <Route path="admin-manage" element={<SuperAdminMangement />} />
          <Route path="packages" element={<SuperAdminPackages />} />
          <Route path="payment-history" element={<SuperAdminPaymentHistory />} />
          <Route path="razorpay-setting" element={<SuperAdminRazorpaysettin />} />
          <Route path="website-settings" element={<SuperAdminWebsiteSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;