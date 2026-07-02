import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

import SignupEmail from "../_shared/email-templates/signup.tsx";
import RecoveryEmail from "../_shared/email-templates/recovery.tsx";
import MagicLinkEmail from "../_shared/email-templates/magic-link.tsx";
import InviteEmail from "../_shared/email-templates/invite.tsx";
import EmailChangeEmail from "../_shared/email-templates/email-change.tsx";
import ReauthenticationEmail from "../_shared/email-templates/reauthentication.tsx";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

const jsonHeaders = { "Content-Type": "application/json" };
const previewHostPattern = /(localhost|127\.0\.0\.1|lovable|supabase\.co)/i;

const safeParseUrl = (value: string | undefined | null) => {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const getTokenHashFromActionLink = (actionLink: string) => {
  const url = safeParseUrl(actionLink);
  if (!url) return "";

  return (
    url.searchParams.get("token_hash") ??
    url.searchParams.get("token") ??
    url.searchParams.get("code") ??
    ""
  );
};

const isPreviewOrigin = (origin: string) => previewHostPattern.test(origin);

const emailTemplates: Record<string, { subject: string; component: any }> = {
  signup: {
    subject: "Confirm your Predict Politics account",
    component: SignupEmail,
  },
  recovery: {
    subject: "Reset your Predict Politics password",
    component: RecoveryEmail,
  },
  magiclink: {
    subject: "Your Predict Politics sign-in link",
    component: MagicLinkEmail,
  },
  invite: {
    subject: "You've been invited to Predict Politics",
    component: InviteEmail,
  },
  email_change: {
    subject: "Confirm your email change",
    component: EmailChangeEmail,
  },
  reauthentication: {
    subject: "Your verification code",
    component: ReauthenticationEmail,
  },
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const bodyText = await req.text();

  let rawPayload: any;
  try {
    rawPayload = JSON.parse(bodyText);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  // Handle Supabase Auth type-only probe payloads
  const isTypeOnlyProbe =
    Boolean(rawPayload?.type) &&
    !rawPayload?.user &&
    !rawPayload?.email_data &&
    !rawPayload?.email &&
    !rawPayload?.run_id &&
    !rawPayload?.data;

  if (isTypeOnlyProbe) {
    console.log("Received type-only probe payload:", rawPayload.type);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: jsonHeaders,
    });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    // Log full payload for debugging
    console.log("=== AUTH EMAIL HOOK PAYLOAD ===");
    console.log("Top-level keys:", Object.keys(rawPayload));
    console.log("rawPayload.email_data:", JSON.stringify(rawPayload?.email_data));
    console.log("rawPayload.data:", JSON.stringify(rawPayload?.data));
    console.log("rawPayload.user:", JSON.stringify(rawPayload?.user));

    const emailData =
      (rawPayload?.email_data && typeof rawPayload.email_data === "object" ? rawPayload.email_data : null) ??
      (rawPayload?.data && typeof rawPayload.data === "object" ? rawPayload.data : {});

    console.log("Resolved emailData keys:", Object.keys(emailData));
    console.log("emailData.token_hash:", emailData.token_hash);
    console.log("emailData.token:", emailData.token);
    console.log("emailData.action_link:", emailData.action_link);
    console.log("emailData.confirmation_url:", emailData.confirmation_url);
    console.log("emailData.redirect_to:", emailData.redirect_to);
    console.log("emailData.email_action_type:", emailData.email_action_type);
    console.log("emailData.site_url:", emailData.site_url);

    const recipient = emailData.email ?? rawPayload?.user?.email ?? rawPayload?.email ?? "";
    const emailActionType =
      emailData.email_action_type ??
      rawPayload?.email_action_type ??
      rawPayload?.type ??
      "";
    const token = emailData.token ?? "";
    const actionLink = emailData.action_link ?? emailData.confirmation_url ?? rawPayload?.action_link ?? rawPayload?.data?.action_link ?? "";
    const tokenHash =
      emailData.token_hash ??
      rawPayload?.token_hash ??
      getTokenHashFromActionLink(actionLink);

    console.log("Resolved values - recipient:", recipient, "type:", emailActionType, "tokenHash:", tokenHash ? tokenHash.substring(0, 20) + "..." : "(empty)", "actionLink:", actionLink ? actionLink.substring(0, 80) + "..." : "(empty)");

    const rawRedirectTo = emailData.redirect_to ?? rawPayload?.redirect_to ?? "";
    const redirectUrl = safeParseUrl(rawRedirectTo);
    const redirectOrigin = redirectUrl?.origin ?? "";

    const siteUrlFromPayload =
      safeParseUrl(emailData.site_url ?? rawPayload?.site_url)?.origin ?? "";
    const fallbackSiteUrl =
      Deno.env.get("SITE_URL") ??
      Deno.env.get("PUBLIC_SITE_URL") ??
      "https://predictpolitics.org";

    const siteUrl =
      redirectOrigin && !isPreviewOrigin(redirectOrigin)
        ? redirectOrigin
        : siteUrlFromPayload && !isPreviewOrigin(siteUrlFromPayload)
          ? siteUrlFromPayload
          : fallbackSiteUrl;

    const redirectTo =
      redirectOrigin && !isPreviewOrigin(redirectOrigin)
        ? rawRedirectTo
        : `${siteUrl}/login`;

    const newEmail = emailData.new_email ?? "";

    if (!recipient || !emailActionType) {
      throw new Error("Missing recipient or email_action_type in hook payload");
    }

    const template = emailTemplates[emailActionType];
    if (!template) {
      console.log(`Skipping unsupported email action type: ${emailActionType}`);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "https://qjsesvdduoriofiodumm.supabase.co";
    const useManualVerificationLink =
      (emailActionType === "signup" || emailActionType === "magiclink") && Boolean(tokenHash);

    const confirmationUrl = useManualVerificationLink
      ? `${siteUrl}/login?token_hash=${encodeURIComponent(tokenHash)}&type=${encodeURIComponent(emailActionType)}`
      : tokenHash
        ? `${supabaseUrl}/auth/v1/verify?token=${tokenHash}&type=${emailActionType}&redirect_to=${encodeURIComponent(redirectTo)}`
        : actionLink || redirectTo;

    console.log("=== GENERATED URL ===");
    console.log("siteUrl:", siteUrl);
    console.log("useManualVerificationLink:", useManualVerificationLink);
    console.log("confirmationUrl:", confirmationUrl);

    const html = `<!DOCTYPE html>${renderToStaticMarkup(
      createElement(template.component, {
        siteName: "Predict Politics",
        siteUrl,
        recipient,
        confirmationUrl,
        token,
        newEmail,
      }),
    )}`;

    // Send via Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Predict Politics <noreply@notify.predictpolitics.org>",
        to: [recipient],
        subject: template.subject,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errBody = await resendResponse.text();
      console.error("Resend API error:", resendResponse.status, errBody);
      throw new Error(`Resend API error: ${resendResponse.status} - ${errBody}`);
    }

    const resendData = await resendResponse.json();
    console.log(`Email sent via Resend: ${emailActionType} to ${recipient}, id: ${resendData.id}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: jsonHeaders,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Auth email hook error:", err.message);
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
