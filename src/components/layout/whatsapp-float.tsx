"use client";

import { MessageCircle } from "lucide-react";

function whatsappHref() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  const text = encodeURIComponent("Hi copr — I have a question about an order.");
  return `https://wa.me/${digits}?text=${text}`;
}

export function WhatsAppFloat() {
  const href = whatsappHref();
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="glass-strong fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-foreground shadow-glass-lg transition-transform hover:scale-[1.02] focus-ring"
    >
      <MessageCircle className="h-4 w-4 text-primary" strokeWidth={1.5} />
      Chat on WhatsApp
    </a>
  );
}
