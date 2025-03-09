"use client";
import AdminHeader from "@widgets/Vendor/Dashboard/components/AdminHeader";
import AdminSidebar from "@widgets/Vendor/Dashboard/components/AdminSidebar";
import { useSession } from "next-auth/react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <div className="flex items-center flex-row w-screen">
      <AdminSidebar />
      <div className="flex flex-col w-full">
        <AdminHeader />
        <main className="min-h-[100vh] h-auto rounded-[5px] pt-[15vh] pl-[17vw] pr-[1vw] pb-[1vw] w-[99.5vw] flex dynamicBg">
          <div className="w-full h-[82vh] relative overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
