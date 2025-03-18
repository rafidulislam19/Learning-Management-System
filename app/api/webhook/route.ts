<<<<<<< HEAD
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
        }
        return new NextResponse(`Webhook Error: Unknown error`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
        }

        console.log("Session found!!!!");

        await db.purchase.create({
            data: {
                courseId,
                userId,
            }
        });
    } else {
        return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
}
=======
// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db'; // Ensure you have a db.ts file to initialize Prisma

// export async function POST(req: NextRequest) {
//     try {
//         const bodyText = await req.text(); // Get raw form data as text
//         console.log("Raw IPN Notification:", bodyText);

//         const body = Object.fromEntries(new URLSearchParams(bodyText).entries());
//         console.log("Parsed IPN Notification:", body);

//         const { status, tran_id, value_a: userId, value_b: courseId, amount, currency } = body;

//         if (status === 'VALID') {
//             console.log('Payment validated successfully for transaction ID:', tran_id);

//             // Use a transaction to ensure data consistency
//             await db.$transaction([
//                 // Save to Purchase model
//                 db.purchase.create({
//                     data: {
//                         userId,
//                         courseId,
//                     }
//                 }),
//                 // Save to TransactionHistory model
//                 db.transactionHistory.create({
//                     data: {
//                         transactionId: tran_id,
//                         status,
//                         userId,
//                         courseId,
//                         amount: parseFloat(amount),
//                         currency: currency || 'BDT', // Default to BDT if currency is not provided
//                     }
//                 })
//             ]);

//             return NextResponse.json({ message: 'Payment successful' });
//         } else {
//             console.log('Payment validation failed with status:', status);

//             // Log failed transactions as well
//             await db.transactionHistory.create({
//                 data: {
//                     transactionId: tran_id,
//                     status,
//                     userId,
//                     courseId,
//                     amount: parseFloat(amount),
//                     currency: currency || 'BDT',
//                 }
//             });

//             return NextResponse.json({ message: `Payment failed: ${status}` }, { status: 400 });
//         }
//     } catch (error) {
//         console.error("Error processing IPN request:", error);
//         return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//     }
// }


import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const invoice_number = url.searchParams.get("invoice_number") || "Unknown";
    const trx_id = url.searchParams.get("trx_id") || "N/A";

    console.log("📢 Received PayStation Payment Notification:", { status, invoice_number, trx_id });

    // ✅ Retrieve courseId and amount from database using transactionId
    const pendingTransaction = await db.pendingTransaction.findUnique({
      where: { transactionId: invoice_number },
    });

    if (!pendingTransaction) {
      console.error("❌ Transaction not found in PendingTransaction table.");
      return NextResponse.json({ message: "Invalid transaction" }, { status: 400 });
    }

    const { courseId, userId, amount, currency } = pendingTransaction;

    let redirectUrl;

    if (status === "Successful") {
      console.log("✅ Payment successful, saving to database...");

      // ✅ Save transaction in `purchase` and `transactionHistory`
      await db.$transaction([
        db.purchase.create({
          data: {
            userId,
            courseId,
          },
        }),
        db.transactionHistory.create({
          data: {
            transactionId: invoice_number,
            status,
            userId,
            courseId,
            amount,
            currency,
          },
        }),
      ]);

      // ✅ Cleanup: Delete the processed pending transaction
      await db.pendingTransaction.delete({
        where: { transactionId: invoice_number },
      });

      console.log("✅ Transaction saved and deleted from PendingTransaction table.");
      redirectUrl = `/courses/${courseId}/checkout/success?transactionId=${invoice_number}&courseId=${courseId}`;

    } else if (status === "Failed") {
      console.log("❌ Payment failed.");

      // ✅ Cleanup: Delete the processed pending transaction
      await db.pendingTransaction.delete({
        where: { transactionId: invoice_number },
      });

      console.log("✅ Transaction deleted after failure.");
      redirectUrl = `/courses/${courseId}/checkout/fail?transactionId=${invoice_number}&courseId=${courseId}`;

    } else {
      console.log("❌ Payment canceled by the user.");

      // ✅ Cleanup: Delete the processed pending transaction
      await db.pendingTransaction.delete({
        where: { transactionId: invoice_number },
      });

      console.log("✅ Transaction deleted after cancellation.");
      redirectUrl = `/courses/${courseId}/checkout/cancel?transactionId=${invoice_number}&courseId=${courseId}`;
    }

    // ✅ Construct correct origin (handles ngrok)
    const forwardedHost = req.headers.get("x-forwarded-host");
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const origin = forwardedHost ? `${protocol}://${forwardedHost}` : req.nextUrl.origin;
    console.log(`🌐 Detected origin: ${origin}`);

    // ✅ Redirect user
    const absoluteUrl = new URL(redirectUrl, origin);
    console.log("🔄 Redirecting to:", absoluteUrl);

    return NextResponse.redirect(absoluteUrl, 303);
  } catch (error) {
    console.error("❌ Error processing GET request for webhook:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
>>>>>>> a21e24b (Pay Station Integration)
