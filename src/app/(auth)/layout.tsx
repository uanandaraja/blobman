import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { Navbar } from "@/components/landing/navbar";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto flex items-center justify-center min-h-[calc(100vh-65px)]">
        <div className="w-full max-w-md p-8">{children}</div>
      </main>
    </div>
  );
}
