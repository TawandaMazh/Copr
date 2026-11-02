"use client";

import Image from "next/image";
import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BrandApplicationStatus } from "@/types/seller";

export default function AdminBrandsPage() {
  const user = useCommerceStore((s) => s.user);
  const brands = useCommerceStore((s) => s.platformBrands);
  const setBrandStatus = useCommerceStore((s) => s.setBrandStatus);

  if (!user || user.role !== "admin") return null;

  const pending = brands.filter((b) => b.status === "pending");
  const others = brands.filter((b) => b.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Brands</h1>
        <p className="text-muted-foreground">
          Approve or reject seller applications. Suspend live brands if needed.
        </p>
      </div>

      {brands.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">
          No seller applications yet. Apply via{" "}
          <Link href="/seller/apply" className="text-primary hover:underline">
            /seller/apply
          </Link>{" "}
          (status starts as pending).
        </GlassCard>
      ) : (
        <>
          {pending.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">
                Pending ({pending.length})
              </h2>
              <ul className="space-y-3">
                {pending.map((brand) => (
                  <BrandRow
                    key={brand.id}
                    brand={brand}
                    onStatus={(status) => setBrandStatus(brand.id, status)}
                  />
                ))}
              </ul>
            </section>
          )}

          {others.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">
                All brands
              </h2>
              <ul className="space-y-3">
                {others.map((brand) => (
                  <BrandRow
                    key={brand.id}
                    brand={brand}
                    onStatus={(status) => setBrandStatus(brand.id, status)}
                  />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function BrandRow({
  brand,
  onStatus,
}: {
  brand: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    location: string;
    logo: string;
    status: BrandApplicationStatus;
    contactEmail?: string;
    contactPhone?: string;
  };
  onStatus: (status: BrandApplicationStatus) => void;
}) {
  return (
    <GlassCard className="flex flex-wrap items-center gap-4 p-4">
      <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-ice dark:bg-navy/40">
        <Image
          src={brand.logo}
          alt=""
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold tracking-tight">{brand.name}</p>
          <Badge variant="outline" className="capitalize">
            {brand.status}
          </Badge>
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {brand.tagline} · {brand.location}
        </p>
        <p className="text-xs text-muted-foreground">
          {brand.contactEmail ?? "—"}
          {brand.contactPhone ? ` · ${brand.contactPhone}` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/brands/${brand.slug}`}>Public</Link>
        </Button>
        {brand.status === "pending" && (
          <>
            <Button size="sm" onClick={() => onStatus("approved")}>
              Approve
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onStatus("rejected")}
            >
              Reject
            </Button>
          </>
        )}
        {brand.status === "approved" && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onStatus("suspended")}
          >
            Suspend
          </Button>
        )}
        {(brand.status === "rejected" || brand.status === "suspended") && (
          <Button size="sm" onClick={() => onStatus("approved")}>
            Re-approve
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
