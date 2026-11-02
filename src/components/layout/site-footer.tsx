import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/shop?sort=newest", label: "New in" },
      { href: "/brands", label: "Brands" },
    ],
  },
  {
    title: "Sell",
    links: [
      { href: "/sell", label: "Sell on copr" },
      { href: "/seller/apply", label: "Apply to join" },
      { href: "/seller", label: "Seller dashboard" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/account", label: "Your account" },
      { href: "/shop", label: "Delivery (Lusaka)" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border-subtle">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-4">
        <div className="space-y-3">
          <p className="text-2xl font-semibold tracking-tight">copr</p>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Zambia’s multi-vendor fashion marketplace. Local brands. Local
            shoppers. Delivered across Lusaka.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-semibold tracking-wide text-foreground">
              {col.title}
            </p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} copr. Prices in Zambian Kwacha (K).</p>
          <p>Phase 3 · Seller dashboard</p>
        </div>
      </div>
    </footer>
  );
}
