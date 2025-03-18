// import axios from 'axios';
// import { db } from "@/lib/db";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// // import { generateClerkSessionToken } from '@/lib/clerk';

// export async function POST(
//     req: Request,
//     { params }: { params: Promise<{ courseId: string }>}
// ) {

//   try {
//     const user = await currentUser();

//     if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
//         return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const resolvedParams = await params;

//     const course = await db.course.findUnique({
//         where: {
//             id: resolvedParams.courseId,
//             isPublished: true,
//         }
//     });

//     const purchase = await db.purchase.findUnique({
//         where: {
//             userId_courseId: {
//                 userId: user.id,
//                 courseId: resolvedParams.courseId
//             }
//         }
//     });

//     if(purchase) {
//         return new NextResponse("Already Purchased", { status: 400 });
//     }

//     if(!course) {
//         return new NextResponse("Course not found", { status: 404 });
//         }

//         // // Generate a Clerk session token
//         // const sessionToken = await generateClerkSessionToken(user.id);
//         // if (!sessionToken) {
//         //     return new Response("Failed to generate session token", { status: 500 });
//         // }

//         const transactionId = `txn_${Date.now()}`;

//         const successUrl = encodeURIComponent(
//             `/courses/${course.id}/checkout/success?transactionId=${transactionId}&courseId=${course.id}`
//         );

//         const failUrl = encodeURIComponent(
//             `/courses/${course.id}/checkout/fail?transactionId=${transactionId}&courseId=${course.id}`
//         );

//         const cancelUrl = encodeURIComponent(
//             `/courses/${course.id}/checkout/cancel?transactionId=${transactionId}&courseId=${course.id}`
//         );

//         const paymentData = new URLSearchParams({
//             store_id: process.env.NEXT_PUBLIC_SSL_COMMERZ_STORE_ID || '',
//             store_passwd: process.env.NEXT_PUBLIC_SSL_COMMERZ_STORE_PASSWORD || '',
//             total_amount: course.price.toString(),
//             currency: 'BDT',
//             tran_id: `txn_${Date.now()}`,
//             success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-redirect?redirectTo=${successUrl}`,
//             fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-redirect?redirectTo=${failUrl}`,
//             cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-redirect?redirectTo=${cancelUrl}`,
//             ipn_url:`${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`,
//             emi_option: '0',
//             cus_name: user.username || "Customer Name",
//             cus_email: user.emailAddresses[0].emailAddress,
//             cus_add1: 'Dhaka',
//             cus_add2: 'Dhaka',
//             cus_city: 'Dhaka',
//             cus_state: 'Dhaka',
//             cus_postcode: '1000',
//             cus_country: 'Bangladesh',
//             cus_phone: '01716573924',
//             cus_fax: '01716573924',
//             shipping_method: 'NO',
//             product_name: 'Course Purchase',
//             product_category: 'Education',
//             product_profile: 'general',
//             multi_card_name: 'mastercard,visacard,amexcard',
//             value_a: user.id.toString(),
//             value_b: course.id.toString(),
//         });

//         // Debugging: Log the form data before sending
//         for (const [key, value] of paymentData.entries()) {
//             console.log(`${key}: ${value}`);
//         }

//         // Send the request to SSLCommerz
//         const response = await axios.post(
//             `${process.env.NEXT_PUBLIC_SSL_COMMERZ_URL}`,
//             paymentData.toString(),
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         );

//         console.log("Response Data:", response.data);

//     if (response.data.status === 'SUCCESS') {
//         return new Response(JSON.stringify({ url: response.data.GatewayPageURL }), { status: 200 });
//     } else {
//         return new Response("Payment initiation failed", { status: 400 });
//     }
// } catch (error) {
//     console.error("[COURSE_ID_CHECKOUT]", error);
//     return new Response("Internal Server Error", { status: 500 });
// }
// }


import axios from "axios";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import FormData from "form-data";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;

    const course = await db.course.findUnique({
      where: {
        id: resolvedParams.courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: resolvedParams.courseId,
        },
      },
    });
    

    if (purchase) {
      return new NextResponse("Already Purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const transactionId = `txn_${Date.now()}`;
    const amount = course.price || 0; 

     // Store transaction details in `PendingTransaction`
     await db.pendingTransaction.create({
      data: {
        transactionId,
        courseId: resolvedParams.courseId,
        userId: user.id,
        amount,
        currency: "BDT",
      },
    });

    const successUrl = encodeURIComponent(
      `/courses/${course.id}/checkout/success?transactionId=${transactionId}&courseId=${course.id}`
    );

    const failUrl = encodeURIComponent(
      `/courses/${course.id}/checkout/fail?transactionId=${transactionId}&courseId=${course.id}`
    );

    const cancelUrl = encodeURIComponent(
      `/courses/${course.id}/checkout/cancel?transactionId=${transactionId}&courseId=${course.id}`
    );

    // Prepare FormData for PayStation
    const paymentData = new FormData();
    paymentData.append("invoice_number", transactionId);
    paymentData.append("currency", "BDT");
    paymentData.append("payment_amount", course.price.toString());
    paymentData.append("reference", `${transactionId}-${course.id}`);
    paymentData.append("cust_name", user.username || "Customer Name");
    paymentData.append("cust_phone", "01716573924"); // Replace with actual user phone if available
    paymentData.append("cust_email", user.emailAddresses[0].emailAddress);
    paymentData.append("cust_address", "Dhaka, Bangladesh");
    paymentData.append(
      "callback_url",
      `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`
    ); // IPN (Webhook) URL
    paymentData.append("checkout_items", "Course Purchase");
    paymentData.append(
      "merchantId",
      process.env.NEXT_PUBLIC_PAYSTATION_MERCHANT_ID || ""
    );
    paymentData.append(
      "password",
      process.env.NEXT_PUBLIC_PAYSTATION_PASSWORD || ""
    );

    // Send request to PayStation
    const response = await axios.post(
      "https://api.paystation.com.bd/initiate-payment",
      paymentData,
      {
        headers: {
          ...paymentData.getHeaders(),
        },
      }
    );

    console.log("Response from PayStation:", response.data);

    if (response.data.status === "success") {
      return new NextResponse(
        JSON.stringify({ url: response.data.payment_url }),
        { status: 200 }
      );
    } else {
      return new NextResponse("Payment initiation failed", { status: 400 });
    }
  } catch (error) {
    console.error("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

