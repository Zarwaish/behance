import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {/* pt-16 = 64px for mobile h-16 navbar, pt-20 = 80px for sm+ h-20 navbar */}
      <main className="min-h-screen pt-16 sm:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
