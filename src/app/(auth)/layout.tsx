import { Navbar } from "@/components/landing/navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto flex items-center justify-center min-h-[calc(100vh-65px)]">
        <div className="w-full max-w-md p-8">{children}</div>
      </main>
    </div>
  );
}
