import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export const metadata = {
  title: "Wealth Management",
  description: "Financial Planning and Wealth Management",
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (

    <ClerkProvider>


      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          {/* header */}

          <Header />

          {/* main content */}


          <main className="min-h-screen"> {children}</main>
          <Toaster richColors />


          {/* footer */}
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Made By Sayali Pitamber Patil</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
