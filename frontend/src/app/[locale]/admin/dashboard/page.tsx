"use client";

import { Button } from "@/components";
import { api } from "@/lib/axios";

const AdminDashboard = () => {
  const changeRoleAndRefresh = async () => {
    try {
      // 1️⃣ ვცვლით როლს (backend-ზე tokenVersion++)
      await api.patch("/users/1/role", {
        role: "USER",
      });

      // 2️⃣ ვაიძულებთ auth check-ს
      await api.get("/auth/me");

      // თუ აქამდე მოვიდა → ჯერ კიდევ ვალიდურია (არ უნდა მოხდეს)
      alert("Still logged in");
    } catch (err: any) {
      if (err.response?.status === 401) {
        // 3️⃣ აქ უკვე token მკვდარია
        window.location.href = "/auth/login";
        alert("User is logged out (401)");
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>

      <Button
        className="cursor-pointer border-2"
        onClick={changeRoleAndRefresh}
      >
        Change my role (admin → user) & Refresh Auth
      </Button>
    </div>
  );
};

export default AdminDashboard;
