import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Hero />
      </main>
    </div>
  );
}
