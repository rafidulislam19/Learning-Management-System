import axios from "axios";

const BASE_URL = "https://sandbox.sslcommerz.com"; // Use "https://securepay.sslcommerz.com" for production

export const sslcommerzInit = async (paymentData: any) => {
  const url = `${BASE_URL}/gwprocess/v4/api.php`;
  
  try {
    const response = await axios.post(url, paymentData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("SSLCOMMERZ_INIT_ERROR:", error);
    throw new Error("Failed to initiate payment");
  }
};
