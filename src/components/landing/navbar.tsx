import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b border-border bg-background">
      <div className="text-xl font-semibold text-foreground">S3 Manager</div>
      <ThemeToggle />
    </nav>
  );
}
