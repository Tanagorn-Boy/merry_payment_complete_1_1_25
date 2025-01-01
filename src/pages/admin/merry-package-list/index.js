// src/pages/admin/merrypackagelist/index.js

import AdminHeader from "@/components/admin/AdminHeader";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { AdminSideBar } from "@/components/admin/AdminSideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import { jwtDecode } from "jwt-decode";

function MerryPackageList() {
  const [packages, setPackages] = useState([]);
  const router = useRouter(); // เรียกใช้ useRouter
  const [searchQuery, setSearchQuery] = useState(""); // for Search
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailToDelete, setDetailToDelete] = useState(null); // state สำหรับ delete โดยเก็บค่า id ของแถวนั้นๆ
  const [loading, setLoading] = useState(true); // State for loading

  // ฟังก์ชันดึงข้อมูล package
  const fetchPackages = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      setLoading(true);
      const res = await axios.get(`${apiBaseUrl}/api/admin/packages`);
      setPackages(res.data); // เก็บข้อมูลใน state
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function in case token is invalid
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงใน Search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // อัปเดตคำค้นหาใน state
  };

  // Filter packages based on search query
  const filteredPackages = packages.filter(
    (pkg) => pkg.name_package.toLowerCase().includes(searchQuery.toLowerCase()), // กรองชื่อแพ็กเกจตาม searchQuery
  );

  // ฟังก์ชันสำหรับลบ package  old
  const deletePackage = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        // ลบข้อมูลจาก database ผ่าน API
        await axios.delete("/api/admin/packages", { data: { id } });

        // อัปเดต state ให้ลบรายการที่ถูกลบออก
        //setPackages(packages.filter((pkg) => pkg.id_package !== id));
        fetchPackages();

        alert("Package deleted successfully!");
      } catch (error) {
        console.error("Error deleting package:", error);
        alert("Failed to delete package.");
      }
    }
  };

  // deleteDetail Step2:
  // เรียกใช้ state: setDetailToDelete  เพื่อเก็บค่า id ของแถวนั้นๆที่จะทำการลบ detail
  // เรียก setIsModalOpen จากเดิมเป็น false > true เพื่อเปิดการใช้งาน DeleteConfirmationModal จากการเรียกใช้ props ใน DeleteConfirmationModal.JS
  const confirmDelete = (id) => {
    setDetailToDelete(id);
    setIsModalOpen(true);
  };

  //deleteDetail Step6: ใช้ filter เพื่อลบ detail ที่มี id ตรงกับ detailToDelete
  // ตั้งค่า isModalOpen เป็น false เพื่อปิด Modal.
  // รีเซ็ต detailToDelete เป็น null

  // แก้ไขฟังก์ชัน handleDelete ให้ลบข้อมูลจากฐานข้อมูล
  const handleDelete = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      // เรียก API เพื่อลบข้อมูลในฐานข้อมูล
      await axios.delete(`${apiBaseUrl}/api/admin/packages/${detailToDelete}`);
      //, {data: { id: detailToDelete },}
      // อัปเดตรายการ package หลังลบสำเร็จ
      setPackages(packages.filter((pkg) => pkg.package_id !== detailToDelete));

      //setDetails(details.filter((detail) => detail.id !== detailToDelete));
      // ปิด Modal
      setIsModalOpen(false);
      setDetailToDelete(null);
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Failed to delete package.");
    }
  };

  // deleteDetail Step3.3: เรียกใช้ setIsModalOpen เพื่อ false ปิดหน้า Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setDetailToDelete(null);
  };

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
        } else {
          fetchPackages(); // Fetch package data
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        logout(); // Invalid token, redirect to login
      }
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSideBar logout={logout} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}

        <AdminHeader
          title="Merry Package"
          searchPlaceholder="Search..."
          onSearchChange={handleSearchChange} // ใช้ฟังก์ชันจัดการ Search
          buttons={[
            {
              label: "+ Add Package",
              type: "third",
              onClick: () => router.push("/admin/merry-package-add"),
            },
          ]}
        />

        {/* Table */}
        <div className="overflow-x-auto px-12 py-4">
          <table className="min-w-full rounded-lg bg-white shadow-md">
            <thead className="bg-fourth-400">
              <tr>
                <th className="rounded-tl-lg px-6 py-3 text-center font-medium text-gray-600"></th>
                <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800"></th>
                <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800">
                  Icon
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800">
                  Package Name
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800">
                  Merry Limit
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800">
                  Created Date
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800">
                  Updated Date
                </th>
                <th className="rounded-tr-lg px-6 py-3 text-center font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.map((pkg, index) => (
                <tr
                  key={pkg.package_id}
                  className="border-t text-center align-middle hover:bg-gray-50"
                >
                  <td className="px-6 py-4 align-middle">
                    <span className="cursor-move">⋮⋮</span>
                  </td>
                  <td className="px-6 py-4 align-middle">{index + 1}</td>
                  <td className="px-6 py-4 align-middle">
                    {pkg.icon_url ? (
                      <img
                        src={pkg.icon_url}
                        alt="Package Icon"
                        className="mx-auto h-8 w-8 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 align-middle">{pkg.name_package}</td>
                  <td className="px-6 py-4 align-middle">{pkg.limit_match}</td>
                  <td className="px-6 py-4 align-middle">
                    {new Date(pkg.created_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 align-middle">
                    {pkg.updated_date
                      ? new Date(pkg.updated_date).toLocaleString()
                      : "Not updated"}
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center justify-center gap-4">
                      <FaTrashAlt
                        className="cursor-pointer text-2xl text-primary-300"
                        onClick={() => confirmDelete(pkg.package_id)}
                      />
                      <FaEdit
                        className="cursor-pointer text-2xl text-primary-300"
                        onClick={() =>
                          router.push(
                            `/admin/merry-package-list/${pkg.package_id}`,
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Delete Confirm Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen} // isModalOpen = true เปิดใช้งาน
        onClose={closeModal} // deleteDetail Step3.2: เรียกใช้ function closeModal เพื่อยกเลิก
        onConfirm={handleDelete} // ลบรายการโดยกดยืนยัน deleteDetail Step5: เรียกใข้ function: handleDelete
        title="Delete Confirmation"
        message="Are you sure you want to delete this detail?"
        confirmLabel="Yes, I want to deleteeee"
        cancelLabel="No, I don't want"
      />
    </div>
  );
}

export default MerryPackageList;
