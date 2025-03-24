import React from "react";

export default function Content() {
  const users = [
    { name: "Reshma Rajan", date: "15", event: "Birthday" },
    { name: "Anowshka Siv", date: "14", event: "Anniversary" },
    { name: "Martin Thilak", date: "07", event: "Birthday" },
    { name: "Gayathry", date: "02", event: "Birthday" },
    { name: "John Doe", date: "10", event: "Birthday" },
    { name: "Jane Smith", date: "22", event: "Anniversary" },
  ];
  return (
    <div className="min-h-screen flex justify-center py-4 text-gray-700 ">
      <div className="w-full flex flex-col gap-6">
        <div className="">
          <h1 className="text-2xl font-bold mb-1">Users</h1>
        </div>
        <div className="flex flex-row gap-[8px] items-center">
          <button className="px-[16px] py-[8px] dynamicBgDark text-white rounded-lg">
            All
          </button>
          <button className="px-[16px] py-[8px] bg-white rounded-lg">
            This Month
          </button>
          <button className="px-[16px] py-[8px] bg-white rounded-lg">
            Last Year this month
          </button>
        </div>
        <div className="mt-[10px]">
          <span className="font-semibold text-xl">January 2025</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center p-4 rounded-lg border bg-white dynamicBorder"
            >
              <div className="dynamicBgLight dynamicTextColor w-16 h-16 flex items-center justify-center rounded-md font-semibold text-lg">
                {user.name.charAt(0)}
              </div>
              <div className="ml-4 flex flex-col gap-[6px]">
                <h3 className="font-semibold ">{user.name}</h3>
                <div className="flex flex-row gap-[6px]">
                  <p className="text-gray-600 text-sm mt-1">
                    reshmarajan2000@gmail.com
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[10px]">
          <span className="font-semibold text-xl">Decemeber 2024</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center p-4 rounded-lg border bg-white dynamicBorder"
            >
              <div className="dynamicBgLight dynamicTextColor w-16 h-16 flex items-center justify-center rounded-md font-semibold text-lg">
                {user.name.charAt(0)}
              </div>
              <div className="ml-4 flex flex-col gap-[6px]">
                <h3 className="font-semibold ">{user.name}</h3>
                <div className="flex flex-row gap-[6px]">
                  <p className="text-gray-600 text-sm mt-1">
                    reshmarajan2000@gmail.com
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
