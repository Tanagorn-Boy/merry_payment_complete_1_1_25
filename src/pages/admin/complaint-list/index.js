import { AdminSideBar } from "@/components/admin/AdminSideBar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAdminAuth } from "@/contexts/AdminAuthContext"; // Import Context
import { jwtDecode } from "jwt-decode";

function ComplaintList() {
  const router = useRouter();
  //const { isAuthenticated, logout } = useAdminAuth();

  // ข้อมูลตัวอย่าง
  const [data] = useState([
    {
      id: 1,
      user: "john Snow",
      issue: "I was insulted by Ygritte",
      description: "Hello, there was a ploblem with user 'Ygritte'",
      date: "11/02/2022",
      status: "New",
    },
    {
      id: 2,
      user: "john Snow2",
      issue: "I was insulted by Ygritte 2",
      description: "Hello, there was a ploblem with user 'Ygritte' 2",
      date: "12/02/2022",
      status: "Pending",
    },
    {
      id: 3,
      user: "john Snow3",
      issue: "I was insulted by Ygritte 2",
      description: "Hello, there was a ploblem with user 'Ygritte' 3",
      date: "13/02/2022",
      status: "Resolved",
    },
    {
      id: 4,
      user: "john Snow4",
      issue: "I was insulted by Ygritte 2",
      description: "Hello, there was a ploblem with user 'Ygritte' 4",
      date: "14/02/2022",
      status: "cancel",
    },
    {
      id: 5,
      user: "Apple",
      issue: "I was insulted by Ygritte 2",
      description: "fruit ",
      date: "14/02/2022",
      status: "cancel",
    },
    {
      id: 6,
      user: "Banana",
      issue: "I was insulted by Ygritte 2",
      description: "yellow",
      date: "14/02/2022",
      status: "cancel",
    },
  ]);

  // State สำหรับจัดการสถานะและการค้นหา
  const [searchQuery, setSearchQuery] = useState(""); // for Search
  const [selectedStatus, setSelectedStatus] = useState("all"); // for Dropdown

  // ฟังก์ชันสำหรับกรองข้อมูลตามสถานะและข้อความค้นหา
  const filteredData = data.filter(
    (item) =>
      (selectedStatus === "all" ||
        item.status.toLowerCase() === selectedStatus.toLowerCase()) &&
      (item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issue.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  {
    /* filter เฉพาะ Description
  // ฟังก์ชันสำหรับกรองข้อมูลตามสถานะและข้อความค้นหา
  const filteredData = data.filter(
    (item) =>
      (selectedStatus === "all" ||
        item.status.toLowerCase() === selectedStatus.toLowerCase()) &&
      item.description.toLowerCase().includes(searchQuery.toLowerCase()), // .toLowerCase() แปลงข้อความให้เป็นตัวพิมพ์เล็กทั้งหมดเพื่อให้การค้นหาไม่สนใจการใช้ตัวพิมพ์ใหญ่หรือตัวพิมพ์เล็ก (case-insensitive).
  );
  */
  }

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงใน Search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // อัปเดตคำค้นหาใน state
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงสถานะใน Dropdown
  const handleStatusChange = (selectedValue) => {
    setSelectedStatus(selectedValue); // อัปเดตสถานะที่เลือกใน state
  };

  // ฟังก์ชันสำหรับเพิ่ม className ของสถานะ
  const getStatusClassName = (status) => {
    switch (status) {
      case "New":
        return "bg-pink-100 text-pink-500 px-3 py-1 rounded-full";
      case "Pending":
        return "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full";
      case "Resolved":
        return "bg-green-100 text-green-600 px-3 py-1 rounded-full";
      case "Cancel":
        return "bg-gray-100 text-gray-500 px-3 py-1 rounded-full";
      default:
        return "bg-gray-100 text-gray-500 px-3 py-1 rounded-full";
    }
  };

  /* 
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);
  */
  // Verify authentication
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/admin/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decodedToken.exp < now) {
          logout(); // Token expired, redirect to login
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        logout(); // Invalid token, redirect to login
      }
    }
  }, [router]);

  return (
    <div className="flex">
      <AdminSideBar />
      <main className="flex-1">
        <AdminHeader
          title="Complaint list"
          searchPlaceholder="Search..."
          onSearchChange={handleSearchChange} // ใช้ฟังก์ชันจัดการ Search
          buttons={[
            {
              type: "dropdown",
              options: [
                { value: "all", label: "All Status" },
                { value: "new", label: "New" },
                { value: "pending", label: "Pending" },
                { value: "resolved", label: "Resolved" },
                { value: "Cancel", label: "Cancel" },
              ],
              onChange: (e) => handleStatusChange(e.target.value), // ใช้ฟังก์ชันจัดการ Dropdown
            },
          ]}
        />

        {/* Table */}
        <div className="overflow-x-auto px-12 py-4">
          <table className="min-w-full rounded-lg bg-white shadow-md">
            <thead className="bg-fourth-400">
              <tr>
                <th className="rounded-tl-lg px-6 py-3 text-sm font-medium leading-5 text-fourth-800">
                  User
                </th>
                <th className="px-6 py-3 text-sm font-medium leading-5 text-fourth-800">
                  Issue
                </th>
                <th className="px-6 py-3 text-sm font-medium leading-5 text-fourth-800">
                  Description
                </th>
                <th className="px-6 py-3 text-sm font-medium leading-5 text-fourth-800">
                  Date Submitted
                </th>
                <th className="rounded-tr-lg px-6 py-3 text-sm font-medium leading-5 text-fourth-800">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="text-center">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{item.user}</td>
                    <td className="px-6 py-4"> {item.issue} </td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4">
                      <span className={getStatusClassName(item.status)}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="border border-gray-200 px-4 py-2 text-center"
                  >
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ComplaintList;
