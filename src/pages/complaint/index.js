import { Footer, NavBar } from "@/components/NavBar";
import { useState } from "react";
import { CustomButton, CardImage } from "@/components/CustomUi";
import axios from "axios"; // นำเข้า axios

export default function Complaint() {
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const complaintData = { issue, description };

    try {
      // ดึง JWT token จาก localStorage
      const token = localStorage.getItem("token");

      // หากไม่มี token ให้แสดงข้อความแจ้งเตือน
      if (!token) {
        window.alert("Please log in first!"); // เพิ่ม alert เมื่อไม่มี token
        return;
      }

      // ใช้ axios  เพื่อส่งข้อมูล complaint ไปยัง API โดยมี Authorization header
      const res = await axios.post("/api/complaint", complaintData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ส่ง token ใน Authorization header
        },
      });

      console.log("API Response:", res.data); // เพื่อตรวจสอบ response จาก API

      if (res.status === 201) {
        window.alert("Complaint submitted successfully!"); 
        setIssue("");       // ล้างค่าช่อง issue
        setDescription(""); // เพิ่ม alert เมื่อสำเร็จ
      } else {
        // ตรวจสอบค่า res.data ว่ามี error หรือไม่
        window.alert("Error: " + (res.data?.error || "Unexpected error")); // เพิ่ม alert เมื่อมี error
      }
    } catch (error) {
      window.alert("Error: " + (error.response?.data?.error || error.message)); // เพิ่ม alert เมื่อมีข้อผิดพลาด
    }
  };

  return (
    <>
      <NavBar />
      <div className="bg-utility-primary lg:flex-row lg:flex lg:items-center lg:justify-center gap-32 pt-10 min-h-screen lg:pb-48  ">
      <figure className="flex items-center justify-center  lg:px-12 lg:order-2  ">
          <CardImage className="h-[25rem] w-[15rem] lg:h-[40rem] lg:w-[25rem]">
            <img
              src="/images/login_page_man.jpg"
              alt="Man smiling while using laptop"
              className={`h-full w-full object-cover object-right grayscale`}
            />
          </CardImage>
        </figure>

        
        <div className="w-full max-w-md bg-white p-6 rounded-lg lg:order-1  ">
          {/* Header */}
          <h3 className="text-sm text-third-700 mb-1 uppercase font-medium">
            Complaint
          </h3>
          <h1 className="text-3xl font-bold text-second-500 leading-tight mb-6">
            If you have any trouble <br />
            Don't be afraid to tell us!
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Issue Field */}
            <div className="mb-4">
              <label
                htmlFor="issue"
                className="block text-gray-700 font-medium mb-2"
              >
                Issue
              </label>
              <input
                type="text"
                id="issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Please enter the subject of your issue"
                className="w-full px-3 py-2 border-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Description Field */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share more information about the issue"
                rows="5"
                className="w-full px-3 py-2 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <CustomButton 
              type="submit"
              buttonType="primary"
            >
              Submit
            </CustomButton>
          </form>
        </div>
        
      </div>
      <Footer />
    </>
  );
}
