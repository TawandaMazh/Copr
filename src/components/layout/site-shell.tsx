import { GlassNav } from "@/components/ui/glass-nav";
import { SloganRail } from "@/components/brand/slogan-rail";
import { SkipLink } from "./skip-link";
import { SiteFooter } from "./site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="atmosphere min-h-dvh">
      <SkipLink />
      <GlassNav />
      <main id="main-content" tabIndex={-1} className="w-full pb-16 outline-none">
        {children}
      </main>
      <SloganRail tone="soft" className="mt-8" />
      <SiteFooter />
    </div>
  );
}
