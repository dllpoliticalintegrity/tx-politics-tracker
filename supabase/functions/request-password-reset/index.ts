import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import RecoveryEmail from "../_shared/email-templates/recovery.tsx";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { email, siteUrl } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
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

    const baseUrl = siteUrl || "https://predictpolitics.org";

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${baseUrl}/reset-password`,
      },
    });

    if (linkError) {
      if (linkError.message?.includes("not found") || linkError.status === 404 || linkError.message?.includes("User")) {
        console.log("User not found for email (returning success anyway)");
        return new Response(JSON.stringify({ success: true }), {
          headers: jsonHeaders,
        });
      }
      throw linkError;
    }

    const actionLink = linkData?.properties?.action_link;
    if (!actionLink) {
      throw new Error("Failed to generate recovery link");
    }

    console.log("Generated recovery link for:", email);

    const html = `<!DOCTYPE html>${renderToStaticMarkup(
      createElement(RecoveryEmail, {
        siteName: "Predict Politics",
        siteUrl: baseUrl,
        recipient: email,
        confirmationUrl: actionLink,
      })
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
        to: [email],
        subject: "Reset your Predict Politics password",
        html,
        text: `Reset your password: ${actionLink}`,
      }),
    });

    if (!resendResponse.ok) {
      const errBody = await resendResponse.text();
      console.error("Resend API error:", resendResponse.status, errBody);
      throw new Error(`Resend API error: ${resendResponse.status}`);
    }

    const resendData = await resendResponse.json();
    console.log(`Password reset email sent via Resend to ${email}, id: ${resendData.id}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: jsonHeaders,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Password reset error:", err.message);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: jsonHeaders }
    );
  }
});
