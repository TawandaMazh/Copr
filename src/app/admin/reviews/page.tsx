"use client";

import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReviewStatus } from "@/types/admin";

export default function AdminReviewsPage() {
  const user = useCommerceStore((s) => s.user);
  const reviews = useCommerceStore((s) => s.reviews);
  const moderateReview = useCommerceStore((s) => s.moderateReview);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground">
          Hide, flag, or restore shopper product reviews.
        </p>
      </div>

      {reviews.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">
          No reviews yet. Shoppers can leave reviews on product pages after
          signing in.
        </GlassCard>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <GlassCard key={review.id} className="space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold tracking-tight">
                    {review.productName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {review.userName} · {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                </div>
                <Badge
                  variant={
                    review.status === "published"
                      ? "default"
                      : review.status === "flagged"
                        ? "secondary"
                        : "outline"
                  }
                  className="capitalize"
                >
                  {review.status}
                </Badge>
              </div>
              <div>
                <p className="font-medium">{review.title}</p>
                <p className="text-sm text-muted-foreground">{review.body}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["published", "hidden", "flagged"] as ReviewStatus[]).map(
                  (status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={
                        review.status === status ? "default" : "secondary"
                      }
                      disabled={review.status === status}
                      onClick={() => moderateReview(review.id, status)}
                    >
                      {status}
                    </Button>
                  ),
                )}
              </div>
            </GlassCard>
          ))}
        </ul>
      )}
    </div>
  );
}
