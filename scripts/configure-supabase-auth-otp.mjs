#!/usr/bin/env node
/**
 * Sets Supabase Auth Site URL + Magic Link email template so sign-in
 * emails include a 6-digit {{ .Token }} (and links go to production).
 *
 * Requires: SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)
 * Optional: SUPABASE_PROJECT_REF (default: koyosnsrparlhljvybok)
 *
 * Usage: node scripts/configure-supabase-auth-otp.mjs
 */

const REF = process.env.SUPABASE_PROJECT_REF || "koyosnsrparlhljvybok";
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SITE = (
  process.env.NEXT_PUBLIC_APP_URL || "https://copr-phi.vercel.app"
).replace(/\/$/, "");

if (!TOKEN) {
  console.error(
    "Missing SUPABASE_ACCESS_TOKEN. Create one at https://supabase.com/dashboard/account/tokens",
  );
  process.exit(1);
}

const MAGIC_LINK_SUBJECT = "Your copr sign-in code";
// OTP-only body: include {{ .Token }}, omit ConfirmationURL so users
// enter the code in the app instead of following a Site-URL link.
const MAGIC_LINK_CONTENT = `<h2>Your copr sign-in code</h2>
<p>Enter this 6-digit code on the copr sign-in screen:</p>
<p style="font-size:28px;letter-spacing:0.25em;font-weight:700">{{ .Token }}</p>
<p style="color:#666;font-size:14px">This code expires shortly. If you didn’t request it, you can ignore this email.</p>`;

const body = {
  site_url: SITE,
  uri_allow_list: [
    `${SITE}/**`,
    `${SITE}/auth/callback`,
    "http://localhost:3000/**",
    "http://localhost:3000/auth/callback",
  ].join(","),
  mailer_subjects_magic_link: MAGIC_LINK_SUBJECT,
  mailer_templates_magic_link_content: MAGIC_LINK_CONTENT,
};

const url = `https://api.supabase.com/v1/projects/${REF}/config/auth`;

const res = await fetch(url, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const text = await res.text();
if (!res.ok) {
  console.error(`Auth config update failed (${res.status}):`, text);
  process.exit(1);
}

console.log("Updated Auth config for", REF);
console.log("- site_url:", SITE);
console.log("- magic link subject:", MAGIC_LINK_SUBJECT);
console.log("- template includes {{ .Token }} for 6-digit OTP");
