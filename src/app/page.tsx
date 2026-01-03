import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto">
        <Hero />
      </main>
    </div>
  );
}
