"use client";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

export default function Content() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const subdomain = Cookies.get("subdomain");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/v1/vendor/getUsers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subdomain }), // Change dynamically
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setUsers(data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  console.log(users);

  return (
    <div className="h-full flex justify-center py-4 text-gray-700">
      <div className="w-full flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Users</h1>
        </div>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="w-full h-full">
            {users?.length === 0 ? (
              <div className="w-full flex items-center justify-center h-full">
                There're no users yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 rounded-lg border bg-white dynamicBorder"
                  >
                    <div className="dynamicBgLight dynamicTextColor w-16 h-16 flex items-center justify-center rounded-md font-semibold text-lg">
                      <span className="uppercase">
                        {user?.firstName?.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4 flex flex-col gap-[6px]">
                      <h3 className="font-semibold">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
