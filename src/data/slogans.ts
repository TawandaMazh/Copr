/**
 * Copr brand slogans — playful “cop’d” voice for Lusaka fashion shoppers.
 * Use named keys for stable placements; use the list for rails / rotation.
 */

export const SLOGANS = {
  happyWithCopd: "I hope you’re happy with what you cop’d",
  goOnAndCop: "Go on. Cop something you love.",
  copLocal: "Cop local. Wear Zambian.",
  whatYouCopd: "It’s not just shopping — it’s what you cop’d.",
  bagReady: "Your bag’s ready. Are you?",
  savedLooks: "Saved looks. Future cops.",
  freshDrops: "Fresh drops. Fresh cops.",
  brandsThatShip: "Brands that ship. Looks that land.",
  lusakaDelivery: "From brand stock to Lusaka door.",
  checkoutSmooth: "Almost yours — finish the cop.",
  ordersTrack: "Track every cop from bag to door.",
  accountWelcome: "Your cops, your addresses, your account.",
  sellStory: "Stock your story. Let Lusaka cop it.",
  returnsSoft: "Wrong fit? We’ll help you un-cop it.",
  notFound: "That look took a wrong turn — let’s re-cop.",
  errorSoft: "Glitch in the cop. Try again.",
  emptyBag: "Nothing in here yet. Time to cop.",
  emptyWishlist: "No hearts yet. Spot it. Save it. Cop it.",
  emptyOrders: "Your first cop is waiting in the shop.",
  shopBrowse: "Browse. Fall for it. Cop it.",
  brandsDiscover: "Meet the labels Lusaka is copping.",
  categoriesPlay: "Pick a lane. Cop the vibe.",
  footerTag: "Copr — where Zambian fashion gets cop’d.",
  cartCheckout: "Looks good. Now cop it.",
  productNudge: "This could be your next cop.",
  deliveryPromise: "Cop today. Wear it soon.",
  authSignIn: "Sign in to keep every cop close.",
  homeAfterHero: "Local brands. Real stock. Ready to cop.",
} as const;

export type SloganKey = keyof typeof SLOGANS;

/** Ordered list for marquees / rails — “a lot” of voice without repeating keys. */
export const SLOGAN_RAIL: readonly string[] = [
  SLOGANS.happyWithCopd,
  SLOGANS.copLocal,
  SLOGANS.goOnAndCop,
  SLOGANS.whatYouCopd,
  SLOGANS.freshDrops,
  SLOGANS.brandsThatShip,
  SLOGANS.lusakaDelivery,
  SLOGANS.deliveryPromise,
  SLOGANS.shopBrowse,
  SLOGANS.bagReady,
  SLOGANS.savedLooks,
  SLOGANS.footerTag,
];

export function slogan(key: SloganKey): string {
  return SLOGANS[key];
}
