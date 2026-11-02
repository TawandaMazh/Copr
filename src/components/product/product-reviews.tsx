"use client";

import { useState } from "react";
import Link from "next/link";
import { useCommerceStore } from "@/stores/commerce-store";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductReviews({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const user = useCommerceStore((s) => s.user);
  const allReviews = useCommerceStore((s) => s.reviews);
  const addReview = useCommerceStore((s) => s.addReview);
  const reviews = allReviews.filter(
    (r) => r.productId === productId && r.status === "published",
  );

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!user) {
      setError("Sign in to leave a review");
      return;
    }
    if (!title.trim() || !body.trim()) {
      setError("Add a title and review text");
      return;
    }
    addReview({
      productId,
      productName,
      rating,
      title: title.trim(),
      body: body.trim(),
    });
    setTitle("");
    setBody("");
    setError(null);
    setRating(5);
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
        <p className="text-sm text-muted-foreground">
          {reviews.length === 0
            ? "Be the first to review this piece."
            : `${reviews.length} published review${reviews.length === 1 ? "" : "s"}`}
        </p>
      </div>

      <GlassCard className="space-y-3 p-5">
        <p className="text-sm font-medium">Write a review</p>
        {!user ? (
          <p className="text-sm text-muted-foreground">
            <Link href="/account" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to share your fit notes.
          </p>
        ) : (
          <>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="rounded-lg px-2 py-1 text-lg focus-ring"
                  aria-label={`${n} stars`}
                >
                  {n <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Headline"
              className="w-full rounded-2xl border border-border-subtle bg-white/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:bg-navy/40"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="How was the quality, fit, and delivery?"
              rows={3}
              className="w-full rounded-2xl border border-border-subtle bg-white/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:bg-navy/40"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button size="sm" onClick={submit}>
              Post review
            </Button>
          </>
        )}
      </GlassCard>

      {reviews.length > 0 && (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <GlassCard key={review.id} className="space-y-2 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{review.title}</p>
                <Badge variant="outline">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{review.body}</p>
              <p className="text-xs text-muted-foreground">
                {review.userName} ·{" "}
                {new Date(review.createdAt).toLocaleDateString("en-ZM", {
                  dateStyle: "medium",
                })}
              </p>
            </GlassCard>
          ))}
        </ul>
      )}
    </section>
  );
}
