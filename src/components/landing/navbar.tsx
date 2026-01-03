import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Navbar() {
  return (
    <nav className="bg-background">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-8 py-4">
        <div className="text-xl font-semibold text-foreground">blobman</div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
