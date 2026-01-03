import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] p-8 bg-background">
      <h1 className="text-5xl font-bold text-foreground mb-4 text-center">
        blobman
      </h1>
      <p className="text-xl text-muted-foreground text-center max-w-lg mb-8">
        A simple app to manage your S3 and S3-compatible buckets.
      </p>
      <Button asChild size="lg">
        <Link href="/auth">Get Started</Link>
      </Button>
    </section>
  );
}
