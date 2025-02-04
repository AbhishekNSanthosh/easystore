import AdminHeader from "@widgets/Vendor/Dashboard/components/AdminHeader";
import AdminSidebar from "@widgets/Vendor/Dashboard/components/AdminSidebar";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
          <div className="flex items-center flex-row w-screen">
            <AdminSidebar />
            <div className="flex flex-col w-full">
              <AdminHeader />
              <main className="min-h-[100vh] h-auto rounded-[5px] pt-[15vh] pl-[19vw] pr-[1vw] pb-[1vw] w-[99.5vw] flex  bg-red-50 bg-opacity-45">
                <div className="w-full h-[82vh] relative overflow-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
  );
}
