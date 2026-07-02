import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import SignupEmail from "../_shared/email-templates/signup.tsx";
import MagicLinkEmail from "../_shared/email-templates/magic-link.tsx";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { email, password, username, siteUrl } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const parsedSiteUrl = safeParseUrl(siteUrl);
    const baseUrl =
      parsedSiteUrl?.origin && !isPreviewOrigin(parsedSiteUrl.origin)
        ? parsedSiteUrl.origin
        : "https://predictpolitics.org";
    const redirectTo = `${baseUrl}/login`;

    let emailActionType: "signup" | "magiclink" = "signup";

    let { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        redirectTo,
        data: username ? { username } : undefined,
      },
    });

    if (linkError) {
      const msg = linkError.message?.toLowerCase() ?? "";
      const alreadyRegistered =
        msg.includes("already") ||
        msg.includes("registered") ||
        msg.includes("exists") ||
        linkError.status === 422;

      if (!alreadyRegistered) throw linkError;

      emailActionType = "magiclink";
      const magicLinkResult = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo },
      });

      linkData = magicLinkResult.data;
      linkError = magicLinkResult.error;
      if (linkError) throw linkError;
    }

    const actionLink = linkData?.properties?.action_link ?? "";
    const tokenHash =
      linkData?.properties?.hashed_token ??
      getTokenHashFromActionLink(actionLink);

    if (!actionLink && !tokenHash) {
      throw new Error("Failed to generate signup link");
    }

    const confirmationUrl = tokenHash
      ? `${baseUrl}/login?token_hash=${encodeURIComponent(tokenHash)}&type=${encodeURIComponent(emailActionType)}`
      : actionLink;

    const templateComponent = emailActionType === "signup" ? SignupEmail : MagicLinkEmail;
    const subject =
      emailActionType === "signup"
        ? "Confirm your Predict Politics account"
        : "Your Predict Politics sign-in link";

    const html = `<!DOCTYPE html>${renderToStaticMarkup(
      createElement(templateComponent, {
        siteName: "Predict Politics",
        siteUrl: baseUrl,
        recipient: email,
        confirmationUrl,
      }),
    )}`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Predict Politics <noreply@notify.predictpolitics.org>",
        to: [email],
        subject,
        html,
        text: `${subject}: ${confirmationUrl}`,
      }),
    });

    if (!resendResponse.ok) {
      const errBody = await resendResponse.text();
      console.error("Resend API error:", resendResponse.status, errBody);
      throw new Error(`Resend API error: ${resendResponse.status}`);
    }

    const resendData = await resendResponse.json();
    console.log(`Signup email sent via Resend (${emailActionType}) to ${email}, id: ${resendData.id}`);

    return new Response(JSON.stringify({ success: true, needsConfirmation: true }), {
      headers: jsonHeaders,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Request signup error:", err.message);

    return new Response(JSON.stringify({ error: err.message || "Failed to process signup" }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
