import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

function PaymentPage({
  packages_id,
  name_package,
  price,
  description = "[]",
  stripe_price_id,
}) {
  const { state } = useAuth();
  const userId = state.user?.id;

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState(null);

  const router = useRouter();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!stripe || !elements) {
      setError("Stripe or Elements has not loaded yet.");
      setLoading(false);
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const amount = Math.round(price * 100); // คูณ 100 เพื่อแปลงเป็น integer

      const response = await axios.post(
        `${apiBaseUrl}/api/payment/create-payment-intent`,
        {
          user_id: userId,
          packages_id,
          amount, // Convert to smallest currency unit
          currency: "thb",
          stripe_price_id,
        },
      );

      //  const { clientSecret }  เป็นการดึงค่ามาจาก  response.data
      // ซึ่งภายใน response.data บรรจุค่า {clientSecret: 'pi_3QYNRNKtPXaR0mx21J??????_secret_????????'}
      // การประกาศ const { clientSecret } เป็นการเรียกใช้ค่าข้างในออกมาตรงๆโดยไม่เก็บผ่าน state เพื่อนำไปใช้ครั้งเดียวไม่ไปใช้ที่อื่นต่อ
      const { clientSecret } = response.data;
      if (!clientSecret) {
        throw new Error("Failed to retrieve client secret.");
      }
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        setError("Card elements have not loaded yet.");
        setLoading(false);
        return;
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: "Card Holder Name", // สามารถเพิ่ม input ชื่อได้
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === "succeeded") {
        // alert("Payment successful!");
        router.push({
          pathname: "/payment/success",
          query: {
            transactionId: paymentIntent.id,
            amount: price,
            name_package,
            price,
            description,
          },
        });
      } else {
        setError("Payment not completed. Try again.");
      }
    } catch (err) {
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  console.log("Data in description = ", description);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-utility-bgMain lg:flex lg:justify-center lg:pb-40 lg:pt-40"
      >
        {/* Package */}
        <div className="bg-fourth-400 lg:h-[318px] lg:w-[358px] lg:rounded-[24px]">
          <div className="containerpt pt-5">
            <div className="w-auto pl-5 pr-5">
              <div className="flex items-center justify-start gap-[12px]">
                <Image
                  src="/Frame.svg"
                  width={24}
                  height={24}
                  alt="packageList"
                />
                <h1 className="ml-2 text-[20px]">Merry Membership</h1>
              </div>
              <div className="h-auto w-auto pb-5 pt-5">
                <div className="flex justify-between">
                  <h1 className="text-[16px]">Package</h1>
                  <h1 className="text-[20px] font-bold">{name_package}</h1>
                </div>
                <div className="pt-3 lg:pt-8">
                  <div className="h-auto min-h-[76px] flex-col rounded-[8px] bg-white pl-2 pt-4">
                    {Array.isArray(parsedDescription) &&
                    parsedDescription.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {parsedDescription.map((detail, index) => (
                          <li className="text-[16px]" key={index}>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-[16px] text-gray-500">
                        No details available
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between pt-5 lg:pt-8">
                  <h1 className="text-[16px]">Price (Monthly)</h1>
                  <h1 className="text-[20px] font-bold">THB {price}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Package */}

        <div className="pt-5"></div>
        <div className="container lg:ml-80 lg:h-[554px] lg:w-[548px] lg:rounded-[24px] lg:border-[1px]">
          <div className="flex items-center justify-between gap-[12px] bg-fourth-400 p-8 lg:rounded-t-[24px]">
            <h1 className="text text-[20px] font-bold text-[#646C80]">
              Credit Card
            </h1>
            <Image
              src="/Frame 427320879.svg"
              width={100}
              height={28}
              alt="Credit-Card"
            />
          </div>

          {/* Stripe Card Element */}
          <div className="container p-8">
            {/*  Card Number */}
            <label className="mb-4 block">
              <span className="block text-[18px] font-medium text-gray-700">
                Card number <span className="text-red-500">*</span>
              </span>
              <CardNumberElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      fontFamily: "Arial, sans-serif",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#fa755a",
                    },
                  },
                }}
                className="mt-2 rounded-md border border-gray-300 p-2"
              />
            </label>

            {/*  Card owner  */}
            <label className="block">
              <span className="block text-[18px] font-medium text-gray-700">
                Card owner <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                placeholder="Holder of card"
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
              />
            </label>

            {/*  Expiry date  */}
            <div className="flex gap-4">
              <label className="block w-1/2">
                <span className="block text-[18px] font-medium text-gray-700">
                  Expiry date <span className="text-red-500">*</span>
                </span>
                <CardExpiryElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#32325d",
                        fontFamily: "Arial, sans-serif",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#fa755a",
                      },
                    },
                  }}
                  className="mt-2 rounded-md border border-gray-300 p-2"
                />
              </label>
              {/*  {/*  Expiry date  */}
              <label className="block w-1/2">
                <span className="block text-[18px] font-medium text-gray-700">
                  CVC/CVV <span className="text-red-500">*</span>
                </span>
                <CardCvcElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#32325d",
                        fontFamily: "Arial, sans-serif",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#fa755a",
                      },
                    },
                  }}
                  className="mt-2 rounded-md border border-gray-300 p-2"
                />
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="container flex justify-between bg-white pb-20 pt-5 lg:rounded-b-[24px] lg:pb-4">
            <button
              type="button"
              className="mx-auto h-auto w-auto rounded-[99px] text-[16px] text-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !stripe || !elements}
              className="mx-auto h-[48px] w-[177px] rounded-[99px] bg-primary-500 text-[16px] text-white"
            >
              {loading ? "Processing..." : "Payment Confirm"}
            </button>
          </div>

          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        </div>
      </form>
    </>
  );
}

export default function PaymentContainer(props) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentPage {...props} />
    </Elements>
  );
}
