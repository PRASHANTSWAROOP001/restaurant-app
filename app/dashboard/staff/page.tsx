import type React from "react";

import StaffOnboardingCard from "@/components/staff/StaffBoardingCard";
import { getAllStaff } from "@/app/action/staffOnboarding";
import StaffTable from "@/components/staff/StaffTable";

export default async function StaffDashboard() {

  const {data, totalPage} = await getAllStaff({page:1, limit:10, search:""})

  return (
    <main className="w-full h-screen px-5">
      <div className="py-10">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-600 mt-2">
          Add new team members and manage existing staff
        </p>
      </div>
      <StaffOnboardingCard></StaffOnboardingCard>
      <StaffTable  propdata={data || []} totalPage={totalPage||1}></StaffTable>
    </main>
  );
}
