import { GlassNav } from "@/components/ui/glass-nav";
import { SiteFooter } from "./site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="atmosphere min-h-dvh">
      <GlassNav />
      <main className="w-full pb-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
