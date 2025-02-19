// import type { Metadata } from "next";
// import { Space_Grotesk } from "next/font/google";
// import "./globals.css";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ToastProvider } from "@/components/providers/toaster-provider";
// import { ConfettiProvider } from "@/components/providers/confetti-provider";
// import { ThemeProvider } from "next-themes";

// const font = Space_Grotesk({
//   weight: ['300', '400', '500', '600', '700',],
//   subsets: ["latin"],
// });

// // const geistMono = Geist_Mono({
// //   variable: "--font-geist-mono",
// //   subsets: ["latin"],
// // });

// export const metadata: Metadata = {
//   title: "LMS",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <ClerkProvider>
//     <html lang="en">
//       <body
//         className={`${font.className} antialiased`}
//       >
//         <ConfettiProvider />
//         <ToastProvider />
//         <ThemeProvider attribute="class">
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//     </ClerkProvider>
//   );
// }


import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ThemeProvider } from "next-themes";

const font = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LMS",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${font.className} antialiased`}>
          <ConfettiProvider />
          <ToastProvider />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}