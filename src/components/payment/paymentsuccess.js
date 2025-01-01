import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

function PaymentSuccess({ name_package, price, description }) {
  const router = useRouter();
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  // ดึง userId จาก state ใน context ที่ได้มาจากการรับค่าของ Token ตอน login เข้ามาและเก็บเข้าไปใน state ในหน้า context
  // ทำการดึงมาใช้โดยผ่าน useAuth และทำการเข้าถึง state
  const { state } = useAuth();
  const userId = state.user?.id;

  // แปลง description เป็น Array ก่อน
  let parsedDescription = [];
  try {
    if (typeof description === "string" && description.trim() !== "") {
      parsedDescription = JSON.parse(description); // แปลง JSON string เป็น Array
    } else {
      console.warn("Description is not a valid JSON string:", description);
    }
  } catch (error) {
    console.error("Failed to parse description:", error);
    parsedDescription = []; // กำหนดค่าเริ่มต้นเป็น array ว่างหากเกิดข้อผิดพลาด
  }

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await axios.get(`/api/payment/subscription-detail`, {
          params: { user_id: userId },
        });

        if (response.data) {
          setSubscriptionDetails(response.data);
        } else {
          console.warn("Response is empty or invalid:", response);
        }
      } catch (error) {
        console.error("Error fetching subscription details:", error);
        setErrorMessage(
          "Failed to load subscription details. Please try again.",
        );
      }
    };
    if (userId) {
      fetchSubscriptionDetails();
    }
  }, [userId]);

  return (
    <>
      <div className="container flex flex-col items-center justify-center">
        {/* Header */}
        <div className="container lg:ml-[450px]">
          <div className="container flex flex-col items-center justify-center gap-4 pt-5 lg:h-[393px] lg:w-[541px]">
            <div className="ml-5">
              <Image src="/success.svg" alt="Success" width={80} height={80} />
              <h2 className="text-[14px] text-third-700">PAYMENT SUCCESS</h2>
              <h1 className="justify-center text-[35px] font-bold leading-[40px] tracking-[-1%] text-second-500">
                Welcom Merry Membership! Thank you for joining us
              </h1>
            </div>
          </div>

          {/* Package Card */}
          <div className="container lg:ml-96 lg:mt-[-350px] lg:w-auto">
            <div className="container flex justify-center pt-5">
              <div className="h-auto min-h-[382px] w-auto min-w-[220px] justify-center rounded-[24px] border-[1px] bg-bg-card p-[16px]">
                <div className="h-[60px] w-[60px]">
                  <img src="/icon.svg" />
                </div>
                <div className="gap-7 pt-3">
                  <h1 className="text-[32px] text-white">{name_package}</h1>
                  <div className="flex">
                    <h2 className="text-[20px] text-second-100">THB {price}</h2>
                    <h3 className="text-[20px] text-second-100">/Month</h3>
                  </div>
                </div>

                {/* Detail PackageCard */}
                <div className="border-b border-b-white">
                  <div className="grid gap-4">
                    <div className="space-y-4 pb-10 pt-5">
                      {Array.isArray(parsedDescription) &&
                      parsedDescription.length > 0 ? (
                        parsedDescription.map((item, index) => (
                          <div className="flex items-center gap-3" key={index}>
                            <Image
                              src="/checkbox-circle-fill.svg"
                              alt="checkbox-circle-fill.svg"
                              width={24}
                              height={24}
                            />
                            <h1 className="text-second-100">{item}</h1>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-3">
                          <h1 className="text-gray-400 text-second-100">
                            No details available
                          </h1>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* footer PackageCard */}
                <div>
                  <div className="flex w-full justify-between pt-5">
                    <h1 className="text-second-200">Start Membership</h1>
                    <h1 className="text-white">
                      {subscriptionDetails?.subscription_start_date
                        ? new Date(
                            subscriptionDetails.subscription_start_date,
                          ).toLocaleDateString("en-GB")
                        : "N/A"}
                    </h1>
                  </div>
                  <div className="flex w-full justify-between pt-5">
                    <h1 className="text-second-200">Next billing</h1>
                    <h1 className="text-white">
                      {subscriptionDetails?.subscription_end_date
                        ? new Date(
                            subscriptionDetails.subscription_end_date,
                          ).toLocaleDateString("en-GB")
                        : "N/A"}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div></div>
          <div></div>

          <div className="lg:mr- container flex justify-center gap-2 pb-10 pt-10 lg:mt-[-150px] lg:w-[364px] lg:items-center lg:pb-40 lg:pt-10">
            <button
              className="h-auto w-auto gap-[8px] rounded-[99px] bg-red-100 pb-[12px] pl-[24px] pr-[24px] pt-[12px] text-red-600"
              onClick={() => router.push("/")}
            >
              Back to home
            </button>
            <button
              className="h-auto w-auto gap-[8px] rounded-[99px] bg-red-500 pb-[12px] pl-[24px] pr-[24px] pt-[12px] text-utility-primary"
              onClick={() => router.push("/payment/membership")}
            >
              Check Membership
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
